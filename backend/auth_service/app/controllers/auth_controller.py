# app/controllers/auth_controller.py
from fastapi import APIRouter, Depends, HTTPException, Header
from app.usecases.auth_usecase import AuthUsecase
from app.usecases.dtos import RegisterDTO, LoginDTO, TokenResponse
from app.infra.sqlalchemy_user_repository import SQLAlchemyUserRepository

router = APIRouter()
user_repo = SQLAlchemyUserRepository()
auth_uc = AuthUsecase(user_repo)

@router.post("/register", response_model=TokenResponse)
async def register(dto: RegisterDTO):
    try:
        user = await auth_uc.register(dto.username, dto.password, dto.tenant_id, dto.roles)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    token = await auth_uc.issue_token(user)
    return {"access_token": token}

@router.post("/login", response_model=TokenResponse)
async def login(dto: LoginDTO):
    user = await auth_uc.authenticate(dto.username, dto.password, dto.tenant_id)
    if not user:
        raise HTTPException(status_code=401, detail="invalid credentials")
    token = await auth_uc.issue_token(user)
    return {"access_token": token}
