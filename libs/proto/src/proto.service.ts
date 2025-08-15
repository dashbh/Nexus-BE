import { Injectable } from '@nestjs/common';

// Protocol Buffer service definitions and interfaces
export interface GrpcServiceDefinition {
  name: string;
  package: string;
  methods: GrpcMethodDefinition[];
}

export interface GrpcMethodDefinition {
  name: string;
  requestType: string;
  responseType: string;
  requestStream?: boolean;
  responseStream?: boolean;
}

// Authentication Service Proto Interfaces
export interface ValidateUserRequest {
  email: string;
  password: string;
}

export interface ValidateUserResponse {
  success: boolean;
  userId?: string;
  message?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  metadata?: Record<string, string>;
}

export interface CreateUserResponse {
  success: boolean;
  userId?: string;
  message?: string;
}

export interface GetUserRequest {
  userId: string;
}

export interface GetUserResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    isLocked: boolean;
  };
  message?: string;
}

// Trading Service Proto Interfaces
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

// Notification Service Proto Interfaces
export interface SendNotificationRequest {
  userId: string;
  type: 'EMAIL' | 'SMS' | 'PUSH';
  title: string;
  message: string;
  metadata?: Record<string, string>;
}

export interface SendNotificationResponse {
  success: boolean;
  notificationId?: string;
  message?: string;
}

export interface GetNotificationsRequest {
  userId: string;
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
}

export interface GetNotificationsResponse {
  success: boolean;
  notifications?: {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
  }[];
  total?: number;
  message?: string;
}

// Financial Data Service Proto Interfaces
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

// Service definitions for gRPC clients
export const GRPC_SERVICES = {
  AUTH_SERVICE: {
    name: 'AuthService',
    package: 'nexus.auth',
    methods: [
      {
        name: 'ValidateUser',
        requestType: 'ValidateUserRequest',
        responseType: 'ValidateUserResponse',
      },
      {
        name: 'CreateUser',
        requestType: 'CreateUserRequest',
        responseType: 'CreateUserResponse',
      },
      {
        name: 'GetUser',
        requestType: 'GetUserRequest',
        responseType: 'GetUserResponse',
      },
    ],
  },
  TRADING_SERVICE: {
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
  },
  NOTIFICATION_SERVICE: {
    name: 'NotificationService',
    package: 'nexus.notification',
    methods: [
      {
        name: 'SendNotification',
        requestType: 'SendNotificationRequest',
        responseType: 'SendNotificationResponse',
      },
      {
        name: 'GetNotifications',
        requestType: 'GetNotificationsRequest',
        responseType: 'GetNotificationsResponse',
      },
    ],
  },
  FINDATA_SERVICE: {
    name: 'FinDataService',
    package: 'nexus.findata',
    methods: [
      {
        name: 'GetPriceHistory',
        requestType: 'GetPriceHistoryRequest',
        responseType: 'GetPriceHistoryResponse',
      },
    ],
  },
} as const;

// Kafka topic definitions
export const KAFKA_TOPICS = {
  USER_EVENTS: 'nexus.user.events',
  TRADING_EVENTS: 'nexus.trading.events',
  MARKET_DATA_EVENTS: 'nexus.market.events',
  NOTIFICATION_EVENTS: 'nexus.notification.events',
  SYSTEM_EVENTS: 'nexus.system.events',
  AUDIT_EVENTS: 'nexus.audit.events',
} as const;

@Injectable()
export class ProtoService {
  /**
   * Gets service definition by name
   */
  getServiceDefinition(
    serviceName: keyof typeof GRPC_SERVICES,
  ): GrpcServiceDefinition {
    const service = GRPC_SERVICES[serviceName];
    return {
      ...service,
      methods: service.methods.slice(),
    } as GrpcServiceDefinition;
  }

  /**
   * Gets all available services
   */
  getAllServices(): GrpcServiceDefinition[] {
    return Object.values(GRPC_SERVICES).map((service) => ({
      ...service,
      methods: service.methods.slice(),
    })) as GrpcServiceDefinition[];
  }

  /**
   * Gets Kafka topic by name
   */
  getKafkaTopic(topicName: keyof typeof KAFKA_TOPICS): string {
    return KAFKA_TOPICS[topicName];
  }

  /**
   * Gets all Kafka topics
   */
  getAllKafkaTopics(): string[] {
    return Object.values(KAFKA_TOPICS);
  }

  /**
   * Validates gRPC request structure
   */
  validateGrpcRequest(
    serviceName: string,
    methodName: string,
    request: unknown,
  ): boolean {
    // Basic validation - in a real implementation, you would use protobuf validation
    return request !== null && typeof request === 'object';
  }

  /**
   * Creates a standardized gRPC error response
   */
  createGrpcErrorResponse(message: string): {
    success: boolean;
    message: string;
  } {
    return {
      success: false,
      message,
    };
  }

  /**
   * Creates a standardized gRPC success response
   */
  createGrpcSuccessResponse<T extends Record<string, unknown>>(
    data?: T,
  ): { success: boolean } & T {
    return {
      success: true,
      ...(data || ({} as T)),
    };
  }
}
