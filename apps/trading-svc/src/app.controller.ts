import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('trading.getOrders')
  getOrders(): any {
    return {
      service: 'trading-svc',
      data: {
        orders: [
          { id: 'ORD001', symbol: 'AAPL', type: 'BUY', quantity: 100, price: 150.25, status: 'FILLED', timestamp: new Date().toISOString() },
          { id: 'ORD002', symbol: 'GOOGL', type: 'SELL', quantity: 50, price: 2750.80, status: 'PENDING', timestamp: new Date().toISOString() },
          { id: 'ORD003', symbol: 'TSLA', type: 'BUY', quantity: 200, price: 245.67, status: 'CANCELLED', timestamp: new Date().toISOString() }
        ],
        totalOrders: 3,
        activeOrders: 1,
        timestamp: new Date().toISOString()
      },
      status: 'success'
    };
  }
}
