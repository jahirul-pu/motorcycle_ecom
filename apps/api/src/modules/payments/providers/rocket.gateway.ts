import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payment } from '@prisma/client';
import {
  PaymentGateway,
  CreatePaymentResponse,
  VerifyPaymentResponse,
} from '../interfaces/payment-gateway.interface';

/**
 * Rocket (Dutch-Bangla Mobile Banking) Payment Gateway
 *
 * Rocket does not currently provide a public merchant API for automated
 * payment integration. This gateway acts as a placeholder that:
 *
 * 1. Instructs the customer to send money manually to the merchant Rocket number.
 * 2. Records the transaction reference the customer provides.
 * 3. Allows admin verification of the manual transfer.
 *
 * When Rocket releases a merchant API, this class can be updated without
 * changing the checkout flow — the adapter pattern isolates the change.
 */
@Injectable()
export class RocketGateway implements PaymentGateway {
  private readonly logger = new Logger(RocketGateway.name);
  private readonly appUrl: string;

  constructor(private configService: ConfigService) {
    this.appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
  }

  async createPayment(order: any, payment: Payment): Promise<CreatePaymentResponse> {
    this.logger.log(
      `Rocket payment created for order ${order.orderNumber}. Awaiting manual transfer.`,
    );

    // Rocket is manual — we create the payment in Pending and redirect the
    // customer to a page that displays transfer instructions.
    return {
      status: 'Pending',
      gatewayReference: `ROCKET-${order.orderNumber}`,
      redirectUrl: `${this.appUrl}/payment/pending?order=${order.id}&method=rocket`,
    };
  }

  async verifyPayment(payment: Payment, queryParams: any): Promise<VerifyPaymentResponse> {
    // Rocket verification is always manual (admin marks as paid)
    if (queryParams?.status === 'Paid' || queryParams?.adminVerified === true) {
      return {
        status: 'Paid',
        transactionId: queryParams?.transactionId || undefined,
        gatewayReference: payment.gatewayReference || undefined,
        rawResponse: queryParams,
      };
    }

    return {
      status: 'Pending',
      gatewayReference: payment.gatewayReference || undefined,
      rawResponse: queryParams,
    };
  }
}
