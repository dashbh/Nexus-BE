// gRPC Service Definitions Registry
import { AUTH_SERVICE } from '../services/auth.service';
import { TRADING_SERVICE } from '../services/trading.service';
import { NOTIFICATION_SERVICE } from '../services/notification.service';
import { FINDATA_SERVICE } from '../services/findata.service';

export const GRPC_SERVICES = {
  AUTH_SERVICE,
  TRADING_SERVICE,
  NOTIFICATION_SERVICE,
  FINDATA_SERVICE,
} as const;

export type GrpcServiceName = keyof typeof GRPC_SERVICES;
