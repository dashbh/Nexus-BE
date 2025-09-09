import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import mockData from './mock.json';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('FINDATA_SERVICE') private readonly findataClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy,
    @Inject('TRADING_SERVICE') private readonly tradingClient: ClientProxy,
  ) {}

  @Get('dashboard')
  async getDashboard(): Promise<any> {
    try {
      const [findata, notifications, trading] = await Promise.all([
        this.findataClient.send({ cmd: 'getPortfolio' }, {}).toPromise(),
        this.notificationClient.send({ cmd: 'getNotifications' }, {}).toPromise(),
        this.tradingClient.send({ cmd: 'getOrders' }, {}).toPromise(),
      ]);

      return {
        service: 'gateway-svc',
        data: {
          findata: findata,
          notifications: notifications,
          trading: trading,
        },
        timestamp: new Date().toISOString(),
        status: 'success'
      };
    } catch (error) {
      return {
        service: 'gateway-svc',
        error: 'Failed to fetch dashboard data',
        timestamp: new Date().toISOString(),
        status: 'error'
      };
    }
  }

  @Get('users')
  getUsers() {
    return mockData.users;
  }

  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return mockData.users.find((u: any) => u.id === id);
  }

  // Proxy endpoints
  @Get('portfolio')
  getPortfolio(@Query('userId') userId?: string) {
    if (userId) {
      return this.findataClient.send({ cmd: 'getPortfolioByUser' }, { userId });
    }
    return this.findataClient.send({ cmd: 'getPortfolio' }, {});
  }

  @Get('marketdata')
  getMarketData(@Query('symbol') symbol?: string) {
    if (symbol) {
      return this.findataClient.send({ cmd: 'getMarketDataBySymbol' }, { symbol });
    }
    return this.findataClient.send({ cmd: 'getMarketData' }, {});
  }

  @Get('orders')
  getOrders(@Query('userId') userId?: string) {
    if (userId) {
      return this.tradingClient.send({ cmd: 'getOrdersByUser' }, { userId });
    }
    return this.tradingClient.send({ cmd: 'getOrders' }, {});
  }

  @Get('orders/:id')
  getOrderById(@Param('id') id: string) {
    return this.tradingClient.send({ cmd: 'getOrderById' }, { id });
  }

  @Get('executions')
  getExecutions(@Query('orderId') orderId?: string) {
    if (orderId) {
      return this.tradingClient.send({ cmd: 'getExecutionsByOrder' }, { orderId });
    }
    return this.tradingClient.send({ cmd: 'getExecutions' }, {});
  }

  @Get('notifications')
  getNotifications(@Query('userId') userId?: string) {
    if (userId) {
      return this.notificationClient.send({ cmd: 'getNotificationsByUser' }, { userId });
    }
    return this.notificationClient.send({ cmd: 'getNotifications' }, {});
  }
}
