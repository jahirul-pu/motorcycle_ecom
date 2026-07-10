import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('WishlistService', () => {
  let service: WishlistService;
  let prisma: any;

  beforeEach(async () => {
    const mockPrismaService = {
      wishlist: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      product: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [WishlistService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWishlist', () => {
    it('should return user wishlist items', async () => {
      const mockItems = [{ id: '1', userId: 'user1', productId: 'prod1' }];
      prisma.wishlist.findMany.mockResolvedValue(mockItems);

      const result = await service.getWishlist('user1');
      expect(result).toEqual(mockItems);
      expect(prisma.wishlist.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user1' } }),
      );
    });
  });

  describe('addToWishlist', () => {
    it('should throw NotFoundException if product does not exist', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.addToWishlist('user1', 'prod1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if product already in wishlist', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 'prod1' });
      prisma.wishlist.findUnique.mockResolvedValue({ id: 'wish1' });

      await expect(service.addToWishlist('user1', 'prod1')).rejects.toThrow(ConflictException);
    });

    it('should create new wishlist item if valid', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 'prod1' });
      prisma.wishlist.findUnique.mockResolvedValue(null);
      prisma.wishlist.create.mockResolvedValue({
        id: 'wish1',
        userId: 'user1',
        productId: 'prod1',
      });

      const result = await service.addToWishlist('user1', 'prod1');
      expect(result).toBeDefined();
      expect(prisma.wishlist.create).toHaveBeenCalled();
    });
  });

  describe('removeFromWishlist', () => {
    it('should throw NotFoundException if wishlist item not found', async () => {
      prisma.wishlist.findUnique.mockResolvedValue(null);

      await expect(service.removeFromWishlist('user1', 'prod1')).rejects.toThrow(NotFoundException);
    });

    it('should delete wishlist item if found', async () => {
      prisma.wishlist.findUnique.mockResolvedValue({ id: 'wish1' });
      prisma.wishlist.delete.mockResolvedValue({});

      const result = await service.removeFromWishlist('user1', 'prod1');
      expect(result).toEqual({ success: true });
      expect(prisma.wishlist.delete).toHaveBeenCalled();
    });
  });
});
