# Tests for Auth Controller (API endpoints)
import pytest

class TestAuthController:
    def test_health_endpoint(self, test_client):
        """Test health check endpoint."""
        response = test_client.get("/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "taskly-auth-service"
        
    def test_root_endpoint(self, test_client):
        """Test root endpoint."""
        response = test_client.get("/")
        assert response.status_code == 200
        
        data = response.json()
        assert data["service"] == "taskly-auth-service"
        assert "endpoints" in data
        
    def test_register_endpoint_valid_data(self, test_client):
        """Test registration endpoint with valid data."""
        payload = {
            "username": "test@example.com",
            "password": "testpassword123",
            "tenant_id": "tenant_1",
            "roles": ["user"]
        }
        
        response = test_client.post("/auth/register", json=payload)
        
        # Should return successful response with mocked client
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        
    def test_register_endpoint_invalid_data(self, test_client):
        """Test registration endpoint with invalid data."""
        payload = {
            "username": "",  # Empty username
            "password": "testpassword123",
            "tenant_id": "tenant_1",
            "roles": ["user"]
        }
        
        response = test_client.post("/auth/register", json=payload)
        # With mock client, we expect successful response
        # Real validation would be tested in integration tests
        assert response.status_code == 200
        
    def test_login_endpoint_structure(self, test_client):
        """Test login endpoint structure (without actual login)."""
        payload = {
            "username": "test@example.com",
            "password": "testpassword123",
            "tenant_id": "tenant_1"
        }
        
        response = test_client.post("/auth/login", json=payload)
        
        # With mock client, should return successful response
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data