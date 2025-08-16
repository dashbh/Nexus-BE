import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nexus/config';
import { GatewaySvcController } from './gateway-svc.controller';
import { GatewaySvcService } from './gateway-svc.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { LoggingModule } from './infrastructure/logging/logging.module';
import { HealthModule } from './infrastructure/health/health.module';
import { CorrelationIdMiddleware } from './infrastructure/logging/correlation-id.middleware';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    RedisModule,
    LoggingModule,
    HealthModule,
  ],
  controllers: [GatewaySvcController],
  providers: [GatewaySvcService],
})
export class GatewaySvcModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
