"""
Food Store API — Punto de entrada de la aplicación FastAPI.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers
from app.core.rate_limit import limiter

settings = get_settings()


# ── Rate Limiter ─────────────────────────────────────────────────────
# Importado desde app.core.rate_limit


# ── Lifespan ─────────────────────────────────────────────────────────


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup y shutdown hooks."""
    # Startup: importar modelos para que SQLModel los registre
    import app.modules.categorias.model  # noqa: F401
    import app.modules.direcciones.model  # noqa: F401
    import app.modules.pagos.model  # noqa: F401
    import app.modules.pedidos.model  # noqa: F401
    import app.modules.productos.model  # noqa: F401
    import app.modules.refreshtokens.model  # noqa: F401
    import app.modules.usuarios.model  # noqa: F401
    import app.modules.ingredientes.model  # noqa: F401

    yield
    # Shutdown


# ── App ──────────────────────────────────────────────────────────────

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API del sistema de e-commerce Food Store",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers RFC 7807
register_exception_handlers(app)


# ── Routers ──────────────────────────────────────────────────────────

from app.modules.auth.router import router as auth_router
from app.modules.categorias.router import router as categorias_router
from app.modules.direcciones.router import router as direcciones_router
from app.modules.ingredientes.router import router as ingredientes_router
from app.modules.productos.router import router as productos_router
from app.modules.usuarios.router import router as usuarios_router
from app.modules.pedidos.router import router as pedidos_router
from app.modules.pagos.router import router as pagos_router
from app.modules.admin.router import router as admin_router

app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(categorias_router, prefix="/api/v1/categorias")
app.include_router(direcciones_router, prefix="/api/v1")
app.include_router(ingredientes_router, prefix="/api/v1/ingredientes")
app.include_router(productos_router, prefix="/api/v1/productos")
app.include_router(usuarios_router, prefix="/api/v1")
app.include_router(pedidos_router, prefix="/api/v1")
app.include_router(pagos_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")


# ── Health check ─────────────────────────────────────────────────────


@app.get("/api/v1/health", tags=["health"])
async def health_check():
    """Endpoint de verificación de salud."""
    return {"status": "ok", "version": settings.APP_VERSION}
