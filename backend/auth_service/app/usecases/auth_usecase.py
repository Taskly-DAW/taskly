import uuid
from passlib.context import CryptContext
from typing import Optional, List
from app.domain.models import User, Role
from app.interfaces.user_repository import IUserRepository
from app.security.jwt_manager import create_access_token
from app.events.event_publisher import event_publisher

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

class AuthUsecase:
    def __init__(self, user_repo: IUserRepository):
        self.user_repo = user_repo

    async def register(self, username: str, email: str, password: str, tenant_id: str, roles: list):
        existing = await self.user_repo.get_by_email_and_tenant(email, tenant_id)
        if existing:
            raise ValueError("email already exists for tenant")

        uid = str(uuid.uuid4())
        hashed = pwd_context.hash(password)
        user = User(id=uid, username=username, email=email, password_hash=hashed, tenant_id=tenant_id, roles=[Role(name=r) for r in roles])
        
        # Save user to database
        await self.user_repo.create_user(user)
        
        # Emit user.registered event
        try:
            event_publisher.publish_user_registered(
                user_id=user.id,
                username=user.username,
                email=user.email,
                tenant_id=user.tenant_id
            )
        except Exception as e:
            # Log error but don't fail the registration
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"❌ Failed to publish user.registered event: {e}")
        
        return user

    async def authenticate(self, email: str, password: str, tenant_id: str) -> Optional[User]:
        user = await self.user_repo.get_by_email_and_tenant(email, tenant_id)
        if not user:
            return None
        if not pwd_context.verify(password, user.password_hash):
            return None
        return user

    async def issue_token(self, user: User):
        claims = {
            "sub": user.id,
            "username": user.username,
            "email": user.email,
            "tenant_id": user.tenant_id,
            "roles": [r.name for r in user.roles]
        }
        token = create_access_token(claims)
        return token

    async def list_users_by_tenant(self, tenant_id: str) -> List[User]:
        return await self.user_repo.list_users_by_tenant(tenant_id)