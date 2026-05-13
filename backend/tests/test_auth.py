"""
Tests for auth endpoints: register, login, refresh, logout.
"""

import pytest
import pytest_asyncio
from httpx import AsyncClient


class TestRegister:
    """Tests for POST /api/v1/auth/register"""

    @pytest.mark.asyncio
    async def test_register_success(self, client: AsyncClient):
        """Registro exitoso con datos válidos."""
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "password123",
                "nombre": "New",
                "apellido": "User"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "newuser@example.com"
        assert data["nombre"] == "New"
        assert data["apellido"] == "User"
        assert "CLIENT" in data["roles"]

    @pytest.mark.asyncio
    async def test_register_duplicate_email(self, client: AsyncClient, registered_user):
        """Registro con email duplicado retorna 409."""
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "test@example.com",
                "password": "password123",
                "nombre": "Duplicate",
                "apellido": "User"
            }
        )
        assert response.status_code == 409
        assert "Email ya registrado" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_register_weak_password(self, client: AsyncClient):
        """Registro con password débil retorna 422."""
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "user@example.com",
                "password": "short",
                "nombre": "Test",
                "apellido": "User"
            }
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_register_invalid_email(self, client: AsyncClient):
        """Registro con email inválido retorna 422."""
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "not-an-email",
                "password": "password123",
                "nombre": "Test",
                "apellido": "User"
            }
        )
        assert response.status_code == 422


class TestLogin:
    """Tests for POST /api/v1/auth/login"""

    @pytest.mark.asyncio
    async def test_login_success(self, client: AsyncClient, registered_user):
        """Login exitoso retorna tokens."""
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "test@example.com",
                "password": "password123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
        assert "expires_in" in data

    @pytest.mark.asyncio
    async def test_login_wrong_password(self, client: AsyncClient, registered_user):
        """Login con password incorrecto retorna 401."""
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "test@example.com",
                "password": "wrongpassword"
            }
        )
        assert response.status_code == 401
        assert "Credenciales inválidas" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_login_nonexistent_email(self, client: AsyncClient):
        """Login con email inexistente retorna 401."""
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": "password123"
            }
        )
        assert response.status_code == 401
        assert "Credenciales inválidas" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_login_deleted_user(self, client: AsyncClient, db_session, registered_user):
        """Login con usuario eliminado retorna 401."""
        from datetime import datetime, timezone
        
        registered_user.eliminado_en = datetime.now(timezone.utc)
        await db_session.commit()
        
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "test@example.com",
                "password": "password123"
            }
        )
        assert response.status_code == 401


class TestRefresh:
    """Tests for POST /api/v1/auth/refresh"""

    @pytest.mark.asyncio
    async def test_refresh_success(self, client: AsyncClient, registered_user):
        """Refresh exitoso retorna nuevos tokens."""
        # First login
        login_response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "test@example.com",
                "password": "password123"
            }
        )
        refresh_token = login_response.json()["refresh_token"]
        
        # Then refresh
        response = await client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": refresh_token}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data

    @pytest.mark.asyncio
    async def test_refresh_expired_token(self, client: AsyncClient):
        """Refresh con token expirado retorna 401."""
        response = await client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": "expired-token"}
        )
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_refresh_revoked_token(self, client: AsyncClient, registered_user):
        """Refresh con token ya usado retorna 401."""
        # Login to get token
        login_response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "test@example.com",
                "password": "password123"
            }
        )
        refresh_token = login_response.json()["refresh_token"]
        
        # Logout to revoke
        await client.post(
            "/api/v1/auth/logout",
            json={"refresh_token": refresh_token}
        )
        
        # Try to refresh with revoked token
        response = await client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": refresh_token}
        )
        assert response.status_code == 401
        assert "inválido" in response.json()["detail"].lower() or "utilizado" in response.json()["detail"].lower()


class TestLogout:
    """Tests for POST /api/v1/auth/logout"""

    @pytest.mark.asyncio
    async def test_logout_success(self, client: AsyncClient, registered_user):
        """Logout exitoso."""
        # Login
        login_response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "test@example.com",
                "password": "password123"
            }
        )
        access_token = login_response.json()["access_token"]
        refresh_token = login_response.json()["refresh_token"]
        
        # Logout
        response = await client.post(
            "/api/v1/auth/logout",
            json={"refresh_token": refresh_token},
            headers={"Authorization": f"Bearer {access_token}"}
        )
        assert response.status_code == 200
        assert "cerrada" in response.json()["detail"].lower()

    @pytest.mark.asyncio
    async def test_logout_without_token(self, client: AsyncClient, registered_user):
        """Logout sin refresh token retorna 422."""
        # Login
        login_response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "test@example.com",
                "password": "password123"
            }
        )
        access_token = login_response.json()["access_token"]
        
        # Logout sin refresh token
        response = await client.post(
            "/api/v1/auth/logout",
            json={},
            headers={"Authorization": f"Bearer {access_token}"}
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_logout_without_auth(self, client: AsyncClient):
        """Logout sin autenticación retorna 401."""
        response = await client.post(
            "/api/v1/auth/logout",
            json={"refresh_token": "some-token"}
        )
        assert response.status_code == 401


class TestRateLimiting:
    """Tests for rate limiting on /login"""

    @pytest.mark.asyncio
    async def test_rate_limit_exceeded(self, client: AsyncClient, registered_user):
        """Después de 5 intentos fallidos, el 6to retorna 429."""
        # 5 intentos fallidos
        for _ in range(5):
            await client.post(
                "/api/v1/auth/login",
                json={
                    "email": "test@example.com",
                    "password": "wrongpassword"
                }
            )
        
        # 6to intento debe ser rate limited
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "test@example.com",
                "password": "wrongpassword"
            }
        )
        assert response.status_code == 429
        # El response puede tener Retry-After header
        # assert "Retry-After" in response.headers or "detail" in response.json()