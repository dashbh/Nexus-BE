import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
  ) {}

  @Get()
  @HealthCheck()
  async getHealth() {
    const health = this.healthService.getHealth();
    return {
      ...health,
      status: 'ok',
    };
  }
}
