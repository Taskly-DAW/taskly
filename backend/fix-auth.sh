#!/bin/bash

echo "🔧 Fixing PostgreSQL authentication issue..."

# Stop containers
echo "📦 Stopping containers..."
docker-compose down

# Remove postgres volume to start fresh
echo "🗑️ Removing old postgres data..."
docker volume rm backend_postgres_data 2>/dev/null || true

# Build auth service
echo "🏗️ Building auth service..."
docker-compose build auth_service

# Start containers
echo "🚀 Starting containers..."
docker-compose up -d auth_db

# Wait for postgres to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Start auth service
echo "🔐 Starting auth service..."
docker-compose up -d auth_service

echo "✅ Done! Check logs with: docker-compose logs -f auth_service"