import { Injectable, BadRequestException } from '@nestjs/common';
import { CodPaymentGateway } from './cod.gateway';
import { SslcommerzGateway } from './sslcommerz.gateway';
import { BkashGateway } from './bkash.gateway';
import { NagadGateway } from './nagad.gateway';
import { RocketGateway } from './rocket.gateway';
import { PaymentGateway } from '../interfaces/payment-gateway.interface';

@Injectable()
export class PaymentGatewayFactory {
  constructor(
    private codGateway: CodPaymentGateway,
    private sslcommerzGateway: SslcommerzGateway,
    private bkashGateway: BkashGateway,
    private nagadGateway: NagadGateway,
    private rocketGateway: RocketGateway,
  ) {}

  getGateway(method: string): PaymentGateway {
    switch (method) {
      case 'Cash on Delivery':
        return this.codGateway;
      case 'SSLCommerz':
        return this.sslcommerzGateway;
      case 'bKash':
        return this.bkashGateway;
      case 'Nagad':
        return this.nagadGateway;
      case 'Rocket':
        return this.rocketGateway;
      default:
        throw new BadRequestException(`Unsupported payment method: ${method}`);
    }
  }
}
