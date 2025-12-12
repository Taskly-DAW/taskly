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
                    email=user.email,
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
            return User(id=u.id, username=u.username, email=u.email, tenant_id=u.tenant_id, roles=roles)

    async def get_by_email_and_tenant(self, email: str, tenant_id: str) -> Optional[User]:
        async with self._AsyncSession() as session:
            stmt = select(UserORM).where(
                UserORM.email == email, 
                UserORM.tenant_id == tenant_id
            ).options(selectinload(UserORM.roles))
            result = await session.execute(stmt)
            user_orm = result.scalar_one_or_none()
            if not user_orm:
                return None
            return User(
                id=str(user_orm.id),
                username=user_orm.username,
                email=user_orm.email,
                tenant_id=user_orm.tenant_id,
                roles=user_orm.roles
            )

    async def get_for_auth(self, email: str, tenant_id: str) -> Optional[User]:
        """Get user with password hash for authentication purposes"""
        async with self._AsyncSession() as session:
            stmt = select(UserORM).where(
                UserORM.email == email,
                UserORM.tenant_id == tenant_id
            ).options(selectinload(UserORM.roles))
            result = await session.execute(stmt)
            user_orm = result.scalar_one_or_none()
            if not user_orm:
                return None
            return User(
                id=str(user_orm.id),
                username=user_orm.username,
                email=user_orm.email,
                password_hash=user_orm.password_hash,
                tenant_id=user_orm.tenant_id,
                roles=user_orm.roles
            )

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
            return User(id=u.id, username=u.username, email=u.email, tenant_id=u.tenant_id, roles=roles)

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
                users.append(User(id=u.id, username=u.username, email=u.email, tenant_id=u.tenant_id, roles=roles))
            return users

    async def update_user(self, user: User) -> None:
        async with self._AsyncSession() as session:
            try:
                # Get the user with roles loaded
                stmt = select(UserORM).where(
                    UserORM.id == user.id,
                    UserORM.tenant_id == user.tenant_id
                ).options(selectinload(UserORM.roles))
                
                result = await session.execute(stmt)
                user_orm = result.scalar_one_or_none()

                if user_orm:
                    # Update basic fields
                    if user.username is not None:
                        user_orm.username = user.username
                    if user.email is not None:
                        user_orm.email = user.email
                        
                    # Handle roles
                    if user.roles is not None:
                        # Clear existing roles
                        user_orm.roles.clear()
                        
                        # Add new roles
                        for role in user.roles:
                            # Find or create role by name
                            role_stmt = select(RoleORM).where(RoleORM.name == role.name)
                            role_result = await session.execute(role_stmt)
                            role_orm = role_result.scalar_one_or_none()
                            
                            if not role_orm:
                                role_orm = RoleORM(name=role.name)
                                session.add(role_orm)
                                await session.flush()  # Get the ID for the new role
                            
                            user_orm.roles.append(role_orm)
                    
                    await session.commit()
                    
            except Exception as e:
                await session.rollback()
                raise e

    async def delete_user(self, user_id: str, tenant_id: str) -> bool:
        """Delete user by ID and tenant_id. Returns True if user was deleted, False if not found"""
        async with self._AsyncSession() as session:
            try:
                stmt = select(UserORM).where(
                    UserORM.id == user_id,
                    UserORM.tenant_id == tenant_id
                )
                result = await session.execute(stmt)
                user_orm = result.scalar_one_or_none()
                
                if not user_orm:
                    return False
                
                await session.delete(user_orm)
                await session.commit()
                return True
                
            except Exception as e:
                await session.rollback()
                raise e
