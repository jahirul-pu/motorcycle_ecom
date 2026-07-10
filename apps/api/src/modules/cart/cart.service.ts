import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { include: { media: true }, orderBy: { position: 'asc' }, take: 1 },
                price: true,
                inventory: true,
                brand: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { include: { media: true }, orderBy: { position: 'asc' }, take: 1 },
                  price: true,
                  inventory: true,
                  brand: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    }

    return cart;
  }

  async addItem(userId: string, productId: string, quantity: number) {
    if (quantity < 1) throw new BadRequestException('Quantity must be at least 1');

    const product = await this.prisma.product.findFirst({
      where: { id: productId, status: 'active' },
      include: { inventory: true },
    });
    if (!product) throw new NotFoundException('Product not found or unavailable');

    const availableQty = product.inventory?.availableQuantity ?? 0;
    if (availableQty < quantity) {
      throw new BadRequestException(`Only ${availableQty} units available`);
    }

    const cart = await this.getOrCreateCart(userId);

    const existing = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (availableQty < newQty) {
        throw new BadRequestException(`Only ${availableQty} units available`);
      }
      await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      await this.prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    return this.getOrCreateCart(userId);
  }

  async updateItem(userId: string, itemId: string, quantity: number) {
    if (quantity < 1) throw new BadRequestException('Quantity must be at least 1');

    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { product: { include: { inventory: true } } },
    });
    if (!item) throw new NotFoundException('Cart item not found');

    const available = item.product.inventory?.availableQuantity ?? 0;
    if (available < quantity) throw new BadRequestException(`Only ${available} units available`);

    await this.prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
    return this.getOrCreateCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });
    if (!item) throw new NotFoundException('Cart item not found');

    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return this.getOrCreateCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return { success: true };
  }
}
