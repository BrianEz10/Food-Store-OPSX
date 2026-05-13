"""
Unit tests for auth service layer - no database required.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock
from datetime import datetime, timezone

# Import service to test
from app.modules.auth import service
from app.modules.auth.schemas import UserRegisterRequest, UserLoginRequest


class TestRegisterService:
    """Tests for register service function"""

    @pytest.mark.asyncio
    async def test_register_success(self):
        """Registro exitoso retorna UserResponse."""
        # Mock database session
        mock_db = AsyncMock()
        
        # Mock repository response
        mock_user = MagicMock()
        mock_user.id = 1
        mock_user.email = "new@example.com"
        mock_user.nombre = "New"
        mock_user.apellido = "User"
        
        # Setup mocks
        async def mock_get_user_by_email(db, email):
            return None  # No existing user
        
        async def mock_create_user(db, email, password_hash, nombre, apellido):
            return mock_user
        
        # Patch repository functions
        with pytest.mock.patch('app.modules.auth.service.repository.get_user_by_email', mock_get_user_by_email):
            with pytest.mock.patch('app.modules.auth.service.repository.create_user', mock_create_user):
                data = UserRegisterRequest(
                    email="new@example.com",
                    password="password123",
                    nombre="New",
                    apellido="User"
                )
                
                result = await service.register(mock_db, data)
                
                assert result.email == "new@example.com"
                assert result.nombre == "New"
                assert "CLIENT" in result.roles

    @pytest.mark.asyncio
    async def test_register_duplicate_email(self):
        """Registro con email duplicado raise HTTPException."""
        mock_db = AsyncMock()
        
        # Existing user
        mock_existing = MagicMock()
        
        async def mock_get_user_by_email(db, email):
            return mock_existing
        
        with pytest.mock.patch('app.modules.auth.service.repository.get_user_by_email', mock_get_user_by_email):
            data = UserRegisterRequest(
                email="existing@example.com",
                password="password123",
                nombre="Test",
                apellido="User"
            )
            
            from fastapi import HTTPException
            with pytest.raises(HTTPException) as exc:
                await service.register(mock_db, data)
            
            assert exc.value.status_code == 409
            assert "Email ya registrado" in exc.value.detail


class TestAuthenticateService:
    """Tests for authenticate service function"""

    @pytest.mark.asyncio
    async def test_authenticate_success(self):
        """Autenticación exitosa retorna usuario."""
        mock_db = AsyncMock()
        
        mock_user = MagicMock()
        mock_user.email = "test@example.com"
        mock_user.password_hash = "$2b$12$hashedpassword"  # bcrypt hash
        
        async def mock_get_user_by_email(db, email):
            return mock_user
        
        with pytest.mock.patch('app.modules.auth.service.repository.get_user_by_email', mock_get_user_by_email):
            with pytest.mock.patch('app.modules.auth.service.verify_password', return_value=True):
                data = UserLoginRequest(
                    email="test@example.com",
                    password="password123"
                )
                
                result = await service.authenticate(mock_db, data)
                
                assert result.email == "test@example.com"

    @pytest.mark.asyncio
    async def test_authenticate_wrong_password(self):
        """Autenticación con password incorrecto."""
        mock_db = AsyncMock()
        
        mock_user = MagicMock()
        mock_user.email = "test@example.com"
        mock_user.password_hash = "$2b$12$hashedpassword"
        
        async def mock_get_user_by_email(db, email):
            return mock_user
        
        with pytest.mock.patch('app.modules.auth.service.repository.get_user_by_email', mock_get_user_by_email):
            with pytest.mock.patch('app.modules.auth.service.verify_password', return_value=False):
                data = UserLoginRequest(
                    email="test@example.com",
                    password="wrongpassword"
                )
                
                from fastapi import HTTPException
                with pytest.raises(HTTPException) as exc:
                    await service.authenticate(mock_db, data)
                
                assert exc.value.status_code == 401
                assert "Credenciales inválidas" in exc.value.detail

    @pytest.mark.asyncio
    async def test_authenticate_user_not_found(self):
        """Autenticación con email inexistente."""
        mock_db = AsyncMock()
        
        async def mock_get_user_by_email(db, email):
            return None
        
        with pytest.mock.patch('app.modules.auth.service.repository.get_user_by_email', mock_get_user_by_email):
            data = UserLoginRequest(
                email="nonexistent@example.com",
                password="password123"
            )
            
            from fastapi import HTTPException
            with pytest.raises(HTTPException) as exc:
                await service.authenticate(mock_db, data)
            
            assert exc.value.status_code == 401


class TestPasswordValidation:
    """Tests for password strength validation"""

    def test_password_too_short(self):
        """Password menor a 8 caracteres es inválido."""
        from pydantic import ValidationError
        from app.modules.auth.schemas import UserRegisterRequest
        
        with pytest.raises(ValidationError):
            UserRegisterRequest(
                email="test@example.com",
                password="short",
                nombre="Test",
                apellido="User"
            )

    def test_password_valid_length(self):
        """Password de 8+ caracteres es válido."""
        from app.modules.auth.schemas import UserRegisterRequest
        
        user = UserRegisterRequest(
            email="test@example.com",
            password="password123",
            nombre="Test",
            apellido="User"
        )
        
        assert user.email == "test@example.com"
        assert user.password == "password123"


class TestTokenRefresh:
    """Tests for refresh token service"""

    @pytest.mark.asyncio
    async def test_refresh_invalid_token(self):
        """Refresh con token inválido."""
        mock_db = AsyncMock()
        
        async def mock_get_refresh_token(db, token_hash):
            return None
        
        with pytest.mock.patch('app.modules.auth.service.repository.get_refresh_token', mock_get_refresh_token):
            from fastapi import HTTPException
            with pytest.raises(HTTPException) as exc:
                await service.refresh_access_token(mock_db, "invalid-token")
            
            assert exc.value.status_code == 401

    @pytest.mark.asyncio
    async def test_refresh_expired_token(self):
        """Refresh con token expirado."""
        mock_db = AsyncMock()
        
        # Create expired token
        mock_token = MagicMock()
        mock_token.expires_at = datetime.now(timezone.utc)
        mock_token.revoked_at = None
        mock_token.usuario_id = 1
        
        async def mock_get_refresh_token(db, token_hash):
            return mock_token
        
        with pytest.mock.patch('app.modules.auth.service.repository.get_refresh_token', mock_get_refresh_token):
            from fastapi import HTTPException
            with pytest.raises(HTTPException) as exc:
                await service.refresh_access_token(mock_db, "expired-token")
            
            assert exc.value.status_code == 401


class TestLogoutService:
    """Tests for logout service"""

    @pytest.mark.asyncio
    async def test_logout_success(self):
        """Logout successful."""
        mock_db = AsyncMock()
        
        mock_token = MagicMock()
        mock_token.revoked_at = None
        
        async def mock_get_refresh_token(db, token_hash):
            return mock_token
        
        async def mock_mark_used(db, token_hash):
            pass
        
        with pytest.mock.patch('app.modules.auth.service.repository.get_refresh_token', mock_get_refresh_token):
            with pytest.mock.patch('app.modules.auth.service.repository.mark_refresh_token_used', mock_mark_used):
                # Should not raise
                await service.logout(mock_db, "some-token")