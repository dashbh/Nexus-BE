import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import mockData from '../mock.json';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern({ cmd: 'getPortfolio' })
  getPortfolioMessage() {
    return mockData.portfolio;
  }

  @MessagePattern({ cmd: 'getPortfolioByUser' })
  getPortfolioByUserMessage(payload: { userId: string }) {
    return mockData.portfolio.filter((p: any) => p.userId === payload.userId);
  }

  @MessagePattern({ cmd: 'getMarketData' })
  getMarketDataMessage() {
    return mockData.marketdata;
  }

  @MessagePattern({ cmd: 'getMarketDataBySymbol' })
  getMarketDataBySymbolMessage(payload: { symbol: string }) {
    return mockData.marketdata.find((m: any) => m.symbol === payload.symbol);
  }
}
