import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async applyCoupon(userId: string, code: string, orderSubtotal: number) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });

    if (!coupon || !coupon.isActive) {
      throw new NotFoundException('Coupon not found or inactive');
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new BadRequestException('Coupon has expired');
    }

    if (orderSubtotal < coupon.minimumOrder) {
      throw new BadRequestException(
        `Minimum order amount is ৳${coupon.minimumOrder} to use this coupon`,
      );
    }

    if (coupon.usageLimit !== null) {
      const usageCount = await this.prisma.couponUsage.count({
        where: { couponId: coupon.id },
      });
      if (usageCount >= coupon.usageLimit) {
        throw new BadRequestException('Coupon usage limit reached');
      }
    }

    // Check if user already used this coupon
    const userUsage = await this.prisma.couponUsage.findFirst({
      where: { couponId: coupon.id, userId },
    });
    if (userUsage) {
      throw new BadRequestException('You have already used this coupon');
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (orderSubtotal * coupon.value) / 100;
      if (coupon.maximumDiscount !== null) {
        discount = Math.min(discount, coupon.maximumDiscount);
      }
    } else {
      discount = coupon.value;
    }

    discount = Math.min(discount, orderSubtotal);

    return {
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
      },
      discount: parseFloat(discount.toFixed(2)),
    };
  }

  async findByCode(code: string) {
    return this.prisma.coupon.findUnique({ where: { code } });
  }
}
