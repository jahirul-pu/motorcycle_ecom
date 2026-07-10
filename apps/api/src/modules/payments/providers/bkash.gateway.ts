import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payment } from '@prisma/client';
import {
  PaymentGateway,
  CreatePaymentResponse,
  VerifyPaymentResponse,
} from '../interfaces/payment-gateway.interface';

/**
 * bKash Payment Gateway
 *
 * Flow:
 * 1. Grant token (app_key + app_secret → token)
 * 2. Create payment (token + payment details → paymentID + bkashURL)
 * 3. Redirect customer to bkashURL
 * 4. Customer authorizes on bKash
 * 5. Execute payment (paymentID → transactionStatus)
 *
 * Sandbox: https://tokenized.sandbox.bka.sh/v1.2.0-beta
 * Production: https://tokenized.pay.bka.sh/v1.2.0-beta
 */
@Injectable()
export class BkashGateway implements PaymentGateway {
  private readonly logger = new Logger(BkashGateway.name);
  private readonly appKey: string;
  private readonly appSecret: string;
  private readonly username: string;
  private readonly password: string;
  private readonly isSandbox: boolean;
  private readonly baseUrl: string;
  private readonly appUrl: string;
  private readonly apiUrl: string;

  constructor(private configService: ConfigService) {
    this.appKey = this.configService.get<string>('BKASH_APP_KEY') || '';
    this.appSecret = this.configService.get<string>('BKASH_APP_SECRET') || '';
    this.username = this.configService.get<string>('BKASH_USERNAME') || '';
    this.password = this.configService.get<string>('BKASH_PASSWORD') || '';
    this.isSandbox = this.configService.get<string>('BKASH_SANDBOX') !== 'false';
    this.baseUrl = this.isSandbox
      ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
      : 'https://tokenized.pay.bka.sh/v1.2.0-beta';
    this.appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    this.apiUrl = this.configService.get<string>('API_URL') || 'http://localhost:3001/api/v1';
  }

  private async grantToken(): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/tokenized/checkout/token/grant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          username: this.username,
          password: this.password,
        },
        body: JSON.stringify({
          app_key: this.appKey,
          app_secret: this.appSecret,
        }),
      });

      const data = await response.json();
      if (data.id_token) {
        return data.id_token;
      }
      this.logger.error(`bKash token grant failed: ${JSON.stringify(data)}`);
      return null;
    } catch (error: any) {
      this.logger.error(`bKash token grant error: ${error.message}`);
      return null;
    }
  }

  async createPayment(order: any, payment: Payment): Promise<CreatePaymentResponse> {
    // In sandbox without credentials, return mock
    if (this.isSandbox && !this.appKey) {
      this.logger.warn('bKash credentials not configured. Returning mock session for sandbox.');
      return {
        status: 'Pending',
        gatewayReference: `BKASH-MOCK-${Date.now()}`,
        redirectUrl: `${this.appUrl}/payment/pending?order=${order.id}&mock=true&method=bkash`,
      };
    }

    const token = await this.grantToken();
    if (!token) {
      return { status: 'Failed' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/tokenized/checkout/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
          'X-APP-Key': this.appKey,
        },
        body: JSON.stringify({
          mode: '0011',
          payerReference: order.userId,
          callbackURL: `${this.apiUrl}/payments/callback/bkash?orderId=${order.id}`,
          amount: payment.amount.toString(),
          currency: 'BDT',
          intent: 'sale',
          merchantInvoiceNumber: order.orderNumber,
        }),
      });

      const data = await response.json();

      if (data.paymentID && data.bkashURL) {
        this.logger.log(`bKash payment created: paymentID=${data.paymentID}`);
        return {
          status: 'Pending',
          gatewayReference: data.paymentID,
          redirectUrl: data.bkashURL,
        };
      }

      this.logger.error(`bKash create failed: ${JSON.stringify(data)}`);
      return { status: 'Failed' };
    } catch (error: any) {
      this.logger.error(`bKash create error: ${error.message}`);
      return { status: 'Failed' };
    }
  }

  async verifyPayment(payment: Payment, queryParams: any): Promise<VerifyPaymentResponse> {
    const paymentID = queryParams?.paymentID || payment.gatewayReference;

    if (!paymentID) {
      return { status: 'Pending', rawResponse: queryParams };
    }

    // If we have a status directly from callback
    if (queryParams?.status === 'success') {
      return this.executePayment(paymentID);
    }

    if (queryParams?.status === 'failure' || queryParams?.status === 'cancel') {
      return {
        status: 'Failed',
        gatewayReference: paymentID,
        rawResponse: queryParams,
      };
    }

    // Direct query for status
    return this.queryPayment(paymentID);
  }

  private async executePayment(paymentID: string): Promise<VerifyPaymentResponse> {
    if (this.isSandbox && !this.appKey) {
      return {
        status: 'Paid',
        transactionId: `BKASH-TXN-${Date.now()}`,
        gatewayReference: paymentID,
      };
    }

    const token = await this.grantToken();
    if (!token) {
      return { status: 'Pending', gatewayReference: paymentID };
    }

    try {
      const response = await fetch(`${this.baseUrl}/tokenized/checkout/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
          'X-APP-Key': this.appKey,
        },
        body: JSON.stringify({ paymentID }),
      });

      const data = await response.json();

      if (data.transactionStatus === 'Completed') {
        this.logger.log(`bKash payment executed: trxID=${data.trxID}`);
        return {
          status: 'Paid',
          transactionId: data.trxID,
          gatewayReference: data.paymentID,
          rawResponse: data,
        };
      }

      return {
        status: 'Failed',
        gatewayReference: paymentID,
        rawResponse: data,
      };
    } catch (error: any) {
      this.logger.error(`bKash execute error: ${error.message}`);
      return { status: 'Pending', gatewayReference: paymentID };
    }
  }

  private async queryPayment(paymentID: string): Promise<VerifyPaymentResponse> {
    if (this.isSandbox && !this.appKey) {
      return { status: 'Pending', gatewayReference: paymentID };
    }

    const token = await this.grantToken();
    if (!token) {
      return { status: 'Pending', gatewayReference: paymentID };
    }

    try {
      const response = await fetch(`${this.baseUrl}/tokenized/checkout/payment/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
          'X-APP-Key': this.appKey,
        },
        body: JSON.stringify({ paymentID }),
      });

      const data = await response.json();

      if (data.transactionStatus === 'Completed') {
        return {
          status: 'Paid',
          transactionId: data.trxID,
          gatewayReference: data.paymentID,
          rawResponse: data,
        };
      }

      return {
        status: data.transactionStatus === 'Initiated' ? 'Pending' : 'Failed',
        gatewayReference: paymentID,
        rawResponse: data,
      };
    } catch (error: any) {
      this.logger.error(`bKash query error: ${error.message}`);
      return { status: 'Pending', gatewayReference: paymentID };
    }
  }
}
