import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from '@nexus/health';
import { CommonConfigModule } from '@nexus/config';

@Module({
  imports: [
    CommonConfigModule,
    HealthModule.forRoot({ serviceName: 'findata-svc', version: '1.0.0' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
