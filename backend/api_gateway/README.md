# Taskly API Gateway

## 🌐 Overview

The API Gateway serves as the centralized entry point for all Taskly microservices. It provides:

- **Service Routing** - Routes requests to appropriate microservices
- **Security** - Centralized authentication and authorization
- **Load Balancing** - Distributes requests across service instances  
- **Monitoring** - Logs and tracks all API requests
- **Rate Limiting** - Protects services from abuse

## 🏗️ Architecture

```
Client Request → API Gateway → Microservice
```

### Service Routing:
- `/auth/*` → Auth Service
- `/notifications/*` → Notification Service
- `/health` → Gateway Health Check

## 🚀 Getting Started

### Build and Run:
```bash
# Build API Gateway
make build-gateway

# Start all services with gateway
make up

# Check gateway health
make health
```

### Endpoints:

#### Gateway Management:
- `GET /` - Gateway information
- `GET /health` - Health check

#### Auth Service (proxied):
- `POST /auth/register` - User registration
- `POST /auth/login` - User login  
- `GET /auth/users` - List users
- `GET /auth/health` - Auth service health

#### Notifications (proxied):
- `GET /notifications/*` - Notification endpoints

## 🔧 Configuration

The gateway is configured via:
- `config.py` - Service URLs, timeouts, security settings
- Environment variables in docker-compose.yml
- Internal Docker network communication

### Service Discovery:
```python
SERVICES = {
    "auth_service": {
        "url": "http://auth_service:8000",
        "health_endpoint": "/health", 
        "timeout": 30.0
    }
}
```

## 🔍 Monitoring

### Logs:
```bash
# Gateway logs
make logs-gateway

# All service logs
make logs
```

### Health Checks:
```bash
# Check all services via gateway
make health

# Test API endpoints
make test-api
```

## 🛡️ Security

The API Gateway provides:
- **Request Filtering** - Validates incoming requests
- **Header Management** - Manages security headers
- **CORS Handling** - Cross-origin resource sharing
- **Service Isolation** - Microservices not directly accessible

### Internal Network:
- Auth service not exposed externally
- Only accessible via API Gateway
- Secure inter-service communication

## 🚦 Request Flow

1. **Client Request** → API Gateway (port 8000)
2. **Route Analysis** → Determine target service
3. **Request Forward** → Internal service call
4. **Response Proxy** → Return to client

## 📊 Development

### Local Testing:
```bash
# Start development environment
make dev

# Test specific endpoints
curl http://localhost:8000/health
curl http://localhost:8000/auth/health

# Monitor real-time logs
make logs-gateway
```

### Service URLs:
- **Gateway:** http://localhost:8000
- **Auth (via Gateway):** http://localhost:8000/auth/
- **Docs:** http://localhost:8000/docs

## 🔗 Service Integration

To add a new service to the gateway:

1. **Add service to docker-compose.yml:**
```yaml
new_service:
  build: ./new_service
  networks:
    - taskly_network
```

2. **Update gateway config:**
```python
SERVICE_URLS["new_service"] = "http://new_service:8000"
```

3. **Add routing in main.py:**
```python
@app.api_route("/newservice/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def new_service_proxy(path: str, request: Request):
    return await forward_request("new_service", path, request, request.method)
```

## 🎯 Benefits

- **Single Entry Point** - Simplified client integration
- **Service Discovery** - Automatic routing to healthy instances
- **Security Layer** - Centralized authentication
- **Observability** - Unified logging and monitoring
- **Scalability** - Easy to add new services

The API Gateway ensures secure, efficient, and maintainable access to all Taskly microservices! 🚀