import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CouponsService } from '../coupons/coupons.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private couponsService: CouponsService,
    private notificationsService: NotificationsService,
  ) {}

  private generateOrderNumber(): string {
    const date = new Date();
    const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const random = Math.floor(1000 + Math.random() * 9000);
    return `MH-${datePart}-${random}`;
  }

  async checkout(
    userId: string,
    addressId: string,
    paymentMethod: string,
    couponCode?: string,
    deliveryNote?: string,
  ) {
    // Load address
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!address) throw new NotFoundException('Address not found');

    // Load cart with items
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                price: true,
                inventory: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }

    // Validate inventory for all items
    for (const item of cart.items) {
      const available = item.product.inventory?.availableQuantity ?? 0;
      if (available < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${item.product.name}". Available: ${available}`,
        );
      }
      if (!item.product.price) {
        throw new BadRequestException(`Product "${item.product.name}" has no price set`);
      }
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.product.price!.salePrice ?? item.product.price!.regularPrice;
      return sum + price * item.quantity;
    }, 0);

    // Bangladesh shipping: 60 inside Dhaka, 120 outside (simple flat rate)
    const shipping =
      address.city.toLowerCase().includes('dhaka') || address.area.toLowerCase().includes('dhaka')
        ? 60
        : 120;

    // Apply coupon
    let discount = 0;
    let couponId: string | undefined;
    if (couponCode) {
      const couponResult = await this.couponsService.applyCoupon(userId, couponCode, subtotal);
      discount = couponResult.discount;
      couponId = couponResult.coupon.id;
    }

    const total = subtotal + shipping - discount;

    // Address snapshot
    const addressSnapshot = {
      recipientName: address.recipientName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      area: address.area,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      deliveryNote: deliveryNote ?? null,
    };

    // Create order in a transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Generate unique order number
      let orderNumber = this.generateOrderNumber();
      let attempts = 0;
      while (attempts < 5) {
        const exists = await tx.order.findUnique({ where: { orderNumber } });
        if (!exists) break;
        orderNumber = this.generateOrderNumber();
        attempts++;
      }

      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          subtotal: parseFloat(subtotal.toFixed(2)),
          discount: parseFloat(discount.toFixed(2)),
          shipping,
          total: parseFloat(total.toFixed(2)),
          addressSnapshot,
          items: {
            create: cart.items.map((item) => {
              const price = item.product.price!.salePrice ?? item.product.price!.regularPrice;
              return {
                productId: item.productId,
                sku: item.product.sku,
                name: item.product.name,
                price,
                quantity: item.quantity,
                subtotal: parseFloat((price * item.quantity).toFixed(2)),
              };
            }),
          },
          payment: {
            create: {
              method: paymentMethod,
              amount: parseFloat(total.toFixed(2)),
              status: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Pending',
            },
          },
        },
        include: {
          items: true,
          payment: true,
        },
      });

      // Reserve inventory
      for (const item of cart.items) {
        await tx.inventory.update({
          where: { productId: item.productId },
          data: {
            availableQuantity: { decrement: item.quantity },
            reservedQuantity: { increment: item.quantity },
          },
        });

        await tx.inventoryTransaction.create({
          data: {
            inventoryId: item.product.inventory!.id,
            type: 'Reservation',
            quantity: -item.quantity,
            reference: newOrder.orderNumber,
          },
        });
      }

      // Record coupon usage
      if (couponId) {
        await tx.couponUsage.create({
          data: { couponId, userId, orderId: newOrder.id },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    // Log order confirmation (mock email)
    console.log(
      `\n=== ORDER CONFIRMATION ===\nOrder: ${order.orderNumber}\nUser: ${userId}\nTotal: ৳${order.total}\nPayment: ${paymentMethod}\n=========================\n`,
    );

    // Trigger user in-app and email notification
    await this.notificationsService.createNotification(
      userId,
      'Order Placed Successfully',
      `Your order ${order.orderNumber} for ৳${order.total.toLocaleString()} has been placed successfully using ${paymentMethod}.`,
    );

    return order;
  }

  async getOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: { product: { include: { images: { include: { media: true }, take: 1 } } } },
        },
        payment: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
