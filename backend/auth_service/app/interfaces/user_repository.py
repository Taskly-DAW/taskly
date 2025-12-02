# app/interfaces/user_repository.py
from abc import ABC, abstractmethod
from typing import Optional, List
from app.domain.models import User

class IUserRepository(ABC):
    @abstractmethod
    async def create_user(self, user: User) -> None:
        pass

    @abstractmethod
    async def get_by_username_and_tenant(self, username: str, tenant_id: str) -> Optional[User]:
        pass

    @abstractmethod
    async def get_by_id_and_tenant(self, user_id: str, tenant_id: str) -> Optional[User]:
        pass

    @abstractmethod
    async def list_users_by_tenant(self, tenant_id: str) -> List[User]:
        pass
