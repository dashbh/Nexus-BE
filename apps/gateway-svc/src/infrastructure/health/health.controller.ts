import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  HealthCheckResult,
} from '@nestjs/terminus';
import { DatabaseHealthIndicator } from './database-health.indicator';
import { RedisHealthIndicator } from './redis-health.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: DatabaseHealthIndicator,
    private redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.db.isHealthy('database'),
      () => this.redis.isHealthy('redis'),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  readiness(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.db.isHealthy('database'),
      () => this.redis.isHealthy('redis'),
    ]);
  }

  @Get('live')
  @HealthCheck()
  liveness(): Promise<HealthCheckResult> {
    return this.health.check([]);
  }

  @Get('simple')
  async simpleCheck(): Promise<{
    status: string;
    timestamp: string;
    services: Record<string, string>;
  }> {
    try {
      const result = await this.health.check([
        () => this.db.isHealthy('database'),
        () => this.redis.isHealthy('redis'),
      ]);

      return {
        status: result.status,
        timestamp: new Date().toISOString(),
        services: Object.keys(result.details).reduce(
          (acc, key) => {
            acc[key] = result.details[key].status;
            return acc;
          },
          {} as Record<string, string>,
        ),
      };
    } catch {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {},
      };
    }
  }
}
