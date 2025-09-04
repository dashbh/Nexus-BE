import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import * as fs from 'fs';
import * as path from 'path';
import * as data from '../mock.json';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern({ cmd: 'getNotifications' })
  getNotificationsMessage() {
    // const mockPath = path.resolve(__dirname, '../mock.json');
    // const data = JSON.parse(fs.readFileSync(mockPath, 'utf-8'));
    return data.notifications;
  }

  @MessagePattern({ cmd: 'getNotificationsByUser' })
  getNotificationsByUserMessage(payload: { userId: string }) {
    // const mockPath = path.resolve(__dirname, '../mock.json');
    // const data = JSON.parse(fs.readFileSync(mockPath, 'utf-8'));
    return data.notifications.filter((n: any) => n.userId === payload.userId);
  }
}
