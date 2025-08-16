#!/bin/bash

# Development Environment Setup Script for Nexus Gateway Service

set -e

echo "🚀 Setting up Nexus Gateway Service development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed and running
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi

    print_success "Docker is installed and running"
}

# Check if Docker Compose is installed
check_docker_compose() {
    print_status "Checking Docker Compose installation..."
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_success "Docker Compose is installed"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p apps/gateway-svc/logs
    mkdir -p docker/postgres/data
    mkdir -p docker/redis/data
    mkdir -p docker/kafka/data
    mkdir -p docker/prometheus/data
    mkdir -p docker/grafana/data
    print_success "Directories created"
}

# Copy environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    if [ ! -f .env ]; then
        cp .env.development .env
        print_success "Created .env file from .env.development"
    else
        print_warning ".env file already exists, skipping..."
    fi
}

# Build and start services
start_services() {
    print_status "Building and starting services..."
    docker-compose down --remove-orphans
    docker-compose build --no-cache
    docker-compose up -d
    print_success "Services started"
}

# Wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to be healthy..."
    
    services=("postgres" "redis" "kafka" "gateway-svc")
    
    for service in "${services[@]}"; do
        print_status "Waiting for $service to be healthy..."
        timeout=60
        counter=0
        
        while [ $counter -lt $timeout ]; do
            if docker-compose ps $service | grep -q "healthy\|Up"; then
                print_success "$service is healthy"
                break
            fi
            
            if [ $counter -eq $((timeout-1)) ]; then
                print_error "$service failed to become healthy within $timeout seconds"
                docker-compose logs $service
                exit 1
            fi
            
            sleep 1
            counter=$((counter+1))
        done
    done
}

# Display service URLs
display_urls() {
    print_success "🎉 Development environment is ready!"
    echo ""
    echo "📋 Service URLs:"
    echo "  Gateway Service:     http://localhost:3000"
    echo "  Gateway Health:      http://localhost:3000/health"
    echo "  Kafka UI:           http://localhost:8080"
    echo "  Redis Commander:    http://localhost:8081"
    echo "  pgAdmin:            http://localhost:8082 (admin@nexus.dev / admin_password)"
    echo "  Prometheus:         http://localhost:9090"
    echo "  Grafana:            http://localhost:3001 (admin / admin_password)"
    echo ""
    echo "🐳 Docker Commands:"
    echo "  View logs:          docker-compose logs -f [service_name]"
    echo "  Stop services:      docker-compose down"
    echo "  Restart service:    docker-compose restart [service_name]"
    echo "  Shell access:       docker-compose exec [service_name] sh"
    echo ""
    echo "🔧 Development Commands:"
    echo "  Hot reload:         npm run start:dev"
    echo "  Debug mode:         npm run start:debug"
    echo "  Run tests:          npm run test"
    echo "  Run e2e tests:      npm run test:e2e"
}

# Main execution
main() {
    echo "🏗️  Nexus Gateway Service Development Setup"
    echo "=========================================="
    
    check_docker
    check_docker_compose
    create_directories
    setup_environment
    start_services
    wait_for_services
    display_urls
}

# Run main function
main "$@"