# app/infra/sqlalchemy_user_repository.py
import uuid
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.interfaces.user_repository import IUserRepository
from app.domain.models import User, Role
from app.infra.db import AsyncSessionLocal, UserORM, RoleORM

class SQLAlchemyUserRepository(IUserRepository):
    def __init__(self):
        self._AsyncSession = AsyncSessionLocal

    async def create_user(self, user: User) -> None:
        async with self._AsyncSession() as session:
            try:
                # ensure roles exist
                role_objs = []
                for r in user.roles:
                    stmt = select(RoleORM).where(RoleORM.name == r.name)
                    result = await session.execute(stmt)
                    role = result.scalar_one_or_none()
                    if not role:
                        role = RoleORM(name=r.name)
                        session.add(role)
                    role_objs.append(role)

                user_orm = UserORM(
                    id=user.id,
                    username=user.username,
                    password_hash=user.password_hash,
                    tenant_id=user.tenant_id,
                    roles=role_objs
                )
                session.add(user_orm)
                await session.commit()
            except Exception:
                await session.rollback()
                raise

    async def get_by_username_and_tenant(self, username: str, tenant_id: str) -> Optional[User]:
        async with self._AsyncSession() as session:
            stmt = select(UserORM).options(selectinload(UserORM.roles)).where(
                UserORM.username == username, 
                UserORM.tenant_id == tenant_id
            )
            result = await session.execute(stmt)
            u = result.scalar_one_or_none()
            if not u:
                return None
            roles = [Role(name=r.name) for r in u.roles]
            return User(id=u.id, username=u.username, password_hash=u.password_hash, tenant_id=u.tenant_id, roles=roles)

    async def get_by_id_and_tenant(self, user_id: str, tenant_id: str) -> Optional[User]:
        async with self._AsyncSession() as session:
            stmt = select(UserORM).options(selectinload(UserORM.roles)).where(
                UserORM.id == user_id, 
                UserORM.tenant_id == tenant_id
            )
            result = await session.execute(stmt)
            u = result.scalar_one_or_none()
            if not u:
                return None
            roles = [Role(name=r.name) for r in u.roles]
            return User(id=u.id, username=u.username, password_hash=u.password_hash, tenant_id=u.tenant_id, roles=roles)

    async def list_users_by_tenant(self, tenant_id: str) -> List[User]:
        async with self._AsyncSession() as session:
            stmt = select(UserORM).options(selectinload(UserORM.roles)).where(
                UserORM.tenant_id == tenant_id
            )
            result = await session.execute(stmt)
            rows = result.scalars().all()
            users = []
            for u in rows:
                roles = [Role(name=r.name) for r in u.roles]
                users.append(User(id=u.id, username=u.username, password_hash=u.password_hash, tenant_id=u.tenant_id, roles=roles))
            return users
