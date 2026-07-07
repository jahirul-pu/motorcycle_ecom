import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';
import { PrismaService } from '../database/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: any;
  let passwordService: any;
  let prismaService: any;

  beforeEach(async () => {
    const mockUsersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateLastLogin: jest.fn(),
    };

    const mockPasswordService = {
      hashPassword: jest.fn().mockResolvedValue('hashed_pwd'),
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock_jwt_token'),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue('test'),
    };

    const mockPrismaService = {
      refreshToken: {
        create: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    passwordService = module.get<PasswordService>(PasswordService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should validate user credentials successfully', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'user_1',
      email: 'test@example.com',
      passwordHash: 'hashed_pwd',
      isActive: true,
    });

    const result = await service.validateUser('test@example.com', 'pwd123');
    expect(result).toBeDefined();
    expect(result.id).toBe('user_1');
    expect(passwordService.comparePassword).toHaveBeenCalledWith('pwd123', 'hashed_pwd');
  });

  it('should generate tokens on login', async () => {
    const user = { id: 'user_1', email: 'test@example.com', name: 'John', role: 'customer' };
    const tokens = await service.login(user);
    expect(tokens.accessToken).toBe('mock_jwt_token');
    expect(tokens.refreshToken).toBeDefined();
    expect(prismaService.refreshToken.create).toHaveBeenCalled();
  });
});
