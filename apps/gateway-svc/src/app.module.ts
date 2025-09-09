import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from '@nexus/health';
import { NexusConfigModule, ConfigService } from '@nexus/config';

@Module({
  imports: [
    NexusConfigModule,
    HealthModule.forRoot({ serviceName: 'gateway-svc', version: '1.0.0' }),
    ClientsModule.registerAsync([
      {
        name: 'FINDATA_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('FINDATA_HOST') || 'localhost',
            port: configService.get<number>('FINDATA_PORT') || 3001,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'NOTIFICATION_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('NOTIFICATION_HOST') || 'localhost',
            port: configService.get<number>('NOTIFICATION_PORT') || 3002,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'TRADING_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('TRADING_HOST') || 'localhost',
            port: configService.get<number>('TRADING_PORT') || 3003,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
