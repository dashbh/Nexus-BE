import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_NAME, SERVICE_VERSION } from './health.module';

@Injectable()
export class HealthService {
  constructor(
    // @Inject(SERVICE_NAME) private readonly serviceName: string,
    // @Inject(SERVICE_VERSION) private readonly version: string,
  ) {}

  getHealth() {
    return {
      service: 'this.serviceName',
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: 'this.version',
      uptime: process.uptime(),
    };
  }

  getDetailedHealth() {
    const health = this.getHealth();
    return {
      ...health,
      memoryUsage: process.memoryUsage(),
    };
  }
}
