# Gateway Service Design Document

## Overview

The Gateway Service serves as the primary entry point for the Nexus trading platform, providing comprehensive API Gateway functionality, authentication management, and WebSocket orchestration. This foundational service establishes common packages with shared utilities, implements REST/GraphQL to gRPC conversion, enforces security policies, and manages real-time communication infrastructure. Built on NestJS microservices architecture, it leverages the existing monorepo structure and establishes core architecture patterns that other microservices will depend on.

## Architecture

### High-Level Architecture

```mermaid
graph TB
    Client[Client Applications] --> Gateway[Gateway Service]
    Gateway --> Auth[Authentication Module]
    Gateway --> API[API Gateway Module]
    Gateway --> WS[WebSocket Module]
    Gateway --> Security[Security Module]

    Auth --> Redis[(Redis Session Store)]
    Auth --> DB[(PostgreSQL)]

    API --> Trading[Trading Service gRPC]
    API --> FinData[FinData Service gRPC]
    API --> Notification[Notification Service gRPC]

    WS --> Kafka[(Kafka Event Stream)]
    WS --> Redis

    Gateway --> Common[Common Packages]
    Common --> Validation[nexus/validation]
    Common --> Types[nexus/types]
    Common --> Utils[nexus/utils]
    Common --> Proto[nexus/proto]
    Common --> Errors[nexus/errors]
    Common --> Config[nexus/config]
```

### Monorepo Structure Integration

The design leverages the existing monorepo setup:

- **Existing Gateway Service**: `apps/gateway-svc` (empty, to be populated)
- **Common Packages**: `libs/*` (to be implemented with shared utilities)
- **NestJS CLI Integration**: All code generation will use `nest generate` commands
- **Workspace Configuration**: Utilizes existing `nest-cli.json` and `package.json` workspace setup
- **Docker Integration**: Containerized deployment with multi-stage builds
- **Development Environment**: Hot reload and debugging capabilities

## Components and Interfaces

### 1. Common Packages Foundation

#### @nexus/validation Package

```typescript
// Shared validation schemas using class-validator
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
```

#### @nexus/types Package

```typescript
// Common interfaces and types
export interface User {
  id: string;
  email: string;
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
}
```

#### @nexus/proto Package

```protobuf
// gRPC service definitions
syntax = "proto3";

package nexus.gateway;

service AuthService {
  rpc ValidateUser(ValidateUserRequest) returns (ValidateUserResponse);
  rpc CreateUser(CreateUserRequest) returns (CreateUserResponse);
}

message ValidateUserRequest {
  string email = 1;
  string password = 2;
}
```

#### @nexus/config Package

```typescript
// Environment configuration management
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
}

export interface KafkaConfig {
  brokers: string[];
  clientId: string;
  groupId: string;
  ssl?: boolean;
  sasl?: {
    mechanism: string;
    username: string;
    password: string;
  };
}

export const configuration = () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    // ... other config
  },
  kafka: {
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    clientId: process.env.KAFKA_CLIENT_ID || 'nexus-gateway',
    groupId: process.env.KAFKA_GROUP_ID || 'nexus-gateway-group',
    // ... other config
  },
});
```

### 2. Gateway Service Core Modules

#### Authentication Module

- **Purpose**: Handle user registration, login, JWT token management
- **Generated with**: `nest g module auth` in gateway-svc
- **Components**:
  - AuthController: REST endpoints for auth operations
  - AuthService: Business logic for authentication
  - JwtStrategy: Passport JWT strategy implementation
  - AuthGuard: Route protection middleware

#### API Gateway Module

- **Purpose**: REST/GraphQL to gRPC conversion and routing
- **Generated with**: `nest g module api-gateway` in gateway-svc
- **Components**:
  - GatewayController: REST API endpoints
  - GraphQLResolver: GraphQL query/mutation resolvers
  - GrpcClientService: gRPC client connection management
  - ResponseTransformer: Format conversion utilities

#### WebSocket Module

- **Purpose**: Real-time communication and session management
- **Generated with**: `nest g gateway websocket` in gateway-svc
- **Components**:
  - WebSocketGateway: Socket.IO server implementation
  - SessionManager: WebSocket session state management
  - EventHandler: Real-time event processing
  - PresenceService: User presence tracking

#### Kafka Event Streaming Module

- **Purpose**: Event-driven communication and message streaming
- **Generated with**: `nest g module kafka` in gateway-svc
- **Components**:
  - KafkaProducerService: Event publishing to Kafka topics
  - KafkaConsumerService: Event consumption and processing
  - EventSerializer: Message serialization/deserialization
  - TopicManager: Topic creation and management
  - DeadLetterHandler: Failed message processing

#### Security Module

- **Purpose**: Security middleware, rate limiting, CORS
- **Generated with**: `nest g module security` in gateway-svc
- **Components**:
  - SecurityMiddleware: Request security processing
  - RateLimitGuard: Rate limiting implementation
  - CorsConfig: CORS configuration
  - SecurityHeaders: Security header management

## Data Models

### User Entity (PostgreSQL)

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: false })
  isLocked: boolean;

  @Column({ default: 0 })
  failedLoginAttempts: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Session Data (Redis)

```typescript
interface SessionData {
  userId: string;
  email: string;
  loginTime: Date;
  lastActivity: Date;
  refreshToken: string;
  deviceInfo?: string;
}

// Redis key pattern: session:{sessionId}
// TTL: 7 days for refresh token sessions
```

### WebSocket Session (Redis)

```typescript
interface WebSocketSession {
  userId: string;
  socketId: string;
  connectedAt: Date;
  lastPing: Date;
  subscriptions: string[];
}

// Redis key pattern: ws_session:{userId}
// TTL: Connection lifetime + 5 minutes
```

## Error Handling

### Standardized Error Response Format

```typescript
export class ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  correlationId: string;
}

export enum ErrorCodes {
  INVALID_CREDENTIALS = 'AUTH_001',
  ACCOUNT_LOCKED = 'AUTH_002',
  TOKEN_EXPIRED = 'AUTH_003',
  RATE_LIMIT_EXCEEDED = 'SECURITY_001',
  VALIDATION_FAILED = 'VALIDATION_001',
}
```

### Error Handling Strategy

- **Global Exception Filter**: Catch and format all exceptions
- **Validation Pipe**: Handle DTO validation errors
- **gRPC Error Mapping**: Convert gRPC errors to HTTP responses
- **Circuit Breaker**: Handle downstream service failures
- **Correlation IDs**: Track errors across service boundaries

## Testing Strategy

### Unit Testing

- **Framework**: Jest (already configured in NestJS)
- **Coverage Target**: 90%+ for critical authentication flows
- **Mock Strategy**: Mock external dependencies (Redis, PostgreSQL, gRPC clients)
- **Generated with**: `nest g service auth --spec` creates test files automatically

### Integration Testing

- **Database Testing**: Use TestContainers for PostgreSQL
- **Redis Testing**: Use ioredis-mock for session testing
- **gRPC Testing**: Mock gRPC client responses
- **WebSocket Testing**: Test real-time communication flows

### End-to-End Testing

- **Framework**: Supertest for HTTP endpoints
- **WebSocket Testing**: Socket.IO client for real-time testing
- **Authentication Flows**: Complete login/logout/refresh cycles
- **Security Testing**: Rate limiting, CORS, input validation

### Performance Testing

- **Load Testing**: Artillery.js for concurrent user simulation
- **WebSocket Load**: Test 1000+ concurrent connections
- **Response Time**: Validate sub-100ms authentication responses
- **Memory Profiling**: Monitor for memory leaks in long-running sessions

## Implementation Approach

### Phase 1: Foundation Setup

1. Configure common packages using NestJS CLI
2. Set up Gateway Service basic structure
3. Implement database connections and Redis client
4. Create basic health check endpoints

### Phase 2: Authentication Core

1. Generate Auth module with NestJS CLI
2. Implement user registration and login
3. Set up JWT token generation and validation
4. Implement session management with Redis

### Phase 3: API Gateway

1. Generate API Gateway module
2. Implement REST to gRPC conversion
3. Set up GraphQL resolver framework
4. Implement request routing and load balancing

### Phase 4: Real-time Communication

1. Generate WebSocket gateway
2. Implement session management for WebSocket connections
3. Set up Kafka event streaming integration
4. Implement real-time event broadcasting

### Phase 5: Security & Monitoring

1. Generate Security module
2. Implement rate limiting and security middleware
3. Set up comprehensive logging and monitoring
4. Implement circuit breaker patterns

## API Documentation

### Swagger/OpenAPI Integration

The Gateway Service will provide comprehensive API documentation using Swagger/OpenAPI:

#### REST API Documentation

```typescript
// Example controller with OpenAPI decorators
@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    // Implementation
  }
}
```

#### Documentation Components

- **Interactive Swagger UI**: Available at `/api/docs` for testing endpoints
- **OpenAPI Schema**: Auto-generated from decorators and DTOs
- **Authentication Documentation**: JWT token usage and security schemes
- **Error Response Documentation**: Standardized error formats and codes
- **Request/Response Examples**: Real-world usage examples for all endpoints

#### GraphQL Documentation

- **GraphQL Playground**: Interactive query testing interface
- **Schema Documentation**: Auto-generated from resolvers and types
- **Subscription Documentation**: Real-time event schema definitions

#### WebSocket Documentation

- **Event Documentation**: Message formats and event types
- **Connection Guide**: Authentication and session management
- **Real-time Flow Examples**: Common usage patterns

### NestJS CLI Usage Strategy

- Use `nest generate` for all module, service, controller, and guard creation
- Leverage NestJS decorators and dependency injection
- Follow NestJS best practices for module organization
- Use NestJS testing utilities for test generation
