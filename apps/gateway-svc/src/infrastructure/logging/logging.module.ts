import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigService } from '@nexus/config';
import * as winston from 'winston';
import { LoggingService } from './logging.service';
import { CorrelationIdMiddleware } from './correlation-id.middleware';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const appConfig = configService.get('app');

        const logFormat = winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json(),
          winston.format.printf(
            ({ timestamp, level, message, correlationId, ...meta }) => {
              return JSON.stringify({
                timestamp,
                level,
                message,
                correlationId,
                ...meta,
              });
            },
          ),
        );

        return {
          level: appConfig.logLevel || 'info',
          format: logFormat,
          transports: [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
              ),
            }),
            new winston.transports.File({
              filename: 'logs/error.log',
              level: 'error',
            }),
            new winston.transports.File({
              filename: 'logs/combined.log',
            }),
          ],
        };
      },
    }),
  ],
  providers: [LoggingService, CorrelationIdMiddleware],
  exports: [LoggingService, CorrelationIdMiddleware],
})
export class LoggingModule {}
