import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nexus/config';
import { RedisService } from './infrastructure/redis/redis.service';
import { LoggingService } from './infrastructure/logging/logging.service';

@Injectable()
export class GatewaySvcService {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly loggingService: LoggingService,
  ) {}

  async getHello(): Promise<string> {
    this.loggingService.log(
      'Gateway service hello endpoint called',
      'GatewaySvcService',
    );

    const appConfig = this.configService.get('app');
    const environment = appConfig.environment;

    // Test Redis connection
    try {
      await this.redisService.ping();
      this.loggingService.log(
        'Redis connection successful',
        'GatewaySvcService',
      );
    } catch (error) {
      this.loggingService.error(
        'Redis connection failed',
        error instanceof Error ? error.stack : undefined,
        'GatewaySvcService',
      );
    }

    return `Hello from Gateway Service! Environment: ${environment}`;
  }

  getStatus(): Record<string, unknown> {
    this.loggingService.log(
      'Gateway service status endpoint called',
      'GatewaySvcService',
    );

    const appConfig = this.configService.get('app');
    const dbConfig = this.configService.get('database');
    const redisConfig = this.configService.get('redis');

    return {
      service: 'gateway-svc',
      environment: appConfig.environment,
      port: appConfig.port,
      database: {
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
      },
      redis: {
        host: redisConfig.host,
        port: redisConfig.port,
        db: redisConfig.db,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
