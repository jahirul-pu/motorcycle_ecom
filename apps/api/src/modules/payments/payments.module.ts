import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { CodPaymentGateway } from './providers/cod.gateway';
import { SslcommerzGateway } from './providers/sslcommerz.gateway';
import { BkashGateway } from './providers/bkash.gateway';
import { NagadGateway } from './providers/nagad.gateway';
import { RocketGateway } from './providers/rocket.gateway';
import { PaymentGatewayFactory } from './providers/payment-gateway.factory';
import { PrismaModule } from '../database/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, NotificationsModule, ConfigModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    CodPaymentGateway,
    SslcommerzGateway,
    BkashGateway,
    NagadGateway,
    RocketGateway,
    PaymentGatewayFactory,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
