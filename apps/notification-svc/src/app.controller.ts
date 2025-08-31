import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('notification.getNotifications')
  getNotifications(): any {
    return {
      service: 'notification-svc',
      data: {
        notifications: [
          { id: 1, type: 'alert', message: 'Market volatility detected', priority: 'high', timestamp: new Date().toISOString() },
          { id: 2, type: 'info', message: 'Daily report ready', priority: 'medium', timestamp: new Date().toISOString() },
          { id: 3, type: 'warning', message: 'API rate limit approaching', priority: 'low', timestamp: new Date().toISOString() }
        ],
        unreadCount: 2,
        timestamp: new Date().toISOString()
      },
      status: 'success'
    };
  }
}
