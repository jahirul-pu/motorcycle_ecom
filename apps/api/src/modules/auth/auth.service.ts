import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';
import { PrismaService } from '../database/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.isActive) {
      const isMatch = await this.passwordService.comparePassword(pass, user.passwordHash);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    // Generate refresh token
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Save refresh token to db
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(data: any) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }

    const passwordHash = await this.passwordService.hashPassword(data.password);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    const user = await this.usersService.create({
      email: data.email,
      name: data.name,
      phone: data.phone,
      passwordHash,
      role: 'customer',
      emailVerificationToken: verificationTokenHash,
    });

    console.log(
      `\n=== EMAIL VERIFICATION MAIL MOCK ===\nTo: ${data.email}\nLink: http://localhost:3000/verify-email?token=${verificationToken}\n====================================\n`,
    );

    return this.login(user);
  }

  async refresh(token: string) {
    const savedToken = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!savedToken || savedToken.expiresAt < new Date() || !savedToken.user.isActive) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = savedToken.user;
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    // Rotate refresh token
    await this.prisma.refreshToken.delete({ where: { id: savedToken.id } });

    const newRefreshToken = crypto.randomBytes(40).toString('hex');
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: newExpiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(token: string) {
    try {
      await this.prisma.refreshToken.delete({
        where: { token },
      });
    } catch {
      // Ignore if token doesn't exist
    }
    return { success: true };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return { success: true };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: tokenHash,
        resetPasswordExpires: expiresAt,
      },
    });

    console.log(
      `\n=== PASSWORD RESET MAIL MOCK ===\nTo: ${email}\nLink: http://localhost:3000/reset-password?token=${token}\n================================\n`,
    );

    return { success: true };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.prisma.user.findUnique({
      where: { resetPasswordToken: tokenHash },
    });

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const passwordHash = await this.passwordService.hashPassword(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return { success: true };
  }

  async verifyEmail(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.prisma.user.findUnique({
      where: { emailVerificationToken: tokenHash },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: new Date(),
        emailVerificationToken: null,
      },
    });

    return { success: true };
  }
}
