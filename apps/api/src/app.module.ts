import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './modules/database/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute in milliseconds
        limit: 100,
      },
    ]),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        return {
          store: await redisStore({
            url: redisUrl || 'redis://localhost:6379',
            ttl: 60000, // 60 seconds in milliseconds
            socket: {
              reconnectStrategy: (retries) => {
                // limit retry attempts in development if Redis isn't running
                if (retries > 3) {
                  return new Error('Redis connection failed');
                }
                return Math.min(retries * 100, 1000);
              },
            },
          }),
        };
      },
    }),
    HealthModule,
    PrismaModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
