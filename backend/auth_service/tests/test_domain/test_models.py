# Tests for User domain model
import pytest
from app.domain.models import User, Role

class TestUser:
    def test_user_creation(self):
        """Test user creation with basic attributes."""
        roles = [Role(name="user"), Role(name="admin")]
        user = User(
            id="test-id",
            username="test@example.com",
            password_hash="hashed_password",
            tenant_id="tenant_1",
            roles=roles
        )
        
        assert user.id == "test-id"
        assert user.username == "test@example.com"
        assert user.password_hash == "hashed_password"
        assert user.tenant_id == "tenant_1"
        assert len(user.roles) == 2
        assert "user" in [role.name for role in user.roles]
        assert "admin" in [role.name for role in user.roles]

class TestRole:
    def test_role_creation(self):
        """Test role creation."""
        role = Role(name="admin")
        
        assert role.name == "admin"
        
    def test_role_equality(self):
        """Test role equality comparison."""
        role1 = Role(name="admin")
        role2 = Role(name="admin")
        role3 = Role(name="user")
        
        assert role1.name == role2.name
        assert role1.name != role3.name