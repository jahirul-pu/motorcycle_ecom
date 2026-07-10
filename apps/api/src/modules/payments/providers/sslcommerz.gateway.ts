import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payment } from '@prisma/client';
import {
  PaymentGateway,
  CreatePaymentResponse,
  VerifyPaymentResponse,
} from '../interfaces/payment-gateway.interface';

/**
 * SSLCommerz Payment Gateway
 *
 * Flow:
 * 1. createPayment  → POST to SSLCommerz init API → returns GatewayPageURL (redirect)
 * 2. Customer pays on SSLCommerz hosted page
 * 3. SSLCommerz POSTs back to our success/fail/cancel URLs
 * 4. verifyPayment  → POST to SSLCommerz validation API with val_id → confirms payment
 *
 * In sandbox mode, all calls go to sandbox.sslcommerz.com
 * In production, calls go to securepay.sslcommerz.com
 */
@Injectable()
export class SslcommerzGateway implements PaymentGateway {
  private readonly logger = new Logger(SslcommerzGateway.name);
  private readonly storeId: string;
  private readonly storePassword: string;
  private readonly isSandbox: boolean;
  private readonly baseUrl: string;
  private readonly appUrl: string;
  private readonly apiUrl: string;

  constructor(private configService: ConfigService) {
    this.storeId = this.configService.get<string>('SSLCOMMERZ_STORE_ID') || '';
    this.storePassword = this.configService.get<string>('SSLCOMMERZ_STORE_PASSWORD') || '';
    this.isSandbox = this.configService.get<string>('SSLCOMMERZ_SANDBOX') !== 'false';
    this.baseUrl = this.isSandbox
      ? 'https://sandbox.sslcommerz.com'
      : 'https://securepay.sslcommerz.com';
    this.appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    this.apiUrl = this.configService.get<string>('API_URL') || 'http://localhost:3001/api/v1';
  }

  async createPayment(order: any, payment: Payment): Promise<CreatePaymentResponse> {
    const addressSnapshot = order.addressSnapshot as any;

    const params = new URLSearchParams();
    params.append('store_id', this.storeId);
    params.append('store_passwd', this.storePassword);
    params.append('total_amount', payment.amount.toString());
    params.append('currency', 'BDT');
    params.append('tran_id', `${order.orderNumber}-${Date.now()}`);
    params.append('success_url', `${this.apiUrl}/payments/callback/sslcommerz/success`);
    params.append('fail_url', `${this.apiUrl}/payments/callback/sslcommerz/fail`);
    params.append('cancel_url', `${this.apiUrl}/payments/callback/sslcommerz/cancel`);
    params.append('ipn_url', `${this.apiUrl}/payments/callback/sslcommerz/ipn`);
    params.append('cus_name', addressSnapshot?.recipientName || 'Customer');
    params.append('cus_email', 'customer@motohub.com');
    params.append('cus_phone', addressSnapshot?.phone || '01700000000');
    params.append('cus_add1', addressSnapshot?.addressLine1 || 'N/A');
    params.append('cus_city', addressSnapshot?.city || 'Dhaka');
    params.append('cus_country', 'Bangladesh');
    params.append('shipping_method', 'Courier');
    params.append('product_name', `MotoHub Order ${order.orderNumber}`);
    params.append('product_category', 'Motorcycle Parts');
    params.append('product_profile', 'physical-goods');
    params.append('value_a', order.id); // Pass orderId for callback reference
    params.append('value_b', payment.id); // Pass paymentId for callback reference

    try {
      const response = await fetch(`${this.baseUrl}/gwprocess/v4/api.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      const data = await response.json();

      if (data.status === 'SUCCESS') {
        this.logger.log(`SSLCommerz session created: ${data.sessionkey}`);
        return {
          status: 'Pending',
          gatewayReference: data.sessionkey,
          redirectUrl: data.GatewayPageURL,
        };
      }

      this.logger.error(`SSLCommerz init failed: ${data.failedreason || JSON.stringify(data)}`);
      return {
        status: 'Failed',
        gatewayReference: undefined,
      };
    } catch (error: any) {
      this.logger.error(`SSLCommerz API error: ${error.message}`);
      // In development/sandbox without credentials, return a mock redirect
      if (this.isSandbox && !this.storeId) {
        this.logger.warn(
          'SSLCommerz credentials not configured. Returning mock session for sandbox.',
        );
        return {
          status: 'Pending',
          gatewayReference: `SSLCZ-MOCK-${Date.now()}`,
          redirectUrl: `${this.appUrl}/payment/pending?order=${order.id}&mock=true`,
        };
      }
      return { status: 'Failed' };
    }
  }

  async verifyPayment(payment: Payment, queryParams: any): Promise<VerifyPaymentResponse> {
    const valId = queryParams?.val_id;

    if (!valId) {
      // If no val_id, check if this is a direct status check
      if (queryParams?.status === 'VALID' || queryParams?.status === 'VALIDATED') {
        return {
          status: 'Paid',
          transactionId: queryParams?.tran_id,
          gatewayReference: queryParams?.sessionkey,
          rawResponse: queryParams,
        };
      }
      return { status: 'Pending', rawResponse: queryParams };
    }

    try {
      const params = new URLSearchParams();
      params.append('store_id', this.storeId);
      params.append('store_passwd', this.storePassword);
      params.append('val_id', valId);

      const response = await fetch(
        `${this.baseUrl}/validator/api/validationserverAPI.php?${params.toString()}`,
      );
      const data = await response.json();

      if (data.status === 'VALID' || data.status === 'VALIDATED') {
        this.logger.log(`SSLCommerz payment verified: tran_id=${data.tran_id}`);
        return {
          status: 'Paid',
          transactionId: data.tran_id,
          gatewayReference: data.sessionkey,
          rawResponse: data,
        };
      }

      this.logger.warn(`SSLCommerz verification returned status: ${data.status}`);
      return {
        status: 'Failed',
        rawResponse: data,
      };
    } catch (error: any) {
      this.logger.error(`SSLCommerz verification error: ${error.message}`);
      return { status: 'Pending', rawResponse: { error: error.message } };
    }
  }
}
