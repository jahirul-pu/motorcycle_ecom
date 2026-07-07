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
import { CategoriesModule } from './modules/categories/categories.module';
import { BrandsModule } from './modules/brands/brands.module';
import { ProductsModule } from './modules/products/products.module';
import { SearchModule } from './modules/search/search.module';

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
        try {
          const store = await redisStore({
            url: redisUrl || 'redis://localhost:6379',
            ttl: 60000, // 60 seconds in milliseconds
            socket: {
              connectTimeout: 3000,
              reconnectStrategy: (retries) => {
                // limit retry attempts in development if Redis isn't running
                if (retries > 3) {
                  return false; // Stop retrying instead of throwing
                }
                return Math.min(retries * 100, 1000);
              },
            },
          });

          // Prevent process crashes on connection error events
          const client = (store as any).client;
          if (client) {
            client.on('error', (err: any) => {
              console.warn('Redis Cache connection error:', err.message);
            });
          }

          return { store };
        } catch (error: any) {
          console.warn('Redis is not running. Falling back to in-memory cache:', error.message);
          return {}; // Falls back to default in-memory cache
        }
      },
    }),
    HealthModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
    SearchModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
