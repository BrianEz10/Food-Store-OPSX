from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password, verify_password
from app.modules.usuarios.repository import UsuarioRepository
from app.modules.usuarios.schemas import PerfilResponse, PerfilUpdate


async def get_perfil(db: AsyncSession, current_user_id: int) -> PerfilResponse:
    repo = UsuarioRepository(db)
    usuario = await repo.get_by_id(current_user_id)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    roles = [ur.rol_codigo for ur in usuario.usuario_roles]
    
    return PerfilResponse(
        id=usuario.id,
        nombre=usuario.nombre,
        apellido=usuario.apellido,
        email=usuario.email,
        roles=roles,
        creado_en=usuario.creado_en
    )


async def update_perfil(db: AsyncSession, current_user_id: int, data: PerfilUpdate) -> PerfilResponse:
    repo = UsuarioRepository(db)
    
    usuario = await repo.update_perfil(
        current_user_id, 
        nombre=data.nombre, 
        apellido=data.apellido
    )
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
        
    roles = [ur.rol_codigo for ur in usuario.usuario_roles]
    
    return PerfilResponse(
        id=usuario.id,
        nombre=usuario.nombre,
        apellido=usuario.apellido,
        email=usuario.email,
        roles=roles,
        creado_en=usuario.creado_en
    )


async def cambiar_password(db: AsyncSession, current_user_id: int, current_password: str, new_password: str) -> None:
    repo = UsuarioRepository(db)
    usuario = await repo.get_by_id(current_user_id)
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
        
    if not verify_password(current_password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contraseña actual incorrecta"
        )
        
    new_hash = hash_password(new_password)
    await repo.update_password(current_user_id, new_hash)
