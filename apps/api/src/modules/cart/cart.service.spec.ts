import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let prisma: any;

  beforeEach(async () => {
    const mockPrismaService = {
      cart: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      cartItem: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
      product: {
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CartService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<CartService>(CartService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrCreateCart', () => {
    it('should return existing cart if it exists', async () => {
      const mockCart = { id: 'cart1', userId: 'user1', items: [] };
      prisma.cart.findUnique.mockResolvedValue(mockCart);

      const result = await service.getOrCreateCart('user1');
      expect(result).toEqual(mockCart);
    });

    it('should create new cart if it does not exist', async () => {
      prisma.cart.findUnique.mockResolvedValue(null);
      const mockCart = { id: 'cart1', userId: 'user1', items: [] };
      prisma.cart.create.mockResolvedValue(mockCart);

      const result = await service.getOrCreateCart('user1');
      expect(result).toEqual(mockCart);
      expect(prisma.cart.create).toHaveBeenCalled();
    });
  });

  describe('addItem', () => {
    it('should throw BadRequestException if quantity < 1', async () => {
      await expect(service.addItem('user1', 'prod1', 0)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if product does not exist or inactive', async () => {
      prisma.product.findFirst.mockResolvedValue(null);

      await expect(service.addItem('user1', 'prod1', 2)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if insufficient stock', async () => {
      prisma.product.findFirst.mockResolvedValue({
        id: 'prod1',
        status: 'active',
        inventory: { availableQuantity: 1 },
      });

      await expect(service.addItem('user1', 'prod1', 2)).rejects.toThrow(BadRequestException);
    });
  });
});
