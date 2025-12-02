# app/infra/db.py
import os
from sqlalchemy import (
    create_engine, MetaData, Table, Column, String, ForeignKey, JSON, select
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import registry, relationship
from sqlalchemy import Integer
from sqlalchemy.sql import func
from sqlalchemy import Text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# PostgreSQL configuration
DB_USER = os.getenv("DB_USER", "taskly_user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "taskly_password")
DB_HOST = os.getenv("DB_HOST", "auth_db")  # Updated to match service name
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "auth_service")

# Async PostgreSQL URL
DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Sync PostgreSQL URL for migrations
SYNC_DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Async engine
async_engine = create_async_engine(DATABASE_URL, echo=True)

# Sync engine for migrations
sync_engine = create_engine(SYNC_DATABASE_URL)

# Async session
AsyncSessionLocal = sessionmaker(
    async_engine, class_=AsyncSession, expire_on_commit=False
)

# Sync session (for migrations)
from sqlalchemy.orm import sessionmaker as sync_sessionmaker
SessionLocal = sync_sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)

Base = declarative_base()

from sqlalchemy import Table, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", String, ForeignKey("users.id"), primary_key=True),
    Column("role_name", String, ForeignKey("roles.name"), primary_key=True),
)

class UserORM(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    username = Column(String, index=True)
    password_hash = Column(String)
    tenant_id = Column(String, index=True)
    roles = relationship("RoleORM", secondary=user_roles, back_populates="users")

class RoleORM(Base):
    __tablename__ = "roles"
    name = Column(String, primary_key=True, index=True)
    users = relationship("UserORM", secondary=user_roles, back_populates="roles")

def init_db():
    """Initialize database tables using sync engine"""
    Base.metadata.create_all(bind=sync_engine)

async def get_async_session():
    """Get async database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
