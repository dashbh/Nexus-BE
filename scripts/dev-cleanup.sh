#!/bin/bash

# Development Environment Cleanup Script for Nexus Gateway Service

set -e

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

# Stop and remove containers
stop_containers() {
    print_status "Stopping and removing containers..."
    docker-compose down --remove-orphans
    print_success "Containers stopped and removed"
}

# Remove volumes
remove_volumes() {
    print_status "Removing Docker volumes..."
    docker-compose down -v
    print_success "Volumes removed"
}

# Remove images
remove_images() {
    print_status "Removing Docker images..."
    docker-compose down --rmi all
    print_success "Images removed"
}

# Clean up build cache
clean_build_cache() {
    print_status "Cleaning Docker build cache..."
    docker builder prune -f
    print_success "Build cache cleaned"
}

# Clean up logs
clean_logs() {
    print_status "Cleaning log files..."
    rm -rf apps/gateway-svc/logs/*
    rm -rf docker/nginx/logs/*
    print_success "Log files cleaned"
}

# Full cleanup
full_cleanup() {
    print_warning "This will remove all containers, volumes, images, and data!"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        stop_containers
        remove_volumes
        remove_images
        clean_build_cache
        clean_logs
        print_success "Full cleanup completed"
    else
        print_status "Cleanup cancelled"
    fi
}

# Show help
show_help() {
    echo "Nexus Gateway Service Development Cleanup"
    echo "========================================"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  -h, --help      Show this help message"
    echo "  -s, --stop      Stop and remove containers only"
    echo "  -v, --volumes   Remove containers and volumes"
    echo "  -i, --images    Remove containers, volumes, and images"
    echo "  -f, --full      Full cleanup (containers, volumes, images, cache, logs)"
    echo "  -l, --logs      Clean log files only"
    echo ""
    echo "Examples:"
    echo "  $0 --stop       # Stop containers"
    echo "  $0 --full       # Complete cleanup"
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_help
        ;;
    -s|--stop)
        stop_containers
        ;;
    -v|--volumes)
        stop_containers
        remove_volumes
        ;;
    -i|--images)
        stop_containers
        remove_volumes
        remove_images
        ;;
    -f|--full)
        full_cleanup
        ;;
    -l|--logs)
        clean_logs
        ;;
    "")
        print_status "No option specified. Use --help for usage information."
        stop_containers
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac