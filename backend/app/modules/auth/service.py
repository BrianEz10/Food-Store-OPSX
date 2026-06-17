import secrets
import hashlib
from datetime import datetime, timedelta, timezone
from fastapi import Response
from sqlmodel import Session, select
from app.modules.usuarios.models import Usuario
from app.modules.auth.schemas import LoginRequest, RegisterRequest, TokenResponse
from app.modules.auth.refresh_models import RefreshToken
from app.modules.usuarios.rol_associations import UsuarioRol
from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import settings
from app.core.errors import http_error


class AuthService:
    def __init__(self, session: Session) -> None:
        self._session = session
        self._refresh_expire_days = settings.REFRESH_TOKEN_EXPIRE_DAYS

    def _utcnow(self) -> datetime:
        return datetime.now(timezone.utc)

    def _hash_token(self, token_str: str) -> str:
        return hashlib.sha256(token_str.encode()).hexdigest()

    def _create_refresh_token(self, usuario_id: int) -> str:
        token_str = secrets.token_urlsafe(32)
        token_hash = self._hash_token(token_str)
        obj = RefreshToken(usuario_id=usuario_id, token_hash=token_hash, expires_at=self._utcnow() + timedelta(days=self._refresh_expire_days))
        self._session.add(obj)
        return token_str

    def _set_auth_cookies(self, response: Response, access_token: str, refresh_token: str) -> None:
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            samesite="lax",
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            max_age=self._refresh_expire_days * 24 * 60 * 60,
            samesite="lax",
        )

    def create_token(self, user: Usuario) -> str:
        roles = [rol.codigo for rol in user.roles]
        return create_access_token({"sub": user.email, "roles": roles, "usuario_id": user.id})

    def register(self, data: RegisterRequest, response: Response) -> TokenResponse:
        existing = self._session.exec(
            select(Usuario).where(Usuario.email == data.email, Usuario.deleted_at == None)
        ).first()
        if existing:
            raise http_error(409, "Este email ya fue registrado", "ALREADY_EXISTS", "email")
        hashed = hash_password(data.password)
        user = Usuario(
            email=data.email,
            nombre=data.nombre,
            apellido=data.apellido,
            celular=data.celular,
            hashed_password=hashed,
        )
        self._session.add(user)
        self._session.flush()
        link = UsuarioRol(usuario_id=user.id, rol_codigo="CLIENT")
        self._session.add(link)
        refresh_token_str = self._create_refresh_token(user.id)
        access_token = self.create_token(user)
        self._session.commit()
        self._set_auth_cookies(response, access_token, refresh_token_str)
        expires_in = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token_str,
            expires_in=expires_in,
        )

    def login(self, data: LoginRequest, response: Response) -> TokenResponse:
        user = self._session.exec(
            select(Usuario).where(Usuario.email == data.email, Usuario.deleted_at == None)
        ).first()
        if not user or not verify_password(data.password, user.hashed_password):
            raise http_error(401, "Credenciales invalidas", "INVALID_CREDENTIALS")
        refresh_token_str = self._create_refresh_token(user.id)
        access_token = self.create_token(user)
        self._session.commit()
        self._set_auth_cookies(response, access_token, refresh_token_str)
        expires_in = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token_str,
            expires_in=expires_in,
        )

    def refresh(self, refresh_token_str: str, response: Response) -> dict:
        token_hash = self._hash_token(refresh_token_str)
        token = self._session.exec(
            select(RefreshToken).where(
                RefreshToken.token_hash == token_hash,
                RefreshToken.deleted_at == None
            )
        ).first()

        now_utc = self._utcnow()

        if not token:
            raise http_error(401, "Refresh token invalido o expirado", "INVALID_CREDENTIALS")

        expires_at = token.expires_at
        if expires_at is not None and expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        if expires_at < now_utc or token.revoked_at is not None:
            raise http_error(401, "Refresh token invalido o expirado", "INVALID_CREDENTIALS")

        token.revoked_at = now_utc
        new_refresh_str = self._create_refresh_token(token.usuario_id)
        user = self._session.get(Usuario, token.usuario_id)
        if not user or user.deleted_at is not None:
            raise http_error(401, "Usuario no encontrado", "UNAUTHORIZED")
        access_token = self.create_token(user)
        self._session.commit()
        self._set_auth_cookies(response, access_token, new_refresh_str)
        expires_in = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token_str,
            expires_in=expires_in,
        )

    def logout(self, refresh_token_str: str, response: Response) -> None:
        if refresh_token_str:
            token_hash = self._hash_token(refresh_token_str)
            token = self._session.exec(
                select(RefreshToken).where(
                    RefreshToken.token_hash == token_hash,
                    RefreshToken.deleted_at == None
                )
            ).first()
            if token:
                token.revoked_at = self._utcnow()
                self._session.commit()
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
