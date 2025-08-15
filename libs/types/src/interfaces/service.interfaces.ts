// Service configuration interfaces

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
