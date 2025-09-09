# Nexus Trading Platform - Backend

A high-performance microservices-based trading platform backend built with NestJS, TypeScript, and modern cloud-native technologies.

## 🏗️ Architecture Overview

This is a **monorepo** containing multiple microservices and shared packages for the Nexus Trading Platform:

### 🚀 Microservices (4/4 Complete)
- **Gateway Service** (`gateway-svc`) - API Gateway and routing layer
- **Financial Data Service** (`findata-svc`) - Market data aggregation and processing  
- **Trading Service** (`trading-svc`) - Order management and execution engine
- **Notification Service** (`notification-svc`) - Real-time alerts and messaging

### 📦 Shared Packages (7/7 Complete)
- **@nexus/config** - Centralized configuration management
- **@nexus/errors** - Standardized error handling
- **@nexus/health** - Health check utilities with NestJS Terminus
- **@nexus/proto** - Protocol buffer definitions for inter-service communication
- **@nexus/types** - Shared TypeScript type definitions
- **@nexus/utils** - Common utility functions
- **@nexus/validation** - Input validation schemas

## 🛠️ Tech Stack

- **Framework**: NestJS 11.x with Express
- **Language**: TypeScript 5.x
- **Build System**: Turbo (monorepo orchestration) + pnpm workspaces
- **Databases**: PostgreSQL 15, MongoDB 7
- **Caching**: Redis 7
- **Message Queue**: Apache Kafka with Zookeeper
- **Process Management**: PM2 (production deployment)
- **Testing**: Jest with coverage support
- **Code Quality**: ESLint + Prettier

## 🚦 Current Status

### ✅ Completed Infrastructure
- [x] Monorepo setup with Turbo + pnpm workspaces
- [x] All 4 core microservices scaffolded
- [x] All 7 shared packages implemented
- [x] Docker Compose environment (PostgreSQL, MongoDB, Redis, Kafka)
- [x] PM2 production configuration
- [x] TypeScript build pipeline
- [x] Testing framework setup
- [x] Code quality tools (ESLint, Prettier)

### 🔄 In Progress
- [ ] Service implementations (business logic)
- [ ] Database schemas and migrations
- [ ] Inter-service communication (gRPC/HTTP)
- [ ] Authentication & authorization
- [ ] API documentation (OpenAPI/Swagger)

### 📋 Next Steps
- [ ] Market data integration
- [ ] Order management system
- [ ] Real-time WebSocket connections
- [ ] Monitoring & observability
- [ ] CI/CD pipeline
- [ ] Load testing & performance optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 9.12+
- Docker & Docker Compose

### Installation
```bash
# Install dependencies
pnpm install

# Start infrastructure services
pnpm docker:up

# Build all packages and services
pnpm build

# Start development mode (all services)
pnpm dev
```

### Service Ports
- **Gateway Service**: `http://localhost:3000`
- **Financial Data Service**: `http://localhost:3001`  
- **Trading Service**: `http://localhost:3002`
- **Notification Service**: `http://localhost:3003`

### Infrastructure Ports
- **PostgreSQL**: `localhost:5432`
- **MongoDB**: `localhost:27017`
- **Redis**: `localhost:6379`
- **Kafka**: `localhost:9092`

## 📝 Available Scripts

```bash
# Development
pnpm dev              # Start all services in watch mode
pnpm build            # Build all packages and services
pnpm test             # Run tests across all packages
pnpm lint             # Lint all code

# Production
pnpm build:prod       # Production build with optimizations
pnpm start:prod       # Start with PM2 (requires build first)

# Docker
pnpm docker:up        # Start infrastructure services
pnpm docker:down      # Stop infrastructure services
pnpm docker:logs      # View infrastructure logs

# Utilities
pnpm clean            # Clean all build artifacts
```

## 🏢 Project Structure

```
nexus-be/
├── apps/                    # Microservices
│   ├── gateway-svc/        # API Gateway
│   ├── findata-svc/        # Financial Data Service
│   ├── trading-svc/        # Trading Service
│   └── notification-svc/   # Notification Service
├── packages/               # Shared Libraries
│   ├── config/            # Configuration utilities
│   ├── errors/            # Error handling
│   ├── health/            # Health checks
│   ├── proto/             # Protocol buffers
│   ├── types/             # TypeScript types
│   ├── utils/             # Common utilities
│   └── validation/        # Input validation
├── docker/                # Docker configurations
│   └── compose/           # Docker Compose files
├── scripts/               # Build and deployment scripts
└── artifacts/             # Production build outputs
```

## 🔧 Development

Each service is a standalone NestJS application with:
- Hot reload development mode
- Comprehensive test suite (unit + e2e)
- Shared package dependencies via workspace protocol
- Consistent build and deployment pipeline

### Adding New Features
1. Implement business logic in respective service
2. Add shared types/utilities to packages if needed
3. Update tests and documentation
4. Ensure all services build and pass tests

## 📊 Production Deployment

The platform uses PM2 for production process management with the following configuration:
- **Gateway**: Port 3000
- **Financial Data**: Port 3001  
- **Trading**: Port 3002
- **Notifications**: Port 3003

All services are configured for zero-downtime deployments and automatic restart on failure.

---

**Status**: 🟡 **Foundation Complete** - Core infrastructure and scaffolding ready for business logic implementation