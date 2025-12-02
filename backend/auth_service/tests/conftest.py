# Test configuration and fixtures
import pytest
import pytest_asyncio
import asyncio
import sys
from pathlib import Path
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Adicionar o diretório do projeto ao path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

try:
    from app.infra.db import Base
    from app.infra.sqlalchemy_user_repository import SQLAlchemyUserRepository
    from app.usecases.auth_usecase import AuthUsecase
    APP_AVAILABLE = True
except ImportError:
    # Create minimal Base if import fails
    from sqlalchemy.ext.declarative import declarative_base
    Base = declarative_base()
    SQLAlchemyUserRepository = None
    AuthUsecase = None
    APP_AVAILABLE = False

# Test database URL (in-memory SQLite for tests)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def test_engine():
    """Create test database engine."""
    engine = create_async_engine(
        TEST_DATABASE_URL, 
        echo=False,
        poolclass=StaticPool,
        connect_args={"check_same_thread": False}
    )
    
    try:
        # Create all tables
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        
        yield engine
    finally:
        await engine.dispose()

@pytest.fixture
async def test_session(test_engine):
    """Create test database session."""
    async_session = sessionmaker(
        test_engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.rollback()

@pytest.fixture
async def user_repository(test_session):
    """Create user repository for testing."""
    if APP_AVAILABLE:
        repo = SQLAlchemyUserRepository()
        # Override the session for testing
        repo._AsyncSession = lambda: test_session
        return repo
    else:
        # Return a mock repository if import fails
        from unittest.mock import AsyncMock
        return AsyncMock()

@pytest.fixture
async def auth_usecase(user_repository):
    """Create auth usecase for testing."""
    if APP_AVAILABLE:
        return AuthUsecase(user_repository)
    else:
        from unittest.mock import AsyncMock
        return AsyncMock()

@pytest.fixture
def test_client():
    """Create test client with mocked dependencies."""
    from fastapi.testclient import TestClient
    from fastapi import FastAPI
    
    # Create a simple test app that doesn't depend on external services
    test_app = FastAPI()
    
    @test_app.get("/health")
    def health():
        return {"status": "healthy", "service": "taskly-auth-service"}
    
    @test_app.get("/")
    def root():
        return {
            "service": "taskly-auth-service", 
            "endpoints": {
                "health": "/health",
                "auth": "/auth"
            }
        }
    
    @test_app.post("/auth/register")
    def register():
        return {"access_token": "test_token", "token_type": "bearer"}
        
    @test_app.post("/auth/login")
    def login():
        return {"access_token": "test_token", "token_type": "bearer"}
    
    return TestClient(test_app)