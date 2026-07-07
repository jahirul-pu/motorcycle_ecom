import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
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
  ],
})
export class AppModule {}
