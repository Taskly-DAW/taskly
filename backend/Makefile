.PHONY: help build up down restart logs shell-auth shell-db shell-task clean test dev prod status health db-migrate-task

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
	@echo "  logs-gateway   - Show API gateway logs"
	@echo "  logs-auth      - Show auth service logs"
	@echo "  logs-task      - Show task service logs"
	@echo "  logs-db        - Show database logs"
	@echo "  logs-orchestrator - Show orchestrator logs"
	@echo "  status         - Show container status"
	@echo "  health         - Check service health"
	@echo "  test-api       - Test API endpoints via gateway"
	@echo ""
	@echo "🛠️ Development:"
	@echo "  shell-auth     - Open shell in auth service container"
	@echo "  shell-task     - Open shell in task service container"
	@echo "  shell-db       - Open psql shell in auth database"
	@echo "  shell-task-db  - Open psql shell in task database"
	@echo "  dev            - Start development environment"
	@echo "  test           - Run tests"
	@echo "  test-coverage  - Run tests with coverage report"
	@echo ""
	@echo "🗄️ Database:"
	@echo "  db-migrate-auth - Run auth service database migrations"
	@echo "  db-migrate-task - Run task service database migrations"
	@echo "  db-reset       - Reset database (WARNING: destroys data)"
	@echo "  db-backup      - Create database backup"
	@echo "  db-tables-auth - List all tables in auth_db"
	@echo "  db-tables-task - List all tables in task_db"
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

logs-gateway:
	@echo "📋 Showing API gateway logs..."
	docker-compose logs -f api_gateway

logs-auth:
	@echo "📋 Showing auth service logs..."
	docker-compose logs -f auth_service

logs-task:
	@echo "📋 Showing task service logs..."
	docker-compose logs -f task_service

logs-db:
	@echo "📋 Showing auth database logs..."
	docker-compose logs -f auth_db

logs-task-db:
	@echo "📋 Showing task database logs..."
	docker-compose logs -f task_db

logs-orchestrator:
	@echo "📋 Showing orchestrator logs..."
	docker-compose logs -f orchestrator

status:
	@echo "📊 Container status:"
	docker-compose ps

health:
	@echo "🔍 Checking service health..."
	@echo "API Gateway: http://localhost:8000/health"
	@if curl -s http://localhost:8000/health > /dev/null 2>&1; then \
		echo " ✅ API Gateway: Healthy"; \
		curl -s http://localhost:8000/health | python3 -m json.tool; \
	else \
		echo " ❌ API Gateway: Unhealthy"; \
	fi
	@echo ""
	@echo "Auth Service (via Gateway): http://localhost:8000/auth/health"
	@if curl -s http://localhost:8000/auth/health > /dev/null 2>&1; then \
		echo " ✅ Auth Service (via Gateway): Healthy"; \
	else \
		echo " ❌ Auth Service (via Gateway): Unhealthy"; \
	fi
	@echo ""
	@echo "Task Service: http://localhost:8002/health" # Assuming task service has a health endpoint on 8002
	@if curl -s http://localhost:8002/health > /dev/null 2>&1; then \
		echo " ✅ Task Service: Healthy"; \
	else \
		echo " ❌ Task Service: Unhealthy"; \
	fi
	@echo ""
	@echo "Auth Database:"
	@if docker-compose exec -T auth_db pg_isready -U taskly_user -d auth_service > /dev/null 2>&1; then \
		echo " ✅ Auth Database: Healthy"; \
	else \
		echo " ❌ Auth Database: Unhealthy"; \
	fi
	@echo ""
	@echo "Task Database:"
	@if docker-compose exec -T task_db pg_isready -U taskly_user -d task_service_db > /dev/null 2>&1; then \
		echo " ✅ Task Database: Healthy"; \
	else \
		echo " ❌ Task Database: Unhealthy"; \
	fi

# Development
shell-auth:
	@echo "🐚 Opening shell in auth service..."
	docker-compose exec auth_service /bin/bash

shell-task:
	@echo "🐚 Opening shell in task service..."
	docker-compose exec task_service /bin/bash

shell-db:
	@echo "🐚 Opening auth database shell..."
	docker-compose exec auth_db psql -U taskly_user -d auth_service

shell-task-db:
	@echo "🐚 Opening task database shell..."
	docker-compose exec task_db psql -U taskly_user -d task_service_db

# Database queries
db-tables-auth:
	@echo "📋 Listing auth database tables..."
	docker-compose exec auth_db psql -U taskly_user -d auth_service -c "\\dt"

db-tables-task:
	@echo "📋 Listing task database tables..."
	docker-compose exec task_db psql -U taskly_user -d task_service_db -c "\\dt"

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
	@echo "  - API Gateway: http://localhost:8000"
	@echo "  - Auth Service (via Gateway): http://localhost:8000/auth/"
	@echo "  - Task Service: http://localhost:8002"
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
db-migrate-auth:
	@echo "🗄️ Running auth service database migrations..."
	docker-compose exec auth_service alembic upgrade head

db-migrate-task:
	@echo "🗄️ Running task service database migrations..."
	docker-compose exec task_service alembic upgrade head

db-reset:
	@echo "⚠️ Resetting database (this will destroy all data)..."
	@read -p "Are you sure? Type 'yes' to continue: " confirm && [ "$$confirm" = "yes" ] || exit 1
	docker-compose down
	docker volume rm backend_postgres_data || true
	docker volume rm backend_postgres_data_task || true # Remove task service volume
	docker-compose up -d auth_db task_db
	@sleep 10
	docker-compose up -d auth_service task_service
	@echo "✅ Database reset complete!"

db-backup:
	@echo "💾 Creating database backup..."
	@mkdir -p backups
	docker-compose exec auth_db pg_dump -U taskly_user -d auth_service > backups/auth_backup_$(shell date +%Y%m%d_%H%M%S).sql
	docker-compose exec task_db pg_dump -U taskly_user -d task_service_db > backups/task_backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backups created in backups/ directory"

# Utilities
fix-auth:
	@echo "🔧 Running authentication fix..."
	./fix-auth.sh

# Quick commands
quick-restart-gateway:
	@echo "🔄 Quick restart API gateway..."
	docker-compose restart api_gateway

quick-restart-auth:
	@echo "🔄 Quick restart auth service..."
	docker-compose restart auth_service

quick-restart-task:
	@echo "🔄 Quick restart task service..."
	docker-compose restart task_service

quick-restart-db:
	@echo "🔄 Quick restart auth database..."
	docker-compose restart auth_db

quick-restart-task-db:
	@echo "🔄 Quick restart task database..."
	docker-compose restart task_db

# Install development dependencies
install-dev:
	@echo "📦 Installing development dependencies..."
	docker-compose exec auth_service pip install pytest black flake8 isort
	docker-compose exec task_service pip install pytest black flake8 isort # Install for task service too

# Show service URLs
urls:
	@echo "🌐 Service URLs:"
	@echo "  🌐 API Gateway: http://localhost:8000"
	@echo "  📱 Auth Service (via Gateway): http://localhost:8000/auth/"
	@echo "  📝 Task Service: http://localhost:8002"
	@echo "  📊 Gateway Health: http://localhost:8000/health"
	@echo "  📊 Auth Health (via Gateway): http://localhost:8000/auth/health"
	@echo "  📊 Task Health: http://localhost:8002/health"

# API Testing via Gateway
test-api:
	@echo "🧪 Testing API endpoints via Gateway..."
	@echo "🔍 Testing Gateway Health..."
	@curl -s http://localhost:8000/health | python3 -m json.tool || echo "❌ Gateway not responding"
	@echo ""
	@echo "🔍 Testing Auth Service via Gateway..."
	@curl -s http://localhost:8000/auth/health | python3 -m json.tool || echo "❌ Auth service not responding via gateway"
	@echo ""
	@echo "🔍 Testing Task Service..."
	@curl -s http://localhost:8002/health | python3 -m json.tool || echo "❌ Task service not responding"
	@echo ""
	@echo "🔍 Testing Auth Endpoints via Gateway..."
	@echo "📋 Available auth endpoints:"
	@echo "  POST /auth/auth/register - User registration"
	@echo "  POST /auth/auth/login - User login"
	@echo "  GET  /auth/auth/users - List users (authenticated)"
	@echo "  GET  /auth/health - Health check"
	@echo ""
	@echo "🔍 Testing Task Endpoints..."
	@echo "📋 Available task endpoints:"
	@echo "  POST /projects/ - Create a new project"
	@echo "  GET  /projects/ - List all projects"
	@echo "  GET  /projects/{project_id} - Get a project by ID"
	@echo "  PUT  /projects/{project_id} - Update a project by ID"
	@echo "  DELETE /projects/{project_id} - Delete a project by ID"
	@echo "  POST /tasks/ - Create a new task"
	@echo "  GET  /tasks/ - List all tasks"
	@echo "  GET  /tasks/{task_id} - Get a task by ID"
	@echo "  PUT  /tasks/{task_id} - Update a task by ID"
	@echo "  DELETE /tasks/{task_id} - Delete a task by ID"
	@echo ""
	@echo "🧪 Example registration test:"
	@echo 'curl -X POST "http://localhost:8000/auth/auth/register" \'
	@echo '  -H "Content-Type: application/json" \'
	@echo '  -d '"'"'{"username":"user@test.com","password":"pass123","tenant_id":"tenant_1"}'"'"''

# Build specific services
build-gateway:
	@echo "🏗️ Building API Gateway..."
	docker-compose build api_gateway

build-auth:
	@echo "🏗️ Building Auth Service..."
	docker-compose build auth_service

build-task:
	@echo "🏗️ Building Task Service..."
	docker-compose build task_service

build-orchestrator:
	@echo "🏗️ Building Orchestrator..."
	docker-compose build orchestrator
	@echo "  📋 Auth Service Docs: http://localhost:8001/docs"
	@echo "  📝 Task Service Docs: http://localhost:8002/docs"
	@echo "  🔄 Redpanda Console: http://localhost:9644"
	@echo "  🗄️ Databases: auth_db:5432, task_db:5432 (internal only)"
