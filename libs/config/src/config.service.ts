import { Injectable } from '@nestjs/common';
import { NexusConfig } from './interfaces/nexus.config';

@Injectable()
export class ConfigService {
  private readonly config: NexusConfig;

  constructor() {
    this.config = this.loadConfiguration();
  }

  private loadConfiguration(): NexusConfig {
    return {
      app: {
        port: parseInt(process.env.PORT || '3000', 10),
        environment: process.env.NODE_ENV || 'development',
        corsOrigins: process.env.CORS_ORIGINS?.split(',') || [
          'http://localhost:3000',
        ],
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
        rateLimitWindowMs: parseInt(
          process.env.RATE_LIMIT_WINDOW_MS || '900000',
          10,
        ), // 15 minutes
        logLevel: process.env.LOG_LEVEL || 'info',
      },
      database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_DATABASE || 'nexus',
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
        logging: process.env.DB_LOGGING === 'true',
        ssl: process.env.DB_SSL === 'true',
      },
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0', 10),
        keyPrefix: process.env.REDIS_KEY_PREFIX || 'nexus:',
        maxRetriesPerRequest: parseInt(
          process.env.REDIS_MAX_RETRIES || '3',
          10,
        ),
      },
      kafka: {
        brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
        clientId: process.env.KAFKA_CLIENT_ID || 'nexus-gateway',
        groupId: process.env.KAFKA_GROUP_ID || 'nexus-gateway-group',
        ssl: process.env.KAFKA_SSL === 'true',
        sasl: process.env.KAFKA_SASL_MECHANISM
          ? {
              mechanism: process.env.KAFKA_SASL_MECHANISM,
              username: process.env.KAFKA_SASL_USERNAME || '',
              password: process.env.KAFKA_SASL_PASSWORD || '',
            }
          : undefined,
      },
      jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      },
    };
  }

  get<K extends keyof NexusConfig>(key: K): NexusConfig[K] {
    return this.config[key];
  }

  getAll(): NexusConfig {
    return this.config;
  }

  isDevelopment(): boolean {
    return this.config.app.environment === 'development';
  }

  isProduction(): boolean {
    return this.config.app.environment === 'production';
  }
}
