# Multi-stage build for Gateway Service
# Stage 1: Build dependencies and compile TypeScript
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

# Copy source code
COPY apps/gateway-svc ./apps/gateway-svc
COPY libs ./libs

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Install dev dependencies for build
RUN npm ci

# Build the application
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

# Create logs directory
RUN mkdir -p /app/logs && chown -R nestjs:nodejs /app/logs

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/apps/gateway-svc/scripts/health-check.js || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/apps/gateway-svc/main.js"]

# Stage 3: Development environment
FROM node:20-alpine AS development

# Install dumb-init
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY apps/gateway-svc ./apps/gateway-svc
COPY libs ./libs

# Create logs directory
RUN mkdir -p /app/logs

# Expose port and debug port
EXPOSE 3000 9229

# Health check for development
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD npm run health-check || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start in development mode with hot reload and debugging
CMD ["npm", "run", "start:debug"]