// Common interfaces and types for the Nexus platform

export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  isLocked: boolean;
  failedLoginAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

export interface SessionData {
  userId: string;
  email: string;
  loginTime: Date;
  lastActivity: Date;
  refreshToken: string;
  deviceInfo?: string;
}

export interface WebSocketSession {
  userId: string;
  socketId: string;
  connectedAt: Date;
  lastPing: Date;
  subscriptions: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: Date;
  correlationId: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  correlationId: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Event types for Kafka
export interface BaseEvent {
  eventId: string;
  eventType: string;
  timestamp: Date;
  correlationId: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface UserLoginEvent extends BaseEvent {
  eventType: 'user.login';
  payload: {
    userId: string;
    email: string;
    loginTime: Date;
    ipAddress: string;
    userAgent: string;
  };
}

export interface UserLogoutEvent extends BaseEvent {
  eventType: 'user.logout';
  payload: {
    userId: string;
    sessionDuration: number;
  };
}

export interface ServiceHealthEvent extends BaseEvent {
  eventType: 'service.health';
  payload: {
    serviceName: string;
    status: 'healthy' | 'unhealthy';
    metrics: Record<string, number>;
  };
}

// gRPC service interfaces
export interface GrpcServiceConfig {
  name: string;
  url: string;
  package: string;
  protoPath: string;
}

export interface GrpcClientOptions {
  maxRetries: number;
  retryDelay: number;
  timeout: number;
  keepAlive: boolean;
}

// WebSocket message types
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: Date;
  correlationId: string;
}

export interface WebSocketResponse {
  type: string;
  payload: any;
  success: boolean;
  error?: string;
  timestamp: Date;
  correlationId: string;
}

// Rate limiting types
export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
}

export interface RateLimitInfo {
  limit: number;
  current: number;
  remaining: number;
  resetTime: Date;
}
