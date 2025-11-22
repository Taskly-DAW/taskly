# Tests for Auth Use Case
import pytest
from app.usecases.auth_usecase import AuthUsecase
from app.domain.models import User, Role


@pytest.mark.asyncio
class TestAuthUsecase:
    async def test_register_new_user(self, auth_usecase):
        """Test registering a new user."""
        username = "test@example.com"
        password = "test_password"
        tenant_id = "tenant_1"
        roles = ["user"]
        
        user = await auth_usecase.register(username, password, tenant_id, roles)
        
        assert user is not None
        assert user.username == username
        assert user.tenant_id == tenant_id
        assert len(user.roles) == 1
        assert user.roles[0].name == "user"
        assert user.password_hash != password  # Should be hashed
        
    async def test_register_duplicate_user(self, auth_usecase):
        """Test registering a user that already exists."""
        username = "duplicate@example.com"
        password = "test_password"
        tenant_id = "tenant_1"
        roles = ["user"]
        
        # Register first user
        await auth_usecase.register(username, password, tenant_id, roles)
        
        # Try to register duplicate - should raise ValueError
        with pytest.raises(ValueError, match="username already exists for tenant"):
            await auth_usecase.register(username, password, tenant_id, roles)
            
    async def test_authenticate_valid_credentials(self, auth_usecase):
        """Test authentication with valid credentials."""
        username = "auth@example.com"
        password = "test_password"
        tenant_id = "tenant_1"
        roles = ["user"]
        
        # Register user first
        await auth_usecase.register(username, password, tenant_id, roles)
        
        # Authenticate
        user = await auth_usecase.authenticate(username, password, tenant_id)
        
        assert user is not None
        assert user.username == username
        assert user.tenant_id == tenant_id
        
    async def test_authenticate_invalid_password(self, auth_usecase):
        """Test authentication with invalid password."""
        username = "auth2@example.com"
        password = "test_password"
        wrong_password = "wrong_password"
        tenant_id = "tenant_1"
        roles = ["user"]
        
        # Register user first
        await auth_usecase.register(username, password, tenant_id, roles)
        
        # Try to authenticate with wrong password
        user = await auth_usecase.authenticate(username, wrong_password, tenant_id)
        
        assert user is None
        
    async def test_authenticate_nonexistent_user(self, auth_usecase):
        """Test authentication with nonexistent user."""
        user = await auth_usecase.authenticate("nonexistent@example.com", "password", "tenant_1")
        
        assert user is None
        
    async def test_issue_token(self, auth_usecase):
        """Test token generation."""
        # Create a user
        roles = [Role(name="user"), Role(name="admin")]
        user = User(
            id="test-id",
            username="token@example.com",
            password_hash="hashed",
            tenant_id="tenant_1",
            roles=roles
        )
        
        token = await auth_usecase.issue_token(user)
        
        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0