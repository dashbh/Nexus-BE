import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from '@nexus/health';
import { NexusConfigModule } from '@nexus/config';

@Module({
  imports: [
    NexusConfigModule,
    HealthModule.forRoot({ serviceName: 'findata-svc', version: '1.0.0' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
