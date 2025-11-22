.PHONY: help build up down restart logs shell-auth shell-db clean test dev prod status health

# Default target
help:
	@echo "🚀 Taskly Backend - Available commands:"
	@echo ""
	@echo "📦 Container Management:"
	@echo "  build          - Build all services"
	@echo "  up             - Start all services"
	@echo "  down           - Stop all services"
	@echo "  restart        - Restart all services"
	@echo "  clean          - Remove containers, volumes and images"
	@echo ""
	@echo "🔍 Monitoring:"
	@echo "  logs           - Show logs from all services"
	@echo "  logs-auth      - Show auth service logs"
	@echo "  logs-db        - Show database logs"
	@echo "  logs-orchestrator - Show orchestrator logs"
	@echo "  status         - Show container status"
	@echo "  health         - Check service health"
	@echo "  test-api       - Test API endpoints"
	@echo ""
	@echo "🛠️ Development:"
	@echo "  shell-auth     - Open shell in auth service container"
	@echo "  shell-db       - Open psql shell in database"
	@echo "  dev            - Start development environment"
	@echo "  test           - Run tests"
	@echo "  test-coverage  - Run tests with coverage report"
	@echo ""
	@echo "🗄️ Database:"
	@echo "  db-migrate     - Run database migrations"
	@echo "  db-reset       - Reset database (WARNING: destroys data)"
	@echo "  db-backup      - Create database backup"
	@echo "  db-tables      - List all tables"
	@echo "  db-users       - Show users table"
	@echo "  db-roles       - Show roles table"
	@echo "  db-query       - Run custom SQL query"
	@echo ""

# Container Management
build:
	@echo "🏗️ Building all services..."
	docker-compose build

up:
	@echo "🚀 Starting all services..."
	docker-compose up -d

down:
	@echo "📦 Stopping all services..."
	docker-compose down

restart: down up
	@echo "🔄 Services restarted!"

clean:
	@echo "🧹 Cleaning up containers, volumes and images..."
	docker-compose down -v --remove-orphans
	docker system prune -f
	docker volume prune -f

# Monitoring
logs:
	@echo "📋 Showing logs from all services..."
	docker-compose logs -f

logs-auth:
	@echo "📋 Showing auth service logs..."
	docker-compose logs -f auth_service

logs-db:
	@echo "📋 Showing database logs..."
	docker-compose logs -f auth_db

logs-orchestrator:
	@echo "📋 Showing orchestrator logs..."
	docker-compose logs -f orchestrator

status:
	@echo "📊 Container status:"
	docker-compose ps

health:
	@echo "🔍 Checking service health..."
	@echo "Auth Service: http://localhost:8001/health"
	@if curl -s http://localhost:8001/health > /dev/null 2>&1; then \
		echo " ✅ Auth Service: Healthy"; \
		curl -s http://localhost:8001/health | python3 -m json.tool; \
	else \
		echo " ❌ Auth Service: Unhealthy"; \
	fi
	@echo ""
	@echo "Database:"
	@if docker-compose exec -T auth_db pg_isready -U taskly_user -d auth_service > /dev/null 2>&1; then \
		echo " ✅ Database: Healthy"; \
	else \
		echo " ❌ Database: Unhealthy"; \
	fi

# Development
shell-auth:
	@echo "🐚 Opening shell in auth service..."
	docker-compose exec auth_service /bin/bash

shell-db:
	@echo "🐚 Opening database shell..."
	docker-compose exec auth_db psql -U taskly_user -d auth_service

# Database queries
db-tables:
	@echo "📋 Listing database tables..."
	docker-compose exec auth_db psql -U taskly_user -d auth_service -c "\\dt"

db-users:
	@echo "👥 Users table content..."
	docker-compose exec auth_db psql -U taskly_user -d auth_service -c "SELECT id, username, tenant_id FROM users;"

db-roles:
	@echo "🔑 Roles table content..."
	docker-compose exec auth_db psql -U taskly_user -d auth_service -c "SELECT * FROM roles;"

db-query:
	@echo "💻 Run custom query (usage: make db-query SQL='SELECT * FROM users;')"
	docker-compose exec auth_db psql -U taskly_user -d auth_service -c "$(SQL)"

dev: build
	@echo "🛠️ Starting development environment..."
	docker-compose up -d
	@echo "📱 Services available at:"
	@echo "  - Auth Service: http://localhost:8001"
	@echo "  - Redpanda Console: http://localhost:8080"

test:
	@echo "🧪 Running tests..."
	docker-compose exec auth_service python -m pytest tests/ -v

test-coverage:
	@echo "📊 Running tests with coverage..."
	cd auth_service && python3 -m pytest --cov=app --cov-report=term-missing --cov-report=html
	@echo "📋 Coverage report generated in auth_service/htmlcov/"
	@echo "🌐 Open auth_service/htmlcov/index.html in your browser to view detailed coverage"

# Database Operations
db-migrate:
	@echo "🗄️ Running database migrations..."
	docker-compose exec auth_service alembic upgrade head

db-reset:
	@echo "⚠️ Resetting database (this will destroy all data)..."
	@read -p "Are you sure? Type 'yes' to continue: " confirm && [ "$$confirm" = "yes" ] || exit 1
	docker-compose down
	docker volume rm backend_postgres_data || true
	docker-compose up -d auth_db
	@sleep 10
	docker-compose up -d auth_service
	@echo "✅ Database reset complete!"

db-backup:
	@echo "💾 Creating database backup..."
	@mkdir -p backups
	docker-compose exec auth_db pg_dump -U taskly_user -d auth_service > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup created in backups/ directory"

# Utilities
fix-auth:
	@echo "🔧 Running authentication fix..."
	./fix-auth.sh

# Quick commands
quick-restart-auth:
	@echo "🔄 Quick restart auth service..."
	docker-compose restart auth_service

quick-restart-db:
	@echo "🔄 Quick restart database..."
	docker-compose restart auth_db

# Install development dependencies
install-dev:
	@echo "📦 Installing development dependencies..."
	docker-compose exec auth_service pip install pytest black flake8 isort

# Show service URLs
urls:
	@echo "🌐 Service URLs:"
	@echo "  📱 Auth Service API: http://localhost:8001"
	@echo "  📊 Auth Service Health: http://localhost:8001/health"
	@echo "  📋 Auth Service Docs: http://localhost:8001/docs"
	@echo "  🔄 Redpanda Console: http://localhost:9644"
	@echo "  🗄️ Database: localhost:5432 (internal only)"

