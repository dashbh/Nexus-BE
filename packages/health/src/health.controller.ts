import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    // private readonly health: HealthCheckService,
    // private readonly memory: MemoryHealthIndicator,
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

  // @Get('detailed')
  // @HealthCheck()
  // async getDetailedHealth() {
  //   const health = this.healthService.getDetailedHealth();
  //   const memoryCheck = await this.health.check([
  //     async () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
  //     async () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
  //   ]);
  //   return {
  //     ...health,
  //     ...memoryCheck,
  //   };
  // }
}
