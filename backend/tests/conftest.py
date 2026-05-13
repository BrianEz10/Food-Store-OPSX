"""
Pytest configuration and fixtures for async testing.
"""

import asyncio
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlmodel import SQLModel


# Test database URL (use in-memory SQLite for tests)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

# Engine for tests
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
)

TestSessionLocal = async_sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


async def override_get_session():
    """Override for get_session dependency."""
    async with TestSessionLocal() as session:
        yield session


@pytest_asyncio.fixture
async def db_session():
    """Create a database session for tests."""
    # Import ALL models to register them with SQLModel.metadata
    # This is critical for SQLAlchemy to resolve relationships
    from app.modules.usuarios.model import Usuario, Rol, UsuarioRol
    from app.modules.refreshtokens.model import RefreshToken
    from app.modules.direcciones.model import DireccionEntrega
    from app.modules.ingredientes.model import Ingrediente
    from app.modules.productos.model import (
        Producto, ProductoCategoria, ProductoIngrediente
    )
    from app.modules.categorias.model import Categoria
    from app.modules.pedidos.model import (
        Pedido, DetallePedido, HistorialEstadoPedido, EstadoPedido
    )
    from app.modules.pagos.model import Pago, FormaPago
    
    async with test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    
    async with TestSessionLocal() as session:
        # Create default role
        role = Rol(codigo="CLIENT", descripcion="Cliente")
        session.add(role)
        await session.commit()
        
        yield session
    
    async with test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)


# Create test app
@pytest_asyncio.fixture
async def client(db_session):
    """Create test client with database override."""
    from fastapi import FastAPI
    from app.modules.auth.router import router as auth_router
    from app.core.dependencies import get_current_user
    from app.core.database import get_session
    
    # Create test app
    test_app = FastAPI(title="Food Store Test")
    
    # Override dependencies
    test_app.dependency_overrides[get_session] = override_get_session
    
    # Include auth router
    test_app.include_router(auth_router, prefix="/api/v1/auth")
    
    transport = ASGITransport(app=test_app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    
    test_app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def registered_user(db_session):
    """Create a pre-registered user for testing."""
    from app.core.security import hash_password
    
    user = Usuario(
        email="test@example.com",
        password_hash=hash_password("password123"),
        nombre="Test",
        apellido="User"
    )
    db_session.add(user)
    await db_session.flush()
    
    # Add CLIENT role
    usuario_rol = UsuarioRol(usuario_id=user.id, rol_codigo="CLIENT")
    db_session.add(usuario_rol)
    await db_session.commit()
    await db_session.refresh(user)
    
    return user