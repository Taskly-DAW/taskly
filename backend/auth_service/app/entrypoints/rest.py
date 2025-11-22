# app/entrypoints/rest.py
from fastapi import FastAPI, Depends, Header, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.controllers.auth_controller import router as auth_router
from app.security.jwt_manager import verify_token
from app.infra.db import init_db, sync_engine
from app.interfaces.user_repository import IUserRepository
from app.infra.sqlalchemy_user_repository import SQLAlchemyUserRepository
from typing import List
from sqlalchemy import text

app = FastAPI(title="AuthService - Clean Architecture Example")
app.include_router(auth_router, prefix="/auth")

@app.get("/")
async def root():
    """Root endpoint with service information"""
    return {
        "service": "taskly-auth-service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "auth": "/auth",
            "docs": "/docs",
            "openapi": "/openapi.json"
        }
    }

security = HTTPBearer()
user_repo = SQLAlchemyUserRepository()

async def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security), x_tenant_id: str = Header(...)):
    token = creds.credentials
    try:
        payload = verify_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail="invalid token")
    # check tenant
    token_tenant = payload.get("tenant_id")
    if token_tenant != x_tenant_id:
        raise HTTPException(status_code=403, detail="token tenant mismatch")
    user_id = payload.get("sub")
    user = await user_repo.get_by_id_and_tenant(user_id, x_tenant_id)
    if not user:
        raise HTTPException(status_code=401, detail="user not found")
    return user

def rbac_required(allowed_roles: List[str]):
    async def checker(user = Depends(get_current_user)):
        user_roles = [r.name for r in user.roles]
        if not any(r in allowed_roles for r in user_roles):
            raise HTTPException(status_code=403, detail="forbidden")
        return user
    return checker

@app.on_event("startup")
async def startup():
    # create sqlite tables
    init_db()

# exemplo de rota protegida
@app.get("/admin-only")
async def admin_only(user = Depends(rbac_required(["admin"])), x_tenant_id: str = Header(...)):
    return {"msg": f"ok tenant {x_tenant_id}, user {user.username}"}

@app.get("/me")
async def me(user = Depends(get_current_user)):
    return {"id": user.id, "username": user.username, "roles": [r.name for r in user.roles], "tenant_id": user.tenant_id}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check database connection
        with sync_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        
        return {
            "status": "healthy",
            "service": "taskly-auth-service",
            "version": "1.0.0",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "taskly-auth-service",
            "version": "1.0.0",
            "database": "disconnected",
            "error": str(e)
        }
