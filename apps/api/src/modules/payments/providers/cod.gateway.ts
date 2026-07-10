import { Injectable } from '@nestjs/common';
import { Payment } from '@prisma/client';
import {
  PaymentGateway,
  CreatePaymentResponse,
  VerifyPaymentResponse,
} from '../interfaces/payment-gateway.interface';

@Injectable()
export class CodPaymentGateway implements PaymentGateway {
  async createPayment(order: any, payment: Payment): Promise<CreatePaymentResponse> {
    // For COD, payment is instantly created in Pending state, and no redirect is needed.
    return {
      status: 'Pending',
      gatewayReference: `COD-${order.orderNumber}`,
    };
  }

  async verifyPayment(payment: Payment, queryParams: any): Promise<VerifyPaymentResponse> {
    // For COD, verification can be manual (triggered by admin upon delivery)
    return {
      status: (queryParams?.status === 'Paid' ? 'Paid' : 'Pending') as any,
      gatewayReference: payment.gatewayReference || undefined,
      transactionId: queryParams?.transactionId || undefined,
    };
  }
}
