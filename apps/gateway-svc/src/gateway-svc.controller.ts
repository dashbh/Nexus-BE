import { Controller, Get } from '@nestjs/common';
import { GatewaySvcService } from './gateway-svc.service';

@Controller()
export class GatewaySvcController {
  constructor(private readonly gatewaySvcService: GatewaySvcService) {}

  @Get()
  async getHello(): Promise<string> {
    return this.gatewaySvcService.getHello();
  }

  @Get('status')
  getStatus(): Record<string, unknown> {
    return this.gatewaySvcService.getStatus();
  }
}
