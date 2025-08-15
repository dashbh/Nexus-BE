import { Module } from '@nestjs/common';
import { GatewaySvcController } from './gateway-svc.controller';
import { GatewaySvcService } from './gateway-svc.service';

@Module({
  imports: [],
  controllers: [GatewaySvcController],
  providers: [GatewaySvcService],
})
export class GatewaySvcModule {}
