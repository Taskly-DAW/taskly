# app/controllers/auth_controller.py
from fastapi import APIRouter, Depends, HTTPException, Header
from app.usecases.auth_usecase import AuthUsecase
from app.usecases.dtos import RegisterDTO, LoginDTO, TokenResponse, UserInfoDTO, UpdateUserDTO
from app.domain.models import User
from app.security.jwt_manager import verify_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from app.infra.sqlalchemy_user_repository import SQLAlchemyUserRepository

router = APIRouter()
user_repo = SQLAlchemyUserRepository()
auth_uc = AuthUsecase(user_repo)
security = HTTPBearer()

async def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security), x_tenant_id: str = Header(...)):
    token = creds.credentials
    try:
        payload = verify_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail="invalid token")
    
    token_tenant = payload.get("tenant_id")
    if token_tenant != x_tenant_id:
        raise HTTPException(status_code=403, detail="token tenant mismatch")

    user_id = payload.get("sub")
    user = await user_repo.get_by_id_and_tenant(user_id, x_tenant_id)
    if not user:
        raise HTTPException(status_code=401, detail="user not found")
    return user

@router.post("/register", response_model=TokenResponse)
async def register(dto: RegisterDTO):
    try:
        user = await auth_uc.register(dto.username, dto.email, dto.password, dto.tenant_id, dto.roles)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    token = await auth_uc.issue_token(user)
    return {"access_token": token}

@router.post("/login", response_model=TokenResponse)
async def login(dto: LoginDTO):
    user = await auth_uc.authenticate(dto.email, dto.password, dto.tenant_id)
    if not user:
        raise HTTPException(status_code=401, detail="invalid credentials")
    token = await auth_uc.issue_token(user)
    return {"access_token": token}

@router.get("/users", response_model=List[UserInfoDTO])
async def list_users(x_tenant_id: str = Header(...), current_user: User = Depends(get_current_user)):
    users = await auth_uc.list_users_by_tenant(x_tenant_id)
    return [UserInfoDTO(id=u.id, username=u.username, email=u.email, tenant_id=u.tenant_id, roles=[r.name for r in u.roles]) for u in users]

@router.patch("/users/me", response_model=UserInfoDTO)
async def update_me(dto: UpdateUserDTO, current_user: User = Depends(get_current_user)):
    # If roles are being updated, check admin permissions
    if dto.roles is not None and not any(role.name == "admin" for role in current_user.roles):
        raise HTTPException(status_code=403, detail="Only admins can update roles")
        
    updated_user = await auth_uc.update_user(current_user.id, current_user.tenant_id, dto)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return UserInfoDTO(
        id=updated_user.id,
        username=updated_user.username,
        email=updated_user.email,
        tenant_id=updated_user.tenant_id,
        roles=[r.name for r in updated_user.roles]
    )

@router.patch("/users/{user_id}", response_model=UserInfoDTO)
async def update_user_endpoint(
    user_id: str,
    dto: UpdateUserDTO,
    current_user: User = Depends(get_current_user)
):
    """
    Update user information (admin only).
    
    - **user_id**: ID of the user to update
    - **username**: New username (optional)
    - **email**: New email (optional)
    - **roles**: List of role names (optional, admin only)
    """
    # Only allow admins to update other users
    if user_id != current_user.id and not any(role.name == "admin" for role in current_user.roles):
        raise HTTPException(
            status_code=403,
            detail="Only admins can update other users"
        )
    
    # Regular users can only update their own information (not roles)
    if user_id == current_user.id and dto.roles is not None and not any(role.name == "admin" for role in current_user.roles):
        raise HTTPException(
            status_code=403,
            detail="Only admins can update roles"
        )
    
    # Get the target user (using the same tenant as the current user for security)
    updated_user = await auth_uc.update_user(user_id, current_user.tenant_id, dto)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return UserInfoDTO(
        id=updated_user.id,
        username=updated_user.username,
        email=updated_user.email,
        tenant_id=updated_user.tenant_id,
        roles=[r.name for r in updated_user.roles]
    )
