# Taskly Backend

Microservices backend for Taskly application with authentication service.

## 🚀 Quick Start

```bash
# Start development environment
make dev

# Check status
make status

# View logs
make logs-auth

# Open shell in auth service
make shell-auth
```

## 📦 Services

- **Auth Service**: Authentication and user management (Port: 8001)
- **PostgreSQL**: Database for auth service (Internal only)
- **Redpanda**: Event streaming platform (Port: 9092, Console: 9644)

## 🛠️ Development Commands

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
make health        # Check service health
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
├── auth_service/          # Authentication microservice
│   ├── app/              # Application code
│   ├── Dockerfile        # Container definition
│   ├── requirements.txt  # Python dependencies
│   └── requirements-dev.txt  # Development dependencies
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
┌─────────────────────────────────────────┐
│            taskly_network               │
│  ┌──────────┐ ┌─────────────┐ ┌────────┐│
│  │orchestrator│ │  redpanda   │ │  etc   ││
│  └──────────┘ └─────────────┘ └────────┘│
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
2. **Make changes** to code
3. **Test changes**: `make test`
4. **Check code quality**: `make lint`
5. **Format code**: `make format`
6. **Restart if needed**: `make restart`

## 🔗 Useful URLs

- **Auth Service API**: http://localhost:8001
- **Auth Service Health**: http://localhost:8001/health
- **Redpanda Console**: http://localhost:9644
- **Database**: Internal only (use `make shell-db`)