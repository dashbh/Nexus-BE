// Financial Data Service gRPC Interfaces

export interface GetPriceHistoryRequest {
  symbol: string;
  interval: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  startTime?: string;
  endTime?: string;
  limit?: number;
}

export interface GetPriceHistoryResponse {
  success: boolean;
  data?: {
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
  message?: string;
}
