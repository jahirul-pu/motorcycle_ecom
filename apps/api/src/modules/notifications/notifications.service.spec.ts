import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: any;

  beforeEach(async () => {
    const mockPrismaService = {
      notification: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getNotifications', () => {
    it('should return user notifications', async () => {
      const mockNotifs = [{ id: '1', userId: 'user1', title: 'Test', message: 'Hello' }];
      prisma.notification.findMany.mockResolvedValue(mockNotifs);

      const result = await service.getNotifications('user1');
      expect(result).toEqual(mockNotifs);
      expect(prisma.notification.findMany).toHaveBeenCalled();
    });
  });

  describe('createNotification', () => {
    it('should create notification and log email mock', async () => {
      const mockNotif = { id: '1', userId: 'user1', title: 'Placed', message: 'Success' };
      prisma.notification.create.mockResolvedValue(mockNotif);

      const result = await service.createNotification('user1', 'Placed', 'Success');
      expect(result).toEqual(mockNotif);
      expect(prisma.notification.create).toHaveBeenCalled();
    });
  });

  describe('markAsRead', () => {
    it('should throw NotFoundException if notification does not exist', async () => {
      prisma.notification.findFirst.mockResolvedValue(null);

      await expect(service.markAsRead('user1', 'notif1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should mark single notification as read if found', async () => {
      prisma.notification.findFirst.mockResolvedValue({ id: 'notif1' });
      prisma.notification.update.mockResolvedValue({ id: 'notif1', isRead: true });

      const result = await service.markAsRead('user1', 'notif1');
      expect(result.isRead).toBe(true);
    });
  });

  describe('markAllAsRead', () => {
    it('should update all unread user notifications', async () => {
      prisma.notification.updateMany.mockResolvedValue({ count: 2 });

      const result = await service.markAllAsRead('user1');
      expect(result).toEqual({ success: true });
    });
  });
});
