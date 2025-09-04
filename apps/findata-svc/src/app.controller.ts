import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern({ cmd: 'getPortfolio' })
  getPortfolioMessage() {
    const mockPath = path.resolve(__dirname, '../mock.json');
    const data = JSON.parse(fs.readFileSync(mockPath, 'utf-8'));
    return data.portfolio;
  }

  @MessagePattern({ cmd: 'getPortfolioByUser' })
  getPortfolioByUserMessage(payload: { userId: string }) {
    const mockPath = path.resolve(__dirname, '../mock.json');
    const data = JSON.parse(fs.readFileSync(mockPath, 'utf-8'));
    return data.portfolio.filter((p: any) => p.userId === payload.userId);
  }

  @MessagePattern({ cmd: 'getMarketData' })
  getMarketDataMessage() {
    const mockPath = path.resolve(__dirname, '../mock.json');
    const data = JSON.parse(fs.readFileSync(mockPath, 'utf-8'));
    return data.marketdata;
  }

  @MessagePattern({ cmd: 'getMarketDataBySymbol' })
  getMarketDataBySymbolMessage(payload: { symbol: string }) {
    const mockPath = path.resolve(__dirname, '../mock.json');
    const data = JSON.parse(fs.readFileSync(mockPath, 'utf-8'));
    return data.marketdata.find((m: any) => m.symbol === payload.symbol);
  }
}
