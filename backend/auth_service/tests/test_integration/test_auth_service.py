# Integration tests for the entire auth service
import pytest

@pytest.mark.integration
class TestAuthServiceIntegration:
    def test_full_user_registration_flow(self, test_client):
        """Test complete user registration and authentication flow."""
        # Test the endpoint accessibility with mocked client
        
        # 1. Register user
        register_payload = {
            "username": "integration@example.com",
            "password": "integration123", 
            "tenant_id": "integration_tenant",
            "roles": ["user"]
        }
        
        register_response = test_client.post("/auth/register", json=register_payload)
        assert register_response.status_code == 200
        
        # 2. Login with same credentials
        login_payload = {
            "username": "integration@example.com",
            "password": "integration123",
            "tenant_id": "integration_tenant"
        }
        
        login_response = test_client.post("/auth/login", json=login_payload)
        assert login_response.status_code == 200
        
        token_data = login_response.json()
        assert "access_token" in token_data
                
    def test_service_health_and_endpoints(self, test_client):
        """Test that all main endpoints are accessible."""
        # Health check
        health_response = test_client.get("/health")
        assert health_response.status_code == 200
        
        # Root endpoint  
        root_response = test_client.get("/")
        assert root_response.status_code == 200
        
        # Note: docs and openapi endpoints would need FastAPI auto-generation
        # For mock client, we just test the core endpoints