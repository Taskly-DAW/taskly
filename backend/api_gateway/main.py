#!/usr/bin/env python3
"""
API Gateway for Taskly - Fixed Version
Centralized entry point for all microservices
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import httpx
import logging
from typing import Optional
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Service URLs - Internal network addresses
SERVICE_URLS = {
    "auth_service": "http://auth_service:8000",
    "notification_service": "http://notification_service:8000",
}

# Global HTTP client
http_client: Optional[httpx.AsyncClient] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle"""
    global http_client
    
    # Startup
    logger.info("🚀 Starting API Gateway...")
    http_client = httpx.AsyncClient(
        timeout=httpx.Timeout(30.0),
        limits=httpx.Limits(max_connections=100, max_keepalive_connections=20),
        follow_redirects=True
    )
    logger.info("✅ HTTP client initialized")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down API Gateway...")
    if http_client:
        await http_client.aclose()
    logger.info("✅ API Gateway shutdown complete")

# Initialize FastAPI app
app = FastAPI(
    title="Taskly API Gateway",
    description="Centralized API Gateway for Taskly microservices",
    version="1.0.0",
    lifespan=lifespan,
    docs_url=None,
    redoc_url=None,
    openapi_url=None
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "api_gateway",
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Taskly API Gateway",
        "version": "1.0.0",
        "endpoints": {
            "/auth/*": "Authentication service",
            "/notifications/*": "Notification service",
            "/health": "Health check",
            "/docs": "API documentation"
        }
    }

async def proxy_request(service_name: str, path: str, request: Request):
    """Proxy request to microservice"""
    
    if service_name not in SERVICE_URLS:
        raise HTTPException(404, f"Service '{service_name}' not found")
    
    # Build target URL
    service_url = SERVICE_URLS[service_name]
    target_url = f"{service_url}/{path}" if path else service_url
    
    # Prepare headers (exclude hop-by-hop headers)
    headers = {
        key: value for key, value in request.headers.items()
        if key.lower() not in {
            "host", "content-length", "connection", "upgrade",
            "proxy-connection", "te", "trailer", "transfer-encoding"
        }
    }
    
    try:
        # Get request body
        body = await request.body() if request.method in ["POST", "PUT", "PATCH"] else None
        
        logger.info(f"🔄 Proxying {request.method} {path} to {service_name}")
        
        # Make request to microservice
        upstream_response = await http_client.request(
            method=request.method,
            url=target_url,
            headers=headers,
            content=body,
            params=request.query_params
        )
        
        # Clean response headers
        response_headers = {
            key: value for key, value in upstream_response.headers.items()
            if key.lower() not in {
                "connection", "keep-alive", "proxy-authenticate",
                "proxy-authorization", "te", "trailers", "transfer-encoding", "upgrade"
            }
        }
        
        # Return response with original content type
        return Response(
            content=upstream_response.content,
            status_code=upstream_response.status_code,
            headers=dict(response_headers),
            media_type=upstream_response.headers.get("content-type")
        )
        
    except httpx.RequestError as e:
        logger.error(f"❌ Request error: {e}")
        raise HTTPException(503, f"Service '{service_name}' unavailable")
    except Exception as e:
        logger.error(f"❌ Proxy error: {e}")
        raise HTTPException(500, "Internal gateway error")

# Documentation routes (must be first due to FastAPI routing precedence)
@app.get("/openapi.json")
async def gateway_openapi(request: Request):
    """Route root openapi.json to auth service for docs functionality"""
    return await proxy_request("auth_service", "openapi.json", request)

# Auth service routes
@app.get("/auth/openapi.json")
async def auth_openapi(request: Request):
    """Auth service OpenAPI spec"""
    return await proxy_request("auth_service", "openapi.json", request)

@app.get("/auth/docs")
async def auth_docs(request: Request):
    """Auth service documentation page"""
    return await proxy_request("auth_service", "docs", request)

@app.api_route("/auth/docs/{path:path}", methods=["GET"])
async def auth_docs_assets(path: str, request: Request):
    """Auth service docs assets (CSS, JS, etc.)"""
    return await proxy_request("auth_service", f"docs/{path}", request)

# General auth service proxy
@app.api_route("/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def auth_proxy(path: str, request: Request):
    """Proxy requests to auth service"""
    return await proxy_request("auth_service", path, request)

# Notification service routes
@app.api_route("/notifications/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def notifications_proxy(path: str, request: Request):
    """Proxy requests to notification service"""
    return await proxy_request("notification_service", path, request)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)