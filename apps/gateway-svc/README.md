# Gateway Service

The Gateway Service is the main entry point for the Nexus backend system. It provides API gateway functionality with comprehensive infrastructure setup including database connections, Redis caching, structured logging, and health checks.

## Features

### Infrastructure Components

1. **NestJS Application with Microservices Support**
   - Configured for HTTP and microservices transport
   - Global validation pipes
   - CORS configuration
   - Environment-based configuration

2. **PostgreSQL Database Connection**
   - TypeORM integration with optimized connection pooling
   - Environment-based configuration
   - SSL support for production environments
   - Migration support

3. **Redis Client for Session Management and Caching**
   - IORedis client with connection pooling
   - Session management utilities
   - Caching operations
   - Connection health monitoring

4. **Structured Logging with Correlation IDs**
   - Winston logger integration
   - Correlation ID middleware for request tracing
   - Multiple log levels and outputs
   - JSON structured logging for production

5. **Health Check Endpoints**
   - Database health monitoring
   - Redis health monitoring
   - Kubernetes-ready health endpoints (/health, /health/ready, /health/live)

6. **Environment Validation**
   - Joi schema validation for environment variables
   - Type-safe configuration management
   - Required environment variable enforcement

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

### Application
- `NODE_ENV`: Environment (development, production, test)
- `PORT`: Application port (default: 3000)
- `LOG_LEVEL`: Logging level (debug, info, warn, error)
- `CORS_ORIGINS`: Comma-separated list of allowed origins

### Database
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password (required)
- `DB_DATABASE`: Database name
- `DB_SYNCHRONIZE`: Auto-sync schema (false for production)
- `DB_LOGGING`: Enable query logging
- `DB_SSL`: Enable SSL connection

### Redis
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port (default: 6379)
- `REDIS_PASSWORD`: Redis password (optional)
- `REDIS_DB`: Redis database number

### JWT
- `JWT_SECRET`: JWT signing secret (required)
- `JWT_EXPIRES_IN`: JWT expiration time
- `JWT_REFRESH_SECRET`: Refresh token secret (required)
- `JWT_REFRESH_EXPIRES_IN`: Refresh token expiration

### Kafka (for future microservices)
- `KAFKA_BROKERS`: Kafka broker addresses
- `KAFKA_CLIENT_ID`: Kafka client identifier
- `KAFKA_GROUP_ID`: Kafka consumer group

## API Endpoints

### Application
- `GET /` - Hello endpoint with environment info
- `GET /status` - Service status and configuration info

### Health Checks
- `GET /health` - Overall health check
- `GET /health/ready` - Readiness probe (database + redis)
- `GET /health/live` - Liveness probe (application only)

## Development

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Redis 6+

### Setup
1. Install dependencies: `npm install`
2. Copy environment file: `cp .env.example .env`
3. Configure environment variables in `.env`
4. Start the application: `npm run dev`

### Testing
- Run tests: `npm test`
- Run specific test: `npm test -- --testPathPatterns=infrastructure.spec.ts`
- Test coverage: `npm run test:cov`

### Building
- Build application: `npm run build`
- Start production: `npm run start:prod`

## Architecture

The service follows a modular architecture with clear separation of concerns:

```
apps/gateway-svc/src/
├── infrastructure/          # Infrastructure modules
│   ├── database/           # Database configuration
│   ├── redis/              # Redis client and service
│   ├── logging/            # Logging and correlation IDs
│   └── health/             # Health check endpoints
├── gateway-svc.module.ts   # Main application module
├── gateway-svc.service.ts  # Application service
├── gateway-svc.controller.ts # HTTP controllers
└── main.ts                 # Application bootstrap
```

## Monitoring

The service provides comprehensive monitoring capabilities:

1. **Health Endpoints**: Kubernetes-ready health checks
2. **Structured Logging**: JSON logs with correlation IDs
3. **Request Tracing**: Correlation ID middleware for request tracking
4. **Connection Monitoring**: Database and Redis health indicators

## Security

- Environment variable validation
- CORS configuration
- Input validation with class-validator
- Secure database connections with SSL support
- JWT-based authentication (configuration ready)

## Performance

- Optimized database connection pooling
- Redis connection pooling and retry logic
- Lazy loading for Redis connections
- Efficient logging with structured output