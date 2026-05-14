"""
Servicio de administración.
Maneja la lógica de negocio de gestión de usuarios.
"""

from fastapi import HTTPException, status

from app.core.uow import UnitOfWork
from app.modules.admin.schemas import (
    AdminUsuarioDetailResponse,
    AdminUsuarioListResponse,
    AdminUsuarioResponse,
    AdminUsuarioUpdate,
    AdminUsuarioEstadoUpdate,
)
from app.modules.usuarios.model import Usuario, UsuarioRol
from app.modules.auth.repository import revoke_all_user_tokens


class AdminService:
    @staticmethod
    async def listar_usuarios(
        current_user: Usuario,
        skip: int = 0,
        limit: int = 20,
        q: str | None = None,
        rol: str | None = None,
        incluir_eliminados: bool = False,
    ) -> AdminUsuarioListResponse:
        """Lista usuarios con búsqueda, filtros y paginación."""
        async with UnitOfWork() as uow:
            usuarios, total = await uow.usuarios.list_all_admin(
                skip=skip,
                limit=limit,
                q=q,
                rol=rol,
                incluir_eliminados=incluir_eliminados,
            )

        return AdminUsuarioListResponse(
            data=[_to_response(u) for u in usuarios],
            total=total,
            skip=skip,
            limit=limit,
        )

    @staticmethod
    async def get_usuario_detail(
        usuario_id: int,
        current_user: Usuario,
    ) -> AdminUsuarioDetailResponse:
        """Obtiene detalle de un usuario."""
        async with UnitOfWork() as uow:
            usuario = await uow.usuarios.get_by_id(usuario_id)
            if not usuario:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Usuario no encontrado",
                )

            return _to_detail_response(usuario)

    @staticmethod
    async def update_usuario(
        usuario_id: int,
        data: AdminUsuarioUpdate,
        current_user: Usuario,
    ) -> AdminUsuarioResponse:
        """Actualiza datos y roles de un usuario."""
        async with UnitOfWork() as uow:
            usuario = await uow.usuarios.get_by_id(usuario_id)
            if not usuario:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Usuario no encontrado",
                )

            if data.nombre is not None:
                usuario.nombre = data.nombre
            if data.apellido is not None:
                usuario.apellido = data.apellido
            if data.email is not None:
                usuario.email = data.email

            if data.roles is not None:
                if current_user.id == usuario_id and "ADMIN" not in data.roles:
                    admin_count = await uow.usuarios.count_by_role("ADMIN")
                    if admin_count <= 1:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="No puedes quitar el último rol ADMIN del sistema",
                        )

                for ur in list(usuario.usuario_roles):
                    uow.session.delete(ur)

                for rol_codigo in data.roles:
                    nuevo_ur = UsuarioRol(
                        usuario_id=usuario_id,
                        rol_codigo=rol_codigo,
                        asignado_por_id=current_user.id,
                    )
                    uow.session.add(nuevo_ur)

                await revoke_all_user_tokens(uow.session, usuario_id)

            await uow.usuarios.update(usuario)

        async with UnitOfWork() as uow_read:
            usuario_actualizado = await uow_read.usuarios.get_by_id(usuario_id)
            return _to_response(usuario_actualizado)

    @staticmethod
    async def toggle_usuario_estado(
        usuario_id: int,
        data: AdminUsuarioEstadoUpdate,
        current_user: Usuario,
    ) -> AdminUsuarioResponse:
        """Activa o desactiva un usuario (soft-delete/restore)."""
        if current_user.id == usuario_id and not data.activo:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No puedes desactivar tu propio usuario",
            )

        async with UnitOfWork() as uow:
            usuario = await uow.usuarios.get_by_id(usuario_id)
            if not usuario:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Usuario no encontrado",
                )

            if data.activo:
                usuario.eliminado_en = None
            else:
                from datetime import datetime
                usuario.eliminado_en = datetime.utcnow()

            await uow.usuarios.update(usuario)

            if not data.activo:
                await revoke_all_user_tokens(uow.session, usuario_id)

        async with UnitOfWork() as uow_read:
            usuario_actualizado = await uow_read.usuarios.get_by_id(usuario_id)
            return _to_response(usuario_actualizado)


def _to_response(u: Usuario) -> AdminUsuarioResponse:
    return AdminUsuarioResponse(
        id=u.id,
        nombre=u.nombre,
        apellido=u.apellido,
        email=u.email,
        telefono=u.telefono,
        roles=[ur.rol_codigo for ur in (u.usuario_roles or [])],
        activo=u.eliminado_en is None,
        creado_en=u.creado_en,
    )


def _to_detail_response(u: Usuario) -> AdminUsuarioDetailResponse:
    return AdminUsuarioDetailResponse(
        id=u.id,
        nombre=u.nombre,
        apellido=u.apellido,
        email=u.email,
        telefono=u.telefono,
        roles=[ur.rol_codigo for ur in (u.usuario_roles or [])],
        activo=u.eliminado_en is None,
        creado_en=u.creado_en,
        actualizado_en=u.actualizado_en,
        eliminado_en=u.eliminado_en,
    )
