import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import mockData from '../mock.json';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'getOrders' })
  getOrdersMessage() {
    return mockData.orders;
  }

  @MessagePattern({ cmd: 'getOrderById' })
  getOrderByIdMessage(payload: { id: string }) {
    return mockData.orders.find((o: any) => o.id === payload.id);
  }

  @MessagePattern({ cmd: 'getOrdersByUser' })
  getOrdersByUserMessage(payload: { userId: string }) {
    return mockData.orders.filter((o: any) => o.userId === payload.userId);
  }

  @MessagePattern({ cmd: 'getExecutions' })
  getExecutionsMessage() {
    return mockData.executions;
  }

  @MessagePattern({ cmd: 'getExecutionsByOrder' })
  getExecutionsByOrderMessage(payload: { orderId: string }) {
    return mockData.executions.filter((e: any) => e.orderId === payload.orderId);
  }
}
