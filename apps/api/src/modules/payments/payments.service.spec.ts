import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../database/prisma.service';
import { PaymentGatewayFactory } from './providers/payment-gateway.factory';
import { CodPaymentGateway } from './providers/cod.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: any;
  let codGateway: any;
  let gatewayFactory: any;
  let notificationsService: any;

  beforeEach(async () => {
    const mockPrismaService = {
      order: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      payment: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
      orderItem: {
        findMany: jest.fn(),
      },
      inventory: {
        update: jest.fn(),
      },
      inventoryTransaction: {
        create: jest.fn(),
      },
      $transaction: jest.fn().mockImplementation((cb) => cb(mockPrismaService)),
    };

    const mockNotificationsService = {
      createNotification: jest.fn().mockResolvedValue({}),
    };

    const mockCodPaymentGateway = {
      createPayment: jest.fn(),
      verifyPayment: jest.fn(),
    };

    const mockPaymentGatewayFactory = {
      getGateway: jest.fn().mockReturnValue(mockCodPaymentGateway),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: NotificationsService, useValue: mockNotificationsService },
        { provide: CodPaymentGateway, useValue: mockCodPaymentGateway },
        { provide: PaymentGatewayFactory, useValue: mockPaymentGatewayFactory },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prisma = module.get<PrismaService>(PrismaService);
    codGateway = module.get<CodPaymentGateway>(CodPaymentGateway);
    gatewayFactory = module.get<PaymentGatewayFactory>(PaymentGatewayFactory);
    notificationsService = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPaymentSession', () => {
    it('should throw NotFoundException if order does not exist', async () => {
      prisma.order.findFirst.mockResolvedValue(null);

      await expect(service.createPaymentSession('user1', 'order1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if order has no payment', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: 'order1', userId: 'user1', payment: null });

      await expect(service.createPaymentSession('user1', 'order1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if already paid', async () => {
      prisma.order.findFirst.mockResolvedValue({
        id: 'order1',
        userId: 'user1',
        payment: { id: 'pay1', status: 'Paid' },
      });

      await expect(service.createPaymentSession('user1', 'order1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create payment session successfully', async () => {
      const order = {
        id: 'order1',
        orderNumber: 'MH-1234',
        payment: { id: 'pay1', method: 'Cash on Delivery', status: 'Pending' },
      };
      prisma.order.findFirst.mockResolvedValue(order);
      codGateway.createPayment.mockResolvedValue({
        status: 'Pending',
        gatewayReference: 'COD-MH-1234',
      });
      prisma.payment.update.mockResolvedValue({
        id: 'pay1',
        status: 'Pending',
        gatewayReference: 'COD-MH-1234',
      });

      const result = await service.createPaymentSession('user1', 'order1');
      expect(result).toBeDefined();
      expect(result.payment.status).toBe('Pending');
      expect(prisma.payment.update).toHaveBeenCalled();
    });
  });

  describe('verifyPayment', () => {
    it('should return payment immediately if status is Paid', async () => {
      prisma.payment.findUnique.mockResolvedValue({ id: 'pay1', status: 'Paid' });

      const result = await service.verifyPayment('order1', {});
      expect(result.status).toBe('Paid');
      expect(codGateway.verifyPayment).not.toHaveBeenCalled();
    });

    it('should verify and mark as paid if gateway returns Paid', async () => {
      const payment = {
        id: 'pay1',
        orderId: 'order1',
        method: 'Cash on Delivery',
        status: 'Pending',
        amount: 500,
        order: { id: 'order1', orderNumber: 'MH-1234', userId: 'user1', status: 'Pending' },
      };
      prisma.payment.findUnique.mockResolvedValue(payment);
      codGateway.verifyPayment.mockResolvedValue({ status: 'Paid', transactionId: 'tx-123' });
      prisma.payment.update.mockResolvedValue({
        ...payment,
        status: 'Paid',
        transactionId: 'tx-123',
      });
      prisma.orderItem.findMany.mockResolvedValue([
        { productId: 'p1', quantity: 1, product: { inventory: { id: 'inv1' } } },
      ]);

      const result = await service.verifyPayment('order1', { status: 'Paid' });
      expect(result.status).toBe('Paid');
      expect(prisma.payment.update).toHaveBeenCalled();
      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'order1' },
          data: { paymentStatus: 'Paid', status: 'Confirmed' },
        }),
      );
      expect(prisma.inventory.update).toHaveBeenCalled();
    });
  });

  describe('adminUpdateOrderStatus', () => {
    it('should throw UnauthorizedException if user is not admin', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user1', role: 'customer' });

      await expect(service.adminUpdateOrderStatus('user1', 'order1', 'Confirmed')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should update status and release inventory on cancellation', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'admin1', role: 'admin' });
      prisma.order.findUnique.mockResolvedValue({
        id: 'order1',
        orderNumber: 'MH-123',
        status: 'Pending',
        payment: { id: 'pay1', method: 'Cash on Delivery', status: 'Pending' },
      });
      prisma.orderItem.findMany.mockResolvedValue([
        { productId: 'p1', quantity: 2, product: { inventory: { id: 'inv1' } } },
      ]);
      prisma.order.update.mockResolvedValue({ id: 'order1', status: 'Cancelled' });

      const result = await service.adminUpdateOrderStatus('admin1', 'order1', 'Cancelled');
      expect(result.status).toBe('Cancelled');
      expect(prisma.inventory.update).toHaveBeenCalled();
      expect(prisma.inventoryTransaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: 'Release',
            quantity: 2,
          }),
        }),
      );
    });

    it('should mark payment as Paid when status transitions to Delivered for COD', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'admin1', role: 'admin' });
      prisma.order.findUnique.mockResolvedValue({
        id: 'order1',
        orderNumber: 'MH-123',
        status: 'Confirmed',
        payment: { id: 'pay1', method: 'Cash on Delivery', status: 'Pending' },
      });
      prisma.order.update.mockResolvedValue({ id: 'order1', status: 'Delivered' });

      const result = await service.adminUpdateOrderStatus('admin1', 'order1', 'Delivered');
      expect(result.status).toBe('Delivered');
      expect(prisma.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'pay1' },
          data: expect.objectContaining({ status: 'Paid' }),
        }),
      );
    });
  });
});
