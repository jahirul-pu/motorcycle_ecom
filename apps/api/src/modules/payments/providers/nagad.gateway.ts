import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payment } from '@prisma/client';
import {
  PaymentGateway,
  CreatePaymentResponse,
  VerifyPaymentResponse,
} from '../interfaces/payment-gateway.interface';

/**
 * Nagad Payment Gateway
 *
 * Flow:
 * 1. Initialize payment → get payment reference
 * 2. Redirect customer to Nagad payment page
 * 3. Customer authorizes
 * 4. Nagad calls our callback URL
 * 5. Complete payment and verify
 *
 * Note: Nagad uses RSA encryption for request signing. In sandbox mode without
 * credentials, we return mock responses to enable development without API keys.
 */
@Injectable()
export class NagadGateway implements PaymentGateway {
  private readonly logger = new Logger(NagadGateway.name);
  private readonly merchantId: string;
  private readonly isSandbox: boolean;
  private readonly baseUrl: string;
  private readonly appUrl: string;
  private readonly apiUrl: string;

  constructor(private configService: ConfigService) {
    this.merchantId = this.configService.get<string>('NAGAD_MERCHANT_ID') || '';
    this.isSandbox = true; // Nagad sandbox until production credentials are ready
    this.baseUrl = this.isSandbox
      ? 'http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs'
      : 'https://api.mynagad.com/api/dfs';
    this.appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    this.apiUrl = this.configService.get<string>('API_URL') || 'http://localhost:3001/api/v1';
  }

  async createPayment(order: any, payment: Payment): Promise<CreatePaymentResponse> {
    // Nagad integration requires RSA keys and encryption.
    // In sandbox without credentials, return mock response.
    if (!this.merchantId) {
      this.logger.warn('Nagad credentials not configured. Returning mock session for sandbox.');
      return {
        status: 'Pending',
        gatewayReference: `NAGAD-MOCK-${Date.now()}`,
        redirectUrl: `${this.appUrl}/payment/pending?order=${order.id}&mock=true&method=nagad`,
      };
    }

    try {
      const orderId = `${order.orderNumber}-${Date.now()}`;
      const callbackUrl = `${this.apiUrl}/payments/callback/nagad?orderId=${order.id}`;

      // Step 1: Initialize payment
      const initResponse = await fetch(
        `${this.baseUrl}/check-out/initialize/${this.merchantId}/${orderId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dateTime: new Date().toISOString(),
            sensitiveData: JSON.stringify({
              merchantId: this.merchantId,
              orderId,
              currencyCode: '050', // BDT
              challenge: Math.random().toString(36).substring(7),
            }),
          }),
        },
      );

      const initData = await initResponse.json();

      if (initData.paymentReferenceId) {
        // Step 2: Complete checkout
        const completeResponse = await fetch(
          `${this.baseUrl}/check-out/complete/${initData.paymentReferenceId}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sensitiveData: JSON.stringify({
                merchantId: this.merchantId,
                orderId,
                currencyCode: '050',
                amount: payment.amount.toString(),
                challenge: initData.challenge,
              }),
              callbackURL: callbackUrl,
            }),
          },
        );

        const completeData = await completeResponse.json();

        if (completeData.callBackUrl) {
          this.logger.log(`Nagad payment initialized for order ${order.orderNumber}`);
          return {
            status: 'Pending',
            gatewayReference: initData.paymentReferenceId,
            redirectUrl: completeData.callBackUrl,
          };
        }
      }

      this.logger.error(`Nagad init failed: ${JSON.stringify(initData)}`);
      return { status: 'Failed' };
    } catch (error: any) {
      this.logger.error(`Nagad create error: ${error.message}`);
      return { status: 'Failed' };
    }
  }

  async verifyPayment(payment: Payment, queryParams: any): Promise<VerifyPaymentResponse> {
    // If called with a direct payment reference from callback
    const paymentRefId = queryParams?.payment_ref_id || payment.gatewayReference;

    if (!paymentRefId) {
      return { status: 'Pending', rawResponse: queryParams };
    }

    if (!this.merchantId) {
      // Mock sandbox verification
      if (queryParams?.status === 'Success') {
        return {
          status: 'Paid',
          transactionId: `NAGAD-TXN-${Date.now()}`,
          gatewayReference: paymentRefId,
        };
      }
      return { status: 'Pending', gatewayReference: paymentRefId };
    }

    try {
      const response = await fetch(`${this.baseUrl}/verify/payment/${paymentRefId}`, {
        method: 'GET',
      });
      const data = await response.json();

      if (data.status === 'Success') {
        this.logger.log(`Nagad payment verified: ${data.orderId}`);
        return {
          status: 'Paid',
          transactionId: data.issuerPaymentRefNo,
          gatewayReference: paymentRefId,
          rawResponse: data,
        };
      }

      return {
        status: data.status === 'Failed' ? 'Failed' : 'Pending',
        gatewayReference: paymentRefId,
        rawResponse: data,
      };
    } catch (error: any) {
      this.logger.error(`Nagad verify error: ${error.message}`);
      return { status: 'Pending', gatewayReference: paymentRefId };
    }
  }
}
