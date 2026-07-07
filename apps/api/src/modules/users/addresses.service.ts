import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Address, Prisma } from '@prisma/client';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string): Promise<Address[]> {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string): Promise<Address | null> {
    return this.prisma.address.findFirst({
      where: { id, userId },
    });
  }

  async create(userId: string, data: Prisma.AddressCreateWithoutUserInput): Promise<Address> {
    if (data.isDefault) {
      await this.clearDefaults(userId);
    }

    const count = await this.prisma.address.count({ where: { userId } });
    const isDefault = count === 0 ? true : !!data.isDefault;

    return this.prisma.address.create({
      data: {
        ...data,
        isDefault,
        userId,
      },
    });
  }

  async update(
    userId: string,
    id: string,
    data: Prisma.AddressUpdateWithoutUserInput,
  ): Promise<Address> {
    const address = await this.findOne(userId, id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (data.isDefault) {
      await this.clearDefaults(userId);
    }

    return this.prisma.address.update({
      where: { id },
      data,
    });
  }

  async delete(userId: string, id: string): Promise<void> {
    const address = await this.findOne(userId, id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    await this.prisma.address.delete({
      where: { id },
    });

    if (address.isDefault) {
      const nextAddress = await this.prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      if (nextAddress) {
        await this.prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }
  }

  private async clearDefaults(userId: string): Promise<void> {
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }
}
