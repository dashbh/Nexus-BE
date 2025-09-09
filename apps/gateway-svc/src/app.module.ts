import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from '@nexus/health';
import { CommonConfigModule } from '@nexus/config';

@Module({
  imports: [
    CommonConfigModule,
    HealthModule.forRoot({ serviceName: 'gateway-svc', version: '1.0.0' }),
    ClientsModule.register([
      {
        name: 'FINDATA_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.FINDATA_HOST ?? 'localhost',
          port: parseInt(process.env.FINDATA_PORT ?? '3001'),
        },
      },
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.NOTIFICATION_HOST ?? 'localhost',
          port: parseInt(process.env.NOTIFICATION_PORT ?? '3002'),
        },
      },
      {
        name: 'TRADING_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.TRADING_HOST ?? 'localhost',
          port: parseInt(process.env.TRADING_PORT ?? '3003'),
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
