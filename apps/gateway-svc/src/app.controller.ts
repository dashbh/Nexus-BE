import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('FINDATA_SERVICE') private readonly findataClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy,
    @Inject('TRADING_SERVICE') private readonly tradingClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('findata')
  getFindata(): Observable<any> {
    return this.findataClient.send('findata.getData', {});
  }

  @Get('notifications')
  getNotifications(): Observable<any> {
    return this.notificationClient.send('notification.getNotifications', {});
  }

  @Get('trading')
  getTrading(): Observable<any> {
    return this.tradingClient.send('trading.getOrders', {});
  }

  @Get('dashboard')
  async getDashboard(): Promise<any> {
    try {
      const [findata, notifications, trading] = await Promise.all([
        this.findataClient.send('findata.getData', {}).toPromise(),
        this.notificationClient.send('notification.getNotifications', {}).toPromise(),
        this.tradingClient.send('trading.getOrders', {}).toPromise(),
      ]);

      return {
        service: 'gateway-svc',
        data: {
          findata: findata?.data,
          notifications: notifications?.data,
          trading: trading?.data,
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
}
