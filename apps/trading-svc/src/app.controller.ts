import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'getOrders' })
  getOrdersMessage() {
    const mockPath = path.resolve(__dirname, '../mock.json');
    const data = JSON.parse(fs.readFileSync(mockPath, 'utf-8'));
    return data.orders;
  }

  @MessagePattern({ cmd: 'getOrderById' })
  getOrderByIdMessage(payload: { id: string }) {
    const mockPath = path.resolve(__dirname, '../mock.json');
    const data = JSON.parse(fs.readFileSync(mockPath, 'utf-8'));
    return data.orders.find((o: any) => o.id === payload.id);
  }

  @MessagePattern({ cmd: 'getOrdersByUser' })
  getOrdersByUserMessage(payload: { userId: string }) {
    const mockPath = path.resolve(__dirname, '../mock.json');
    const data = JSON.parse(fs.readFileSync(mockPath, 'utf-8'));
    return data.orders.filter((o: any) => o.userId === payload.userId);
  }

  @MessagePattern({ cmd: 'getExecutions' })
  getExecutionsMessage() {
    const mockPath = path.resolve(__dirname, '../mock.json');
    const data = JSON.parse(fs.readFileSync(mockPath, 'utf-8'));
    return data.executions;
  }

  @MessagePattern({ cmd: 'getExecutionsByOrder' })
  getExecutionsByOrderMessage(payload: { orderId: string }) {
    const mockPath = path.resolve(__dirname, '../mock.json');
    const data = JSON.parse(fs.readFileSync(mockPath, 'utf-8'));
    return data.executions.filter((e: any) => e.orderId === payload.orderId);
  }
}
