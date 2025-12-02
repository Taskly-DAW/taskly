# Tests for SQLAlchemy User Repository
import pytest
from app.infra.sqlalchemy_user_repository import SQLAlchemyUserRepository
from app.domain.models import User, Role

@pytest.mark.asyncio
class TestSQLAlchemyUserRepository:
    async def test_create_user(self, user_repository):
        """Test creating a user in the repository."""
        roles = [Role(name="user")]
        user = User(
            id="test-id-1",
            username="repo@example.com",
            password_hash="hashed_password",
            tenant_id="tenant_1",
            roles=roles
        )
        
        # Should not raise an exception
        await user_repository.create_user(user)
        
    async def test_get_by_username_and_tenant_existing(self, user_repository):
        """Test retrieving an existing user by username and tenant."""
        # Create user first
        roles = [Role(name="admin")]
        user = User(
            id="test-id-2",
            username="get@example.com",
            password_hash="hashed_password",
            tenant_id="tenant_1", 
            roles=roles
        )
        await user_repository.create_user(user)
        
        # Retrieve user
        retrieved_user = await user_repository.get_by_username_and_tenant("get@example.com", "tenant_1")
        
        assert retrieved_user is not None
        assert retrieved_user.username == "get@example.com"
        assert retrieved_user.tenant_id == "tenant_1"
        assert len(retrieved_user.roles) == 1
        assert retrieved_user.roles[0].name == "admin"
        
    async def test_get_by_username_and_tenant_nonexistent(self, user_repository):
        """Test retrieving a nonexistent user."""
        user = await user_repository.get_by_username_and_tenant("nonexistent@example.com", "tenant_1")
        
        assert user is None
        
    async def test_get_by_id_and_tenant_existing(self, user_repository):
        """Test retrieving an existing user by ID and tenant."""
        # Create user first
        roles = [Role(name="user"), Role(name="moderator")]
        user = User(
            id="test-id-3",
            username="getid@example.com",
            password_hash="hashed_password",
            tenant_id="tenant_2",
            roles=roles
        )
        await user_repository.create_user(user)
        
        # Retrieve user by ID
        retrieved_user = await user_repository.get_by_id_and_tenant("test-id-3", "tenant_2")
        
        assert retrieved_user is not None
        assert retrieved_user.id == "test-id-3"
        assert retrieved_user.username == "getid@example.com"
        assert retrieved_user.tenant_id == "tenant_2"
        assert len(retrieved_user.roles) == 2
        
    async def test_get_by_id_and_tenant_nonexistent(self, user_repository):
        """Test retrieving a nonexistent user by ID."""
        user = await user_repository.get_by_id_and_tenant("nonexistent-id", "tenant_1")
        
        assert user is None
        
    async def test_list_users_by_tenant(self, user_repository):
        """Test listing users by tenant."""
        # Create multiple users for same tenant
        tenant_id = "tenant_3"
        
        user1 = User(
            id="list-id-1",
            username="list1@example.com",
            password_hash="hashed1",
            tenant_id=tenant_id,
            roles=[Role(name="user")]
        )
        
        user2 = User(
            id="list-id-2", 
            username="list2@example.com",
            password_hash="hashed2",
            tenant_id=tenant_id,
            roles=[Role(name="admin")]
        )
        
        # Create user for different tenant (should not be included)
        user3 = User(
            id="list-id-3",
            username="list3@example.com", 
            password_hash="hashed3",
            tenant_id="different_tenant",
            roles=[Role(name="user")]
        )
        
        await user_repository.create_user(user1)
        await user_repository.create_user(user2)
        await user_repository.create_user(user3)
        
        # List users for tenant_3
        users = await user_repository.list_users_by_tenant(tenant_id)
        
        assert len(users) == 2
        usernames = [user.username for user in users]
        assert "list1@example.com" in usernames
        assert "list2@example.com" in usernames
        assert "list3@example.com" not in usernames
        
    async def test_create_user_with_multiple_roles(self, user_repository):
        """Test creating a user with multiple roles."""
        roles = [Role(name="user"), Role(name="admin"), Role(name="moderator")]
        user = User(
            id="multi-role-id",
            username="multirole@example.com",
            password_hash="hashed_password",
            tenant_id="tenant_1",
            roles=roles
        )
        
        await user_repository.create_user(user)
        
        # Retrieve and verify
        retrieved_user = await user_repository.get_by_username_and_tenant("multirole@example.com", "tenant_1")
        
        assert retrieved_user is not None
        assert len(retrieved_user.roles) == 3
        role_names = [role.name for role in retrieved_user.roles]
        assert "user" in role_names
        assert "admin" in role_names
        assert "moderator" in role_names