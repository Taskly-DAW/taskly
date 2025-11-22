# app/usecases/auth_usecase.py
import uuid
from passlib.context import CryptContext
from typing import Optional
from app.domain.models import User, Role
from app.interfaces.user_repository import IUserRepository
from app.security.jwt_manager import create_access_token

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

class AuthUsecase:
    def __init__(self, user_repo: IUserRepository):
        self.user_repo = user_repo

    async def register(self, username: str, password: str, tenant_id: str, roles: list):
        existing = await self.user_repo.get_by_username_and_tenant(username, tenant_id)
        if existing:
            raise ValueError("username already exists for tenant")

        uid = str(uuid.uuid4())
        hashed = pwd_context.hash(password)
        user = User(id=uid, username=username, password_hash=hashed, tenant_id=tenant_id, roles=[Role(name=r) for r in roles])
        await self.user_repo.create_user(user)
        return user

    async def authenticate(self, username: str, password: str, tenant_id: str) -> Optional[User]:
        user = await self.user_repo.get_by_username_and_tenant(username, tenant_id)
        if not user:
            return None
        if not pwd_context.verify(password, user.password_hash):
            return None
        return user

    async def issue_token(self, user: User):
        claims = {
            "sub": user.id,
            "username": user.username,
            "tenant_id": user.tenant_id,
            "roles": [r.name for r in user.roles]
        }
        token = create_access_token(claims)
        return token
