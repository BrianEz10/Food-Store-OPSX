from datetime import datetime, timezone
from sqlmodel import Session, select
from app.modules.direcciones.models import DireccionEntrega
from app.modules.direcciones.schemas import DireccionCreate, DireccionUpdate, DireccionOut
from app.core.errors import http_error


class DireccionService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def _get_mia_or_404(self, usuario_id: int, direccion_id: int) -> DireccionEntrega:
        direccion = self._session.get(DireccionEntrega, direccion_id)
        if not direccion or direccion.usuario_id != usuario_id:
            raise http_error(404, "Direccion no encontrada", "NOT_FOUND")
        return direccion

    def get_mis_direcciones(self, usuario_id: int) -> list[DireccionOut]:
        direcciones = self._session.exec(
            select(DireccionEntrega).where(
                DireccionEntrega.usuario_id == usuario_id,
                DireccionEntrega.deleted_at == None
            )
        ).all()
        return [DireccionOut.model_validate(d) for d in direcciones]

    def get_by_id(self, usuario_id: int, direccion_id: int) -> DireccionOut:
        direccion = self._get_mia_or_404(usuario_id, direccion_id)
        return DireccionOut.model_validate(direccion)

    def marcar_principal(self, usuario_id: int, direccion_id: int) -> DireccionOut:
        direccion = self._get_mia_or_404(usuario_id, direccion_id)
        actual_principal = self._session.exec(
            select(DireccionEntrega).where(
                DireccionEntrega.usuario_id == usuario_id,
                DireccionEntrega.es_principal == True,
                DireccionEntrega.deleted_at == None
            )
        ).first()
        if actual_principal and actual_principal.id != direccion_id:
            actual_principal.es_principal = False
        direccion.es_principal = True
        self._session.commit()
        return DireccionOut.model_validate(direccion)

    def create(self, usuario_id: int, data: DireccionCreate) -> DireccionOut:
        datos = data.model_dump()
        datos["usuario_id"] = usuario_id
        direccion = DireccionEntrega(**datos)
        self._session.add(direccion)
        self._session.flush()
        self._session.commit()
        return DireccionOut.model_validate(direccion)

    def update(self, usuario_id: int, direccion_id: int, data: DireccionUpdate) -> DireccionOut:
        direccion = self._get_mia_or_404(usuario_id, direccion_id)
        patch = data.model_dump(exclude_unset=True)
        for field, value in patch.items():
            setattr(direccion, field, value)
        self._session.add(direccion)
        self._session.commit()
        return DireccionOut.model_validate(direccion)

    def admin_get_by_id(self, direccion_id: int) -> DireccionOut:
        direccion = self._session.get(DireccionEntrega, direccion_id)
        if not direccion:
            raise http_error(404, "Direccion no encontrada", "NOT_FOUND")
        return DireccionOut.model_validate(direccion)

    def delete(self, usuario_id: int, direccion_id: int) -> None:
        direccion = self._get_mia_or_404(usuario_id, direccion_id)
        direccion.deleted_at = datetime.now(timezone.utc)
        self._session.commit()
