# API Gateway Configuration

# Service discovery
SERVICES = {
    "auth_service": {
        "url": "http://auth_service:8000",
        "health_endpoint": "/health",
        "timeout": 30.0
    },
    "notification_service": {
        "url": "http://notification_service:8000", 
        "health_endpoint": "/health",
        "timeout": 30.0
    }
}

# Rate limiting (requests per minute)
RATE_LIMITS = {
    "default": 1000,
    "auth": 500
}

# Security
JWT_SECRET_KEY = "your-secret-key-here"  # Change in production
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 30

# CORS settings
CORS_ORIGINS = ["*"]  # Configure for production
CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"]
CORS_HEADERS = ["*"]