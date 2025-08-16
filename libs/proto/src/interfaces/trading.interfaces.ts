// Trading Service gRPC Interfaces

export interface GetMarketDataRequest {
  symbol: string;
  timeframe?: string;
  limit?: number;
}

export interface GetMarketDataResponse {
  success: boolean;
  data?: {
    symbol: string;
    price: number;
    volume: number;
    timestamp: string;
    change24h: number;
  }[];
  message?: string;
}

export interface PlaceOrderRequest {
  userId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT';
  quantity: number;
  price?: number;
}

export interface PlaceOrderResponse {
  success: boolean;
  orderId?: string;
  status?: string;
  message?: string;
}
