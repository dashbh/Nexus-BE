import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('findata.getData')
  getData(): any {
    return {
      service: 'findata-svc',
      data: {
        stocks: [
          { symbol: 'AAPL', price: 150.25, change: '+2.5%' },
          { symbol: 'GOOGL', price: 2750.80, change: '-1.2%' },
          { symbol: 'TSLA', price: 245.67, change: '+5.8%' }
        ],
        timestamp: new Date().toISOString(),
        market: 'NASDAQ'
      },
      status: 'success'
    };
  }
}
