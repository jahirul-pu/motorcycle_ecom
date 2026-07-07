import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Brand } from '@prisma/client';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Brand[]> {
    return this.prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findBySlug(slug: string): Promise<Brand> {
    const brand = await this.prisma.brand.findUnique({
      where: { slug },
    });

    if (!brand || !brand.isActive) {
      throw new NotFoundException('Brand not found');
    }

    return brand;
  }
}
