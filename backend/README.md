# Taskly Backend

Microservices backend for Taskly application with authentication service.

## Quick Start

```bash
# Start development environment
make dev

# Check status
make status

# Test API via Gateway
make test-api

# View logs
make logs-gateway    # API Gateway logs
make logs-auth       # Auth service logs

# Open interactive API documentation
open http://localhost:8000/auth/docs
```

## API Gateway

O API Gateway é o ponto de entrada centralizado para todos os microserviços:

- Roteamento Inteligente: Direciona requisições para serviços apropriados
- Segurança Centralizada: Auth service isolado da rede externa
- Monitoramento: Logs centralizados de todas as requisições
- Performance: Cache e load balancing para alta disponibilidade

### Roteamento:
- `/auth/*` → Auth Service
- `/projects/*` → Project Service
- `/tasks/*` → Task Service
- `/tenants/*` → Tenant Service
- `/health` → Gateway health check

### Estrutura da API

## Projetos

- POST /projects/ - Cria um novo projeto
- GET /projects/ - Lista todos os projetos
- GET /projects/{project_id} - Obtém detalhes de um projeto
- PUT /projects/{project_id} - Atualiza um projeto
- DELETE /projects/{project_id} - Remove um projeto
- GET /projects/{project_id}/tasks - Lista tarefas de um projeto

## Tarefas

- POST /tasks/ - Cria uma nova tarefa
- GET /tasks/ - Lista todas as tarefas
- GET /tasks/{task_id} - Obtém detalhes de uma tarefa
- PUT /tasks/{task_id} - Atualiza uma tarefa
- DELETE /tasks/{task_id} - Remove uma tarefa

## ulti-tenant

- GET /tenants/{tenant_id}/tasks - Lista tarefas de um tenant específico

## Serviços

- API REST: FastAPI (Porta: 8000)
- Banco de Dados: PostgreSQL
- ORM: SQLAlchemy
- Autenticação: JWT (a implementar)


## Services

- API Gateway: Centralized entry point for all microservices (Port: 8000)
- Auth Service: Authentication and user management (Internal only - via Gateway)
- PostgreSQL: Database for auth service (Internal only)
- Redpanda: Event streaming platform (Port: 9092, Console: 8080)
- Orchestrator: Event orchestration service (Internal only)

## Development Commands

### Basic Operations
```bash
make help          # Show all available commands
make build         # Build all services
make up            # Start all services
make down          # Stop all services
make restart       # Restart all services
make clean         # Clean up everything
```

### Monitoring
```bash
make status        # Show container status
make logs          # Show all logs
make logs-auth     # Show auth service logs
make logs-db       # Show database logs
make health        # Check service health via gateway
make urls          # Show service URLs
```

### Development
```bash
make dev           # Start development environment
make shell-auth    # Open shell in auth service
make shell-db      # Open database shell
make test          # Run tests
make lint          # Run linting
make format        # Format code
```

### Database Management
```bash
make db-migrate    # Run migrations
make db-backup     # Create backup
make db-reset      # Reset database (destroys data!)
```

### Utilities
```bash
make fix-auth      # Fix authentication issues
make install-dev   # Install development dependencies
```

## 🏭 Production

```bash
make prod-build    # Build for production
make prod-up       # Start production environment
make prod-down     # Stop production environment
```

## 📁 Project Structure

```
backend/
├── api_gateway/           # 🌐 API Gateway (Port 8000)
│   ├── main.py           # FastAPI gateway application
│   ├── config.py         # Gateway configuration
│   ├── Dockerfile        # Container definition
│   ├── requirements.txt  # Python dependencies
│   └── README.md         # Gateway documentation
├── auth_service/          # 🔐 Authentication microservice
│   ├── app/              # Application code
│   ├── Dockerfile        # Container definition
│   ├── requirements.txt  # Python dependencies
│   └── requirements-dev.txt  # Development dependencies
├── orchestrator/          # 🔄 Event orchestration service
│   ├── app.py            # Orchestrator application
│   ├── Dockerfile        # Container definition
│   └── requirements.txt  # Python dependencies
├── docker-compose.yml    # Development services
├── docker-compose.prod.yml  # Production overrides
├── Makefile             # Development commands
├── fix-auth.sh          # Authentication fix script
└── init-db.sh           # Database initialization
```

## 🔧 Configuration

### Environment Variables

Create `.env` file for local development:

```bash
# Database
DB_HOST=auth_db
DB_PORT=5432
DB_NAME=auth_service
DB_USER=taskly_user
DB_PASSWORD=your_password

# Application
DEBUG=true
LOG_LEVEL=DEBUG
```

### Network Architecture

```
Client → API Gateway (8000) → Internal Services

┌─────────────────────────────────────────┐
│            taskly_network               │
│  ┌──────────┐ ┌─────────────┐ ┌────────┐│
│  │orchestrator│ │  redpanda   │ │api_gate││
│  └──────────┘ └─────────────┘ └───┬────┘│
│        │              │           │     │
│        └──────────────┼───────────┘     │
│                   ┌───▼────┐            │
│                   │auth_srv│            │
└───────────────────┴───┬────┴────────────┘
                        │
┌───────────────────────▼─────────────────┐
│           auth_network (private)        │
│                   ┌────────┐            │
│                   │auth_db │            │
│                   └────────┘            │
└─────────────────────────────────────────┘
```

## 🐛 Troubleshooting

### Authentication Issues
```bash
make fix-auth      # Fixes common PostgreSQL auth issues
```

### Container Issues
```bash
make clean         # Remove all containers and volumes
make build         # Rebuild everything
make up            # Start fresh
```

### Database Issues
```bash
make db-reset      # Reset database (WARNING: destroys data)
make shell-db      # Investigate database directly
```

## 📝 Development Workflow

1. **Start development**: `make dev`
2. **Access API docs**: http://localhost:8000/auth/docs
3. **Test API endpoints**: `make test-api`
4. **Make changes** to code
5. **Test changes**: `make test`
6. **Monitor services**: `make health`
7. **View logs**: `make logs-gateway` or `make logs-auth`
8. **Restart if needed**: `make restart`

## 🧪 Testing API

### Via Browser:
1. Abra http://localhost:8000/auth/docs
2. Use a interface **Swagger UI** para testar endpoints
3. Explore a documentação interativa da API

### Via cURL:
```bash
# Health check
curl http://localhost:8000/health

# Register user
curl -X POST "http://localhost:8000/auth/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"user@test.com","password":"pass123","tenant_id":"tenant1"}'

# Login
curl -X POST "http://localhost:8000/auth/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"user@test.com","password":"pass123"}'
```

### Via Makefile:
```bash
make test-api          # Test all endpoints
make health            # Check service health
make test-orchestrator # Test event orchestration
```

## 🔗 Useful URLs

### 🌐 API Gateway (Main Entry Point)
- **API Gateway**: http://localhost:8000
- **Gateway Health**: http://localhost:8000/health
- **API Documentation**: http://localhost:8000/auth/docs

### 🔐 Auth Service (via Gateway)
- **Auth API**: http://localhost:8000/auth/
- **Auth Health**: http://localhost:8000/auth/health
- **Interactive Docs**: http://localhost:8000/auth/docs
- **OpenAPI Spec**: http://localhost:8000/auth/openapi.json

### 📊 Infrastructure
- **Redpanda Console**: http://localhost:8080
- **Database**: Internal only (use `make shell-db`)

### 📝 Available Endpoints
```bash
# Authentication
POST /auth/auth/register  # User registration
POST /auth/auth/login     # User login
GET  /auth/auth/users     # List users (authenticated)

# Health & Documentation
GET  /health              # Gateway health
GET  /auth/health         # Auth service health
GET  /auth/docs           # Interactive API documentation
```