import { Injectable } from '@nestjs/common';

@Injectable()
export class GatewaySvcService {
  getHello(): string {
    return 'Hello World!';
  }
}
