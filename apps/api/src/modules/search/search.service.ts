// apps/api/src/modules/search/search.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SearchQueryDto } from './dto/search-query.dto';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(queryDto: SearchQueryDto) {
    const {
      q,
      page = 1,
      limit = 10,
      categories,
      brands,
      priceMin,
      priceMax,
      attributes,
      sort = 'relevance',
      inStock,
    } = queryDto;

    const skip = (page - 1) * limit;

    // Base query conditions
    const where: any = {
      status: 'active',
      deletedAt: null,
    };

    // Keyword Search query matching conditions
    if (q && q.trim().length > 0) {
      const searchTerms = q.trim().split(/\s+/).filter(Boolean);
      if (searchTerms.length > 0) {
        where.AND = searchTerms.map((term) => ({
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { sku: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
            { shortDescription: { contains: term, mode: 'insensitive' } },
            { brand: { name: { contains: term, mode: 'insensitive' } } },
            { category: { name: { contains: term, mode: 'insensitive' } } },
          ],
        }));
      }
    }

    // Category filters
    if (categories && categories.trim().length > 0) {
      const categorySlugs = categories
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (categorySlugs.length > 0) {
        where.category = {
          slug: { in: categorySlugs },
        };
      }
    }

    // Brand filters
    if (brands && brands.trim().length > 0) {
      const brandSlugs = brands
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (brandSlugs.length > 0) {
        where.brand = {
          slug: { in: brandSlugs },
        };
      }
    }

    // Price filters
    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) {
        where.price.regularPrice = { ...where.price.regularPrice, gte: priceMin };
      }
      if (priceMax !== undefined) {
        where.price.regularPrice = { ...where.price.regularPrice, lte: priceMax };
      }
    }

    // Stock availability filter
    if (inStock !== undefined) {
      where.inventory = {
        availableQuantity: inStock ? { gt: 0 } : { equals: 0 },
      };
    }

    // Dynamic Attribute filters
    if (attributes && attributes.trim().length > 0) {
      const parsedAttrs = attributes
        .split(',')
        .map((item) => {
          const parts = item.split(':');
          if (parts.length === 2) {
            return { name: parts[0].trim(), value: parts[1].trim() };
          }
          return null;
        })
        .filter((item): item is { name: string; value: string } => item !== null);

      if (parsedAttrs.length > 0) {
        if (!where.AND) {
          where.AND = [];
        }
        parsedAttrs.forEach((attr) => {
          where.AND.push({
            attributes: {
              some: {
                option: {
                  value: attr.value,
                  attribute: {
                    name: { equals: attr.name, mode: 'insensitive' },
                  },
                },
              },
            },
          });
        });
      }
    }

    // Common DB includes
    const include = {
      brand: true,
      category: true,
      price: true,
      inventory: true,
      images: {
        orderBy: { position: 'asc' as const },
        include: { media: true },
      },
    } as const;

    // 1. If keyword search exists and relevance is chosen, perform in-memory ranking
    if (q && q.trim().length > 0 && sort === 'relevance') {
      const allItems = await this.prisma.product.findMany({
        where,
        include,
      });

      const queryLower = q.toLowerCase().trim();
      const queryTerms = queryLower.split(/\s+/).filter(Boolean);

      const itemsWithScore = allItems.map((product) => {
        let score = 0;
        const nameLower = product.name.toLowerCase();
        const skuLower = product.sku.toLowerCase();
        const descLower = (product.description || '').toLowerCase();
        const shortDescLower = (product.shortDescription || '').toLowerCase();
        const brandLower = product.brand.name.toLowerCase();
        const catLower = product.category.name.toLowerCase();

        // SKU Exact & Partial Matches
        if (skuLower === queryLower) {
          score += 100;
        } else if (skuLower.includes(queryLower)) {
          score += 40;
        }

        // Name Exact, StartsWith & Multi-term Matches
        if (nameLower === queryLower) {
          score += 85;
        } else if (nameLower.startsWith(queryLower)) {
          score += 55;
        } else {
          let termMatches = 0;
          queryTerms.forEach((term) => {
            if (nameLower.includes(term)) {
              termMatches++;
              score += 20;
            }
          });
          if (termMatches === queryTerms.length) {
            score += 15;
          }
        }

        // Brand / Category Matches
        if (brandLower === queryLower) {
          score += 30;
        } else if (brandLower.includes(queryLower)) {
          score += 15;
        }

        if (catLower === queryLower) {
          score += 25;
        } else if (catLower.includes(queryLower)) {
          score += 10;
        }

        // Description Matches
        if (shortDescLower.includes(queryLower)) {
          score += 8;
        }
        if (descLower.includes(queryLower)) {
          score += 3;
        }

        return { product, score };
      });

      // Sort by relevance score descending
      itemsWithScore.sort((a, b) => b.score - a.score);

      const total = itemsWithScore.length;
      const paginatedItems = itemsWithScore.slice(skip, skip + limit).map((item) => item.product);

      return {
        items: paginatedItems,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    // 2. Database level sorting (either no search keyword or specific sorting option selected)
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: { regularPrice: 'asc' } };
    } else if (sort === 'price_desc') {
      orderBy = { price: { regularPrice: 'desc' } };
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'name_asc') {
      orderBy = { name: 'asc' };
    } else if (sort === 'name_desc') {
      orderBy = { name: 'desc' };
    }

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include,
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

  async getSuggestions(q: string) {
    if (!q || q.trim().length === 0) {
      return { products: [], categories: [], brands: [] };
    }

    const cleanQ = q.trim();

    // Fetch matched products (limit to 5)
    const products = await this.prisma.product.findMany({
      where: {
        status: 'active',
        deletedAt: null,
        OR: [
          { name: { contains: cleanQ, mode: 'insensitive' } },
          { sku: { contains: cleanQ, mode: 'insensitive' } },
        ],
      },
      take: 5,
      include: {
        price: true,
        images: {
          orderBy: { position: 'asc' },
          include: { media: true },
          take: 1,
        },
      },
    });

    // Fetch matched categories (limit to 3)
    const categories = await this.prisma.category.findMany({
      where: {
        name: { contains: cleanQ, mode: 'insensitive' },
      },
      take: 3,
    });

    // Fetch matched brands (limit to 3)
    const brands = await this.prisma.brand.findMany({
      where: {
        name: { contains: cleanQ, mode: 'insensitive' },
      },
      take: 3,
    });

    return {
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        image: p.images[0]?.media?.storageKey || null,
      })),
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      })),
      brands: brands.map((b) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
      })),
    };
  }
}
