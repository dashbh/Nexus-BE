import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nexus/config';
import { RedisService } from './redis.service';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get('redis');

        return new Redis({
          host: redisConfig.host,
          port: redisConfig.port,
          password: redisConfig.password,
          db: redisConfig.db,
          keyPrefix: redisConfig.keyPrefix || 'nexus:',
          maxRetriesPerRequest: redisConfig.maxRetriesPerRequest || 3,
          enableReadyCheck: true,
          lazyConnect: true,
          connectTimeout: 10000,
          commandTimeout: 5000,
        });
      },
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
