import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { SERVICE_NAME, SERVICE_VERSION } from './health.constants';

@Module({})
export class HealthModule {
  static forRoot(options: { serviceName: string; version: string }): DynamicModule {
    const providers: Provider[] = [
      HealthService,
      { provide: SERVICE_NAME, useValue: options.serviceName },
      { provide: SERVICE_VERSION, useValue: options.version },
    ];

    return {
      module: HealthModule,
      imports: [TerminusModule],
      providers,
      controllers: [HealthController],
      exports: providers,
    };
  }
}
