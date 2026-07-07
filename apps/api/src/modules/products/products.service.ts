// apps/api/src/modules/products/products.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    limit?: number;
    categorySlug?: string;
    brandSlug?: string;
    sort?: string;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'active',
      deletedAt: null,
    };

    if (params.categorySlug) {
      where.category = {
        slug: params.categorySlug,
      };
    }

    if (params.brandSlug) {
      where.brand = {
        slug: params.brandSlug,
      };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (params.sort === 'price_asc') {
      orderBy = { price: { regularPrice: 'asc' } };
    } else if (params.sort === 'price_desc') {
      orderBy = { price: { regularPrice: 'desc' } };
    } else if (params.sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          brand: true,
          category: true,
          price: true,
          inventory: true,
          images: {
            orderBy: { position: 'asc' },
            include: { media: true },
          },
        },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
        price: true,
        inventory: true,
        images: {
          orderBy: { position: 'asc' },
          include: { media: true },
        },
        attributes: {
          include: {
            option: {
              include: {
                attribute: true,
              },
            },
          },
        },
        specifications: {
          include: {
            specification: true,
          },
        },
        compatibility: {
          include: {
            variant: {
              include: {
                generation: {
                  include: {
                    model: {
                      include: {
                        brand: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!product || product.status !== 'active' || product.deletedAt !== null) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findImages(productId: string) {
    return this.prisma.productImage.findMany({
      where: { productId },
      orderBy: { position: 'asc' },
      include: { media: true },
    });
  }

  async findSpecifications(productId: string) {
    return this.prisma.productSpecification.findMany({
      where: { productId },
      include: { specification: true },
    });
  }

  async findCompatibility(productId: string) {
    return this.prisma.productCompatibility.findMany({
      where: { productId },
      include: {
        variant: {
          include: {
            generation: {
              include: {
                model: {
                  include: {
                    brand: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
