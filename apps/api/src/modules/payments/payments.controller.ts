import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsOptional } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { Response } from 'express';

export class CreatePaymentSessionDto {
  @IsString()
  orderId: string;
}

export class AdminUpdatePaymentDto {
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  transactionId?: string;
}

export class AdminUpdateOrderDto {
  @IsString()
  status: string;
}

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  private readonly appUrl: string;

  constructor(
    private paymentsService: PaymentsService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a payment session for an order' })
  @ApiResponse({ status: 200, description: 'Payment session created.' })
  createSession(@Request() req, @Body() dto: CreatePaymentSessionDto) {
    return this.paymentsService.createPaymentSession(req.user.id, dto.orderId);
  }

  @Post('verify/:orderId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify a payment' })
  @ApiResponse({ status: 200, description: 'Payment verified.' })
  verify(@Param('orderId') orderId: string, @Body() payload: any) {
    return this.paymentsService.verifyPayment(orderId, payload);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment details' })
  @ApiResponse({ status: 200, description: 'Payment details returned.' })
  getPayment(@Request() req, @Param('id') id: string) {
    return this.paymentsService.getPayment(req.user.id, id);
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment details by order ID' })
  @ApiResponse({ status: 200, description: 'Payment details returned.' })
  getPaymentByOrderId(@Request() req, @Param('orderId') orderId: string) {
    return this.paymentsService.getPaymentByOrderId(req.user.id, orderId);
  }

  // --- Gateway Callbacks ---

  @Post('callback/sslcommerz/success')
  @ApiOperation({ summary: 'SSLCommerz Success Callback' })
  async sslcommerzSuccess(@Body() payload: any, @Res() res: Response) {
    const paymentId = payload.value_b;
    const orderId = payload.value_a;
    await this.paymentsService.markAsPaid(paymentId, payload.tran_id, payload);
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    return res.redirect(
      `${this.appUrl}/order-success?order=${order?.orderNumber || ''}&id=${orderId}`,
    );
  }

  @Post('callback/sslcommerz/fail')
  @ApiOperation({ summary: 'SSLCommerz Failure Callback' })
  async sslcommerzFail(@Body() payload: any, @Res() res: Response) {
    const paymentId = payload.value_b;
    const orderId = payload.value_a;
    await this.paymentsService.markAsFailed(paymentId, payload);
    return res.redirect(`${this.appUrl}/payment/failure?id=${orderId}`);
  }

  @Post('callback/sslcommerz/cancel')
  @ApiOperation({ summary: 'SSLCommerz Cancel Callback' })
  async sslcommerzCancel(@Body() payload: any, @Res() res: Response) {
    const paymentId = payload.value_b;
    const orderId = payload.value_a;
    await this.paymentsService.markAsFailed(paymentId, payload);
    return res.redirect(`${this.appUrl}/payment/cancelled?id=${orderId}`);
  }

  @Post('callback/sslcommerz/ipn')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SSLCommerz Instant Payment Notification (IPN)' })
  async sslcommerzIpn(@Body() payload: any) {
    const paymentId = payload.value_b;
    if (payload.status === 'VALID' || payload.status === 'VALIDATED') {
      await this.paymentsService.markAsPaid(paymentId, payload.tran_id, payload);
    } else {
      await this.paymentsService.markAsFailed(paymentId, payload);
    }
    return { status: 'OK' };
  }

  @Get('callback/bkash')
  @ApiOperation({ summary: 'bKash Callback' })
  async bkashCallback(
    @Query('paymentID') paymentID: string,
    @Query('status') status: string,
    @Query('orderId') orderId: string,
    @Res() res: Response,
  ) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
      include: { order: true },
    });

    if (!payment) {
      return res.redirect(`${this.appUrl}/payment/failure?id=${orderId}`);
    }

    if (status === 'success') {
      const verification = await this.paymentsService.verifyPayment(orderId, { status, paymentID });
      if (verification.status === 'Paid') {
        return res.redirect(
          `${this.appUrl}/order-success?order=${payment.order.orderNumber}&id=${orderId}`,
        );
      }
    } else {
      await this.paymentsService.markAsFailed(payment.id, { status, paymentID });
    }

    return res.redirect(`${this.appUrl}/payment/failure?id=${orderId}`);
  }

  @Get('callback/nagad')
  @ApiOperation({ summary: 'Nagad Callback' })
  async nagadCallback(
    @Query('order_id') orderIdParam: string,
    @Query('payment_ref_id') paymentRefId: string,
    @Query('status') status: string,
    @Res() res: Response,
  ) {
    const payment = await this.prisma.payment.findFirst({
      where: { gatewayReference: paymentRefId },
      include: { order: true },
    });

    if (!payment) {
      return res.redirect(`${this.appUrl}/payment/failure`);
    }

    if (status === 'Success') {
      const verification = await this.paymentsService.verifyPayment(payment.orderId, {
        status,
        payment_ref_id: paymentRefId,
      });
      if (verification.status === 'Paid') {
        return res.redirect(
          `${this.appUrl}/order-success?order=${payment.order.orderNumber}&id=${payment.orderId}`,
        );
      }
    } else {
      await this.paymentsService.markAsFailed(payment.id, { status, paymentRefId });
    }

    return res.redirect(`${this.appUrl}/payment/failure?id=${payment.orderId}`);
  }

  // --- Admin manual status updates ---

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin manual update of payment status' })
  @ApiResponse({ status: 200, description: 'Payment status updated.' })
  adminUpdatePaymentStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: AdminUpdatePaymentDto,
  ) {
    return this.paymentsService.adminUpdatePaymentStatus(
      req.user.id,
      id,
      dto.status,
      dto.transactionId,
    );
  }

  @Patch('orders/:orderId/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin manual update of order status' })
  @ApiResponse({ status: 200, description: 'Order status updated.' })
  adminUpdateOrderStatus(
    @Request() req,
    @Param('orderId') orderId: string,
    @Body() dto: AdminUpdateOrderDto,
  ) {
    return this.paymentsService.adminUpdateOrderStatus(req.user.id, orderId, dto.status);
  }
}
