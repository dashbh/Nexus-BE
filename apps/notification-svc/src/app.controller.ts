import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import mockData from './mock.json';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern({ cmd: 'getNotifications' })
  getNotificationsMessage() {
    return mockData.notifications;
  }

  @MessagePattern({ cmd: 'getNotificationsByUser' })
  getNotificationsByUserMessage(payload: { userId: string }) {
    return mockData.notifications.filter((n: any) => n.userId === payload.userId);
  }
}
