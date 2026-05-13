"""
Modelo Ingrediente con flag de alérgeno.
"""

from datetime import datetime, timezone
from typing import TYPE_CHECKING

import sqlalchemy as sa
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.productos.model import ProductoIngrediente


class Ingrediente(SQLModel, table=True):
    """
    Ingrediente con flag de alérgeno para filtrado en el catálogo.
    """

    __tablename__ = "ingredientes"
    __table_args__ = {"extend_existing": True}

    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(
        sa_column=sa.Column(sa.String(100), nullable=False),
    )
    descripcion: str | None = Field(
        default=None,
        sa_column=sa.Column(sa.Text, nullable=True),
    )
    es_alergeno: bool = Field(
        default=False,
        sa_column=sa.Column(sa.Boolean, nullable=False, server_default="false"),
    )

    # Soft delete
    eliminado_en: datetime | None = Field(
        default=None,
        sa_column=sa.Column(sa.DateTime(timezone=True), nullable=True),
    )

    # Auditoría
    creado_en: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=sa.Column(
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )
    actualizado_en: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=sa.Column(
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
            onupdate=sa.text("now()"),
        ),
    )

    # Relaciones
    producto_ingredientes: list["ProductoIngrediente"] = Relationship(
        back_populates="ingrediente",
    )