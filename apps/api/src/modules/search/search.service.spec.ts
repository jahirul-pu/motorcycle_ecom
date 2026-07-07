// apps/api/src/modules/search/search.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { PrismaService } from '../database/prisma.service';

describe('SearchService', () => {
  let service: SearchService;
  let prisma: any;

  const mockProduct = {
    id: 'prod-123',
    name: 'Motul 7100 10W40',
    sku: 'MOTUL-7100-10W40',
    slug: 'motul-7100-10w40',
    description: 'High performance motor oil',
    shortDescription: '10W40 Engine Oil',
    brand: { name: 'Motul' },
    category: { name: 'Engine Oil' },
    price: { regularPrice: 1500, salePrice: null },
    inventory: { availableQuantity: 10 },
    images: [{ media: { url: 'http://example.com/image.jpg' } }],
  };

  beforeEach(async () => {
    const mockPrismaService = {
      product: {
        findMany: jest.fn().mockResolvedValue([mockProduct]),
        count: jest.fn().mockResolvedValue(1),
      },
      category: {
        findMany: jest.fn().mockResolvedValue([{ id: 'cat-1', name: 'Engine Oil', slug: 'engine-oil' }]),
      },
      brand: {
        findMany: jest.fn().mockResolvedValue([{ id: 'brand-1', name: 'Motul', slug: 'motul' }]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('should search products with search query and return paginated data', async () => {
      const result = await service.search({
        q: 'Motul',
        page: 1,
        limit: 10,
        sort: 'relevance',
      });

      expect(prisma.product.findMany).toHaveBeenCalled();
      expect(result.items).toBeDefined();
      expect(result.items.length).toBe(1);
      expect(result.items[0].name).toBe('Motul 7100 10W40');
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });

    it('should fallback to db-level query if relevance sorting is not selected', async () => {
      const result = await service.search({
        q: 'Motul',
        page: 1,
        limit: 5,
        sort: 'price_asc',
      });

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
          skip: 0,
          orderBy: { price: { regularPrice: 'asc' } },
        })
      );
      expect(result.items.length).toBe(1);
    });
  });

  describe('getSuggestions', () => {
    it('should return quick matched suggestions list for products, categories, and brands', async () => {
      const result = await service.getSuggestions('motul');

      expect(prisma.product.findMany).toHaveBeenCalled();
      expect(prisma.category.findMany).toHaveBeenCalled();
      expect(prisma.brand.findMany).toHaveBeenCalled();

      expect(result.products).toBeDefined();
      expect(result.products.length).toBe(1);
      expect(result.products[0].name).toBe('Motul 7100 10W40');
      expect(result.categories[0].name).toBe('Engine Oil');
      expect(result.brands[0].name).toBe('Motul');
    });

    it('should return empty lists if search term is empty', async () => {
      const result = await service.getSuggestions('');
      expect(result).toEqual({ products: [], categories: [], brands: [] });
    });
  });
});
