# Environment Configuration

This directory contains all environment configuration files for the Nexus Gateway Service.

## 📁 File Structure

```
env/
├── .env.template      # Template with all available variables
├── .env.development   # Local development environment
├── .env.docker        # Docker Compose development
├── .env.test          # Testing environment
├── .env.production    # Production environment template
└── README.md          # This file
```

## 🚀 Quick Start

### For Local Development
```bash
# Copy the development environment
npm run env:local
```

### For Docker Development
```bash
# Copy the Docker environment
npm run env:docker
```

### For Testing
```bash
# Copy the test environment
npm run env:test
```

## 📋 Environment Variables

### Application Settings
- `NODE_ENV` - Environment mode (development, test, production)
- `PORT` - Application port (default: 3000)
- `LOG_LEVEL` - Logging level (debug, info, warn, error)

### Database Configuration
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name
- `DB_SYNCHRONIZE` - Auto-sync schema (true for dev, false for prod)
- `DB_LOGGING` - Enable SQL logging
- `DB_SSL` - Enable SSL connection

### Redis Configuration
- `REDIS_HOST` - Redis host
- `REDIS_PORT` - Redis port (default: 6379)
- `REDIS_PASSWORD` - Redis password
- `REDIS_DB` - Redis database number
- `REDIS_TLS` - Enable TLS connection

### JWT Authentication
- `JWT_SECRET` - JWT signing secret (minimum 32 characters)
- `JWT_EXPIRES_IN` - JWT token expiration
- `JWT_REFRESH_SECRET` - Refresh token secret
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration

### Kafka Configuration
- `KAFKA_BROKERS` - Kafka broker addresses
- `KAFKA_CLIENT_ID` - Kafka client identifier
- `KAFKA_GROUP_ID` - Kafka consumer group
- `KAFKA_SSL` - Enable SSL/TLS
- `KAFKA_SASL_MECHANISM` - SASL authentication mechanism
- `KAFKA_SASL_USERNAME` - SASL username
- `KAFKA_SASL_PASSWORD` - SASL password

### Security & Rate Limiting
- `RATE_LIMIT_MAX` - Maximum requests per window
- `RATE_LIMIT_WINDOW_MS` - Rate limiting window in milliseconds
- `CORS_ORIGINS` - Allowed CORS origins (comma-separated)

### Monitoring & Observability
- `METRICS_ENABLED` - Enable metrics collection
- `TRACING_ENABLED` - Enable distributed tracing
- `JAEGER_ENDPOINT` - Jaeger tracing endpoint

## 🔒 Security Best Practices

### Development
- Use the provided development secrets
- Never commit real secrets to version control
- Use `.env.local` for personal overrides (gitignored)

### Production
- Use external secret management (AWS Secrets Manager, HashiCorp Vault, etc.)
- Set environment variables through your deployment platform
- Never hardcode production secrets in files

## 🐳 Docker Integration

### Development with Docker Compose
```bash
# Use Docker environment
npm run env:docker
npm run docker
```

### Production Deployment
```bash
# Set environment variables in your deployment platform
export DB_HOST=your-production-db-host
export DB_PASSWORD=your-secure-password
# ... other production variables

# Use production environment
npm run env:prod
npm run docker:prod
```

## 🧪 Testing

### Unit Tests
```bash
npm run env:test
npm run test
```

### E2E Tests with Docker
```bash
npm run docker:test
```

## 🔄 Migration from Old Structure

If you're migrating from the old environment structure:

1. **Remove old files**:
   ```bash
   rm .env .env.development .env.production
   rm apps/gateway-svc/.env.example apps/gateway-svc/.env.test
   ```

2. **Choose your environment**:
   ```bash
   # For local development
   cp env/.env.development .env
   
   # For Docker development
   cp env/.env.docker .env
   ```

3. **Update your scripts** to reference the new structure

## 📝 Customization

### Personal Overrides
Create `.env.local` for personal development overrides:
```bash
cp env/.env.development .env.local
# Edit .env.local with your personal settings
```

### New Environments
To add a new environment (e.g., staging):
1. Copy `.env.template` to `.env.staging`
2. Customize the values for staging
3. Update deployment scripts to use the new file

## 🔍 Validation

The application validates required environment variables on startup. Missing or invalid variables will cause the application to fail with descriptive error messages.

## 📚 Related Documentation

- [Docker Setup](../docker/README.md)
- [Configuration Service](../libs/config/README.md)
- [Deployment Guide](../docs/deployment.md)