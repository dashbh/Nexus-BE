// Trading Service Definition
import { GrpcServiceDefinition } from '../interfaces/common';

export const TRADING_SERVICE: GrpcServiceDefinition = {
  name: 'TradingService',
  package: 'nexus.trading',
  methods: [
    {
      name: 'GetMarketData',
      requestType: 'GetMarketDataRequest',
      responseType: 'GetMarketDataResponse',
    },
    {
      name: 'PlaceOrder',
      requestType: 'PlaceOrderRequest',
      responseType: 'PlaceOrderResponse',
    },
  ],
};
