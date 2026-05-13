from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.direcciones.repository import DireccionRepository
from app.modules.direcciones.schemas import (
    DireccionCreate,
    DireccionResponse,
    DireccionUpdate,
)


async def _verify_ownership(repo: DireccionRepository, direccion_id: int, usuario_id: int):
    direccion = await repo.get_by_id(direccion_id)
    if not direccion or direccion.usuario_id != usuario_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dirección no encontrada"
        )
    return direccion


async def list_direcciones(db: AsyncSession, usuario_id: int) -> list[DireccionResponse]:
    repo = DireccionRepository(db)
    direcciones = await repo.list_by_user(usuario_id)
    return [DireccionResponse.model_validate(d) for d in direcciones]


async def create_direccion(db: AsyncSession, usuario_id: int, data: DireccionCreate) -> DireccionResponse:
    repo = DireccionRepository(db)
    
    direcciones = await repo.list_by_user(usuario_id)
    
    # Invariante 1: Si es la primera, forzar principal
    if not direcciones:
        data.es_principal = True
        
    # Invariante 2: Si se marca como principal, desmarcar las demás
    if data.es_principal:
        await repo.unset_all_default(usuario_id)
        
    direccion = await repo.create_for_user(usuario_id, data)
    return DireccionResponse.model_validate(direccion)


async def get_direccion(db: AsyncSession, usuario_id: int, direccion_id: int) -> DireccionResponse:
    repo = DireccionRepository(db)
    direccion = await _verify_ownership(repo, direccion_id, usuario_id)
    return DireccionResponse.model_validate(direccion)


async def update_direccion(
    db: AsyncSession, usuario_id: int, direccion_id: int, data: DireccionUpdate
) -> DireccionResponse:
    repo = DireccionRepository(db)
    direccion = await _verify_ownership(repo, direccion_id, usuario_id)
    
    if data.es_principal is True and not direccion.es_principal:
        await repo.unset_all_default(usuario_id)
    elif data.es_principal is False and direccion.es_principal:
        direcciones = await repo.list_by_user(usuario_id)
        if len(direcciones) == 1:
            # No se puede quitar el flag principal si es la única
            data.es_principal = True
        else:
            # Reasignar a la más reciente que no sea esta
            otras = [d for d in direcciones if d.id != direccion_id]
            if otras:
                await repo.set_default(otras[-1].id)
                
    updated = await repo.update_direccion(direccion_id, data)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dirección no encontrada"
        )
    return DireccionResponse.model_validate(updated)


async def delete_direccion(db: AsyncSession, usuario_id: int, direccion_id: int) -> None:
    repo = DireccionRepository(db)
    direccion = await _verify_ownership(repo, direccion_id, usuario_id)
    
    direcciones = await repo.list_by_user(usuario_id)
    if len(direcciones) == 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede eliminar la única dirección de la cuenta"
        )
        
    if direccion.es_principal:
        # Reasignar a otra antes de borrar
        otras = [d for d in direcciones if d.id != direccion_id]
        if otras:
            await repo.set_default(otras[-1].id)
            
    await repo.delete_direccion(direccion_id)


async def set_predeterminada(db: AsyncSession, usuario_id: int, direccion_id: int) -> DireccionResponse:
    repo = DireccionRepository(db)
    direccion = await _verify_ownership(repo, direccion_id, usuario_id)
    
    if not direccion.es_principal:
        await repo.unset_all_default(usuario_id)
        await repo.set_default(direccion_id)
        
    updated = await repo.get_by_id(direccion_id)
    return DireccionResponse.model_validate(updated)

