import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PaymentGatewayFactory } from './providers/payment-gateway.factory';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private gatewayFactory: PaymentGatewayFactory,
    private notificationsService: NotificationsService,
  ) {}

  async createPaymentSession(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!order.payment) {
      throw new BadRequestException('No payment record associated with this order');
    }

    if (order.payment.status === 'Paid') {
      throw new BadRequestException('Order has already been paid');
    }

    const gateway = this.gatewayFactory.getGateway(order.payment.method);
    const result = await gateway.createPayment(order, order.payment);

    // Update payment with gateway reference and status
    const updatedPayment = await this.prisma.payment.update({
      where: { id: order.payment.id },
      data: {
        gateway: order.payment.method,
        gatewayReference: result.gatewayReference,
        status: result.status,
      },
    });

    this.logger.log(
      `Payment session created for Order ${order.orderNumber} via ${order.payment.method}`,
    );

    return {
      payment: updatedPayment,
      redirectUrl: result.redirectUrl,
    };
  }

  async verifyPayment(orderId: string, queryParams: any) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    if (payment.status === 'Paid') {
      return payment;
    }

    const gateway = this.gatewayFactory.getGateway(payment.method);
    const verification = await gateway.verifyPayment(payment, queryParams);

    if (verification.status === 'Paid') {
      return this.markAsPaid(payment.id, verification.transactionId, verification.rawResponse);
    } else if (verification.status === 'Failed') {
      return this.markAsFailed(payment.id, verification.rawResponse);
    }

    return payment;
  }

  async markAsPaid(paymentId: string, transactionId?: string, rawResponse?: any) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { order: true },
      });

      if (!payment) throw new NotFoundException('Payment not found');
      if (payment.status === 'Paid') return payment;

      // Update payment
      const updatedPayment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: 'Paid',
          transactionId: transactionId || payment.transactionId,
          paidAt: new Date(),
          metadata: rawResponse || undefined,
        },
      });

      // Update order status
      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: 'Paid',
          status: payment.order.status === 'Pending' ? 'Confirmed' : payment.order.status,
        },
      });

      // Release reserved inventory and record sale
      const orderItems = await tx.orderItem.findMany({
        where: { orderId: payment.orderId },
        include: { product: { include: { inventory: true } } },
      });

      for (const item of orderItems) {
        if (item.product.inventory) {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: {
              reservedQuantity: { decrement: item.quantity },
            },
          });

          await tx.inventoryTransaction.create({
            data: {
              inventoryId: item.product.inventory.id,
              type: 'Sale',
              quantity: -item.quantity,
              reference: payment.order.orderNumber,
            },
          });
        }
      }

      this.logger.log(
        `Payment ${paymentId} marked as Paid. Order ${payment.order.orderNumber} confirmed.`,
      );

      // Send notification
      await this.notificationsService.createNotification(
        payment.order.userId,
        'Payment Received',
        `We have received your payment of ৳${payment.amount} for order ${payment.order.orderNumber}.`,
      );

      return updatedPayment;
    });
  }

  async markAsFailed(paymentId: string, rawResponse?: any) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { order: true },
      });

      if (!payment) throw new NotFoundException('Payment not found');
      if (payment.status === 'Failed') return payment;

      // Update payment
      const updatedPayment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: 'Failed',
          metadata: rawResponse || undefined,
        },
      });

      // Update order status
      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: 'Failed',
        },
      });

      this.logger.warn(
        `Payment ${paymentId} marked as Failed for order ${payment.order.orderNumber}.`,
      );

      // Send notification
      await this.notificationsService.createNotification(
        payment.order.userId,
        'Payment Failed',
        `Your payment of ৳${payment.amount} for order ${payment.order.orderNumber} has failed.`,
      );

      return updatedPayment;
    });
  }

  async adminUpdatePaymentStatus(
    userId: string,
    paymentId: string,
    status: string,
    transactionId?: string,
  ) {
    // Check if user is admin
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      throw new UnauthorizedException('Admin privileges required');
    }

    if (status === 'Paid') {
      return this.markAsPaid(paymentId, transactionId);
    } else if (status === 'Failed') {
      return this.markAsFailed(paymentId);
    } else {
      throw new BadRequestException(`Unsupported status transition: ${status}`);
    }
  }

  async adminUpdateOrderStatus(userId: string, orderId: string, status: string) {
    // Check admin
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      throw new UnauthorizedException('Admin privileges required');
    }

    // State machine check
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) throw new NotFoundException('Order not found');

    const validStatuses = [
      'Pending',
      'Confirmed',
      'Packed',
      'Shipped',
      'Delivered',
      'Cancelled',
      'Returned',
    ];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid order status: ${status}`);
    }

    // If order is cancelled or returned, we need to release reserved/sale inventory!
    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      // If transition is to Cancelled or Returned, release inventory
      if (
        (status === 'Cancelled' || status === 'Returned') &&
        order.status !== 'Cancelled' &&
        order.status !== 'Returned'
      ) {
        const orderItems = await tx.orderItem.findMany({
          where: { orderId },
          include: { product: { include: { inventory: true } } },
        });

        for (const item of orderItems) {
          if (item.product.inventory) {
            // If payment was Paid, it was recorded as Sale (reservedQuantity already decremented, we return to availableQuantity)
            // If payment was not Paid, it was recorded as Reservation (availableQuantity needs to be incremented, reservedQuantity decremented)
            const isPaid = order.payment?.status === 'Paid';
            await tx.inventory.update({
              where: { productId: item.productId },
              data: {
                availableQuantity: { increment: item.quantity },
                reservedQuantity: isPaid ? undefined : { decrement: item.quantity },
              },
            });

            await tx.inventoryTransaction.create({
              data: {
                inventoryId: item.product.inventory.id,
                type: 'Release',
                quantity: item.quantity,
                reference: order.orderNumber,
              },
            });
          }
        }
      }

      // Update order status
      const ord = await tx.order.update({
        where: { id: orderId },
        data: {
          status,
          // If manually updating status to Delivered and method is COD, automatically mark payment as Paid!
          paymentStatus:
            status === 'Delivered' && order.payment?.method === 'Cash on Delivery'
              ? 'Paid'
              : undefined,
        },
      });

      // If Delivered and COD, update payment status too
      if (
        status === 'Delivered' &&
        order.payment?.method === 'Cash on Delivery' &&
        order.payment?.status !== 'Paid'
      ) {
        await tx.payment.update({
          where: { id: order.payment.id },
          data: {
            status: 'Paid',
            paidAt: new Date(),
          },
        });
      }

      return ord;
    });

    // Notify user
    await this.notificationsService.createNotification(
      order.userId,
      `Order Status Update`,
      `Your order ${order.orderNumber} status has been updated to ${status}.`,
    );

    return updatedOrder;
  }

  async getPayment(userId: string, id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { order: true },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    // Check ownership or admin
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (payment.order.userId !== userId && user?.role !== 'admin' && user?.role !== 'super_admin') {
      throw new UnauthorizedException('Access denied');
    }
    return payment;
  }

  async getPaymentByOrderId(userId: string, orderId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
      include: { order: true },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (payment.order.userId !== userId && user?.role !== 'admin' && user?.role !== 'super_admin') {
      throw new UnauthorizedException('Access denied');
    }
    return payment;
  }
}
