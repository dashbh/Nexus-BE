import { Controller, Get } from '@nestjs/common';
import { GatewaySvcService } from './gateway-svc.service';

@Controller()
export class GatewaySvcController {
  constructor(private readonly gatewaySvcService: GatewaySvcService) {}

  @Get()
  getHello(): string {
    return this.gatewaySvcService.getHello();
  }
}
