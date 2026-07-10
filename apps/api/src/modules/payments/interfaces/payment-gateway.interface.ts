import { Payment } from '@prisma/client';

export interface CreatePaymentResponse {
  gatewayReference?: string;
  redirectUrl?: string;
  status: 'Pending' | 'Paid' | 'Failed';
}

export interface VerifyPaymentResponse {
  status: 'Pending' | 'Paid' | 'Failed';
  gatewayReference?: string;
  transactionId?: string;
  rawResponse?: any;
}

export interface PaymentGateway {
  createPayment(order: any, payment: Payment): Promise<CreatePaymentResponse>;
  verifyPayment(payment: Payment, queryParams: any): Promise<VerifyPaymentResponse>;
}
