import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TerminusModule, HealthCheckService } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

export const SERVICE_NAME = 'SERVICE_NAME';
export const SERVICE_VERSION = 'SERVICE_VERSION';

@Module({})
export class HealthModule {
  static forRoot(options: { serviceName: string; version: string }): DynamicModule {
    const providers: Provider[] = [
      HealthService,
      // HealthCheckService,
      // MemoryHealthIndicator,
      // { provide: SERVICE_NAME, useValue: options.serviceName },
      // { provide: SERVICE_VERSION, useValue: options.version },
    ];

    return {
      module: HealthModule,
      imports: [TerminusModule.forRoot()],
      providers,
      controllers: [HealthController],
      exports: providers,
    };
  }
}
