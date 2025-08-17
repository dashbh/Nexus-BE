# Docker Configuration for Nexus Gateway Service

This directory contains Docker configuration files for the Nexus Gateway Service development and production environments.

## 🏗️ Architecture Overview

The Docker setup provides a complete microservices development environment with:

- **Gateway Service**: NestJS application with hot reload and debugging
- **PostgreSQL**: Primary database with initialization scripts
- **Redis**: Session store and caching layer
- **Kafka + Zookeeper**: Event streaming platform
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization
- **Development Tools**: Kafka UI, Redis Commander, pgAdmin

## 📁 Directory Structure

```
docker/
├── grafana/
│   ├── dashboards/          # Grafana dashboard definitions
│   └── provisioning/        # Grafana configuration
├── nginx/                   # Nginx configuration for production
├── pgadmin/                 # pgAdmin server configuration
├── postgres/
│   └── init/               # Database initialization scripts
├── prometheus/             # Prometheus configuration
└── redis/                  # Redis configuration
```

## 🚀 Quick Start

### Development Environment

1. **Setup the environment:**
   ```bash
   ./scripts/dev-setup.sh
   ```

2. **Or manually:**
   ```bash
   # Copy environment file
   cp .env.development .env
   
   # Start services
   docker-compose up -d
   
   # View logs
   docker-compose logs -f gateway-svc
   ```

### Production Environment

1. **Set environment variables:**
   ```bash
   export DB_HOST=your-db-host
   export DB_PASSWORD=your-db-password
   export JWT_SECRET=your-jwt-secret
   # ... other production variables
   ```

2. **Deploy:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 🔧 Service Configuration

### Gateway Service

- **Development**: Hot reload enabled, debug port exposed
- **Production**: Optimized build, health checks, resource limits
- **Ports**: 3000 (HTTP), 9229 (Debug)

### PostgreSQL

- **Version**: PostgreSQL 16 Alpine
- **Port**: 5432
- **Databases**: `nexus_dev`, `nexus_test`
- **Schemas**: `auth`, `audit`, `metrics`
- **Extensions**: `uuid-ossp`, `pgcrypto`

### Redis

- **Version**: Redis 7 Alpine
- **Port**: 6379
- **Configuration**: Optimized for session storage
- **Persistence**: AOF + RDB snapshots

### Kafka

- **Version**: Confluent Platform 7.4.0
- **Port**: 9092 (external), 29092 (internal)
- **Topics**: Auto-creation enabled
- **Replication**: Single node (development)

### Monitoring Stack

- **Prometheus**: Metrics collection on port 9090
- **Grafana**: Visualization on port 3001
- **Default Credentials**: admin/admin_password

## 🌐 Service URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| Gateway Service | http://localhost:3000 | - |
| Health Check | http://localhost:3000/health | - |
| Kafka UI | http://localhost:8080 | - |
| Redis Commander | http://localhost:8081 | - |
| pgAdmin | http://localhost:8082 | admin@nexus.dev / admin_password |
| Prometheus | http://localhost:9090 | - |
| Grafana | http://localhost:3001 | admin / admin_password |

## 🔍 Health Checks

All services include comprehensive health checks:

- **Gateway Service**: HTTP endpoint + startup probes
- **PostgreSQL**: Connection validation
- **Redis**: Ping command
- **Kafka**: Broker API validation
- **Zookeeper**: Four-letter word commands

## 📊 Monitoring & Logging

### Metrics Collection

- **Prometheus**: Scrapes metrics from all services
- **Grafana**: Pre-configured dashboards
- **Custom Metrics**: Application-specific metrics

### Logging

- **Structured Logging**: JSON format with correlation IDs
- **Log Rotation**: Automatic cleanup
- **Centralized**: All logs accessible via Docker

### Alerting

- **Health Checks**: Automatic container restart on failure
- **Resource Limits**: Memory and CPU constraints
- **Custom Alerts**: Configurable via Prometheus rules

## 🔒 Security

### Development

- **Network Isolation**: Services communicate via Docker network
- **Secrets**: Environment variables (not for production)
- **CORS**: Configured for local development

### Production

- **TLS/SSL**: Nginx with SSL termination
- **Secrets Management**: External secret providers
- **Rate Limiting**: Nginx-based protection
- **Security Headers**: Comprehensive header configuration

## 🛠️ Development Workflow

### Hot Reload

The Gateway Service supports hot reload in development:

```bash
# Watch mode with hot reload
docker-compose exec gateway-svc npm run dev

# Debug mode with hot reload
docker-compose exec gateway-svc npm run start:debug
```

### Debugging

Debug the application using your IDE:

1. **VS Code**: Attach to port 9229
2. **WebStorm**: Remote Node.js debug configuration
3. **Chrome DevTools**: chrome://inspect

### Database Management

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U nexus -d nexus_dev

# Run migrations
docker-compose exec gateway-svc npm run migration:run

# Seed data
docker-compose exec gateway-svc npm run seed
```

### Testing

```bash
# Unit tests
docker-compose exec gateway-svc npm run test

# E2E tests
docker-compose exec gateway-svc npm run test:e2e

# Test coverage
docker-compose exec gateway-svc npm run test:cov
```

## 🧹 Cleanup

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Complete cleanup
./scripts/dev-cleanup.sh --full
```

### Troubleshooting

```bash
# View service logs
docker-compose logs -f [service-name]

# Check service health
docker-compose ps

# Restart specific service
docker-compose restart [service-name]

# Shell access
docker-compose exec [service-name] sh
```

## 📈 Performance Tuning

### Resource Allocation

Development environment resource recommendations:

- **Gateway Service**: 512MB RAM, 0.5 CPU
- **PostgreSQL**: 256MB RAM, 0.3 CPU
- **Redis**: 128MB RAM, 0.2 CPU
- **Kafka**: 512MB RAM, 0.5 CPU

### Optimization

- **Build Cache**: Multi-stage Docker builds
- **Volume Mounts**: Node modules optimization
- **Network**: Bridge network with subnet isolation
- **Storage**: Named volumes for persistence

## 🔄 CI/CD Integration

### Build Pipeline

```yaml
# Example GitHub Actions workflow
- name: Build Docker Image
  run: |
    docker build -f apps/gateway-svc/Dockerfile \
      --target production \
      -t nexus-gateway:${{ github.sha }} .

- name: Run Tests
  run: |
    docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

### Deployment

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# Health check
curl -f http://localhost:3000/health

# Rolling update
docker-compose -f docker-compose.prod.yml up -d --no-deps gateway-svc
```

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [NestJS Docker Guide](https://docs.nestjs.com/recipes/docker)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Redis Docker Hub](https://hub.docker.com/_/redis)
- [Kafka Docker Guide](https://kafka.apache.org/quickstart)