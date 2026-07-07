import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should hash a password and verify it', async () => {
    const password = 'mySecretPassword';
    const hash = await service.hashPassword(password);
    expect(hash).not.toBe(password);

    const isMatch = await service.comparePassword(password, hash);
    expect(isMatch).toBe(true);

    const isWrong = await service.comparePassword('wrongPassword', hash);
    expect(isWrong).toBe(false);
  });
});
