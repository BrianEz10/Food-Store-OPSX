from datetime import datetime, timezone
from sqlmodel import Session, select
from app.modules.ingredientes.models import Ingrediente
from app.modules.ingredientes.schemas import IngredienteCreate, IngredienteUpdate, IngredienteOut
from app.core.errors import http_error


class IngredienteService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def _get_or_404(self, ingrediente_id: int) -> Ingrediente:
        ingrediente = self._session.get(Ingrediente, ingrediente_id)
        if not ingrediente:
            raise http_error(404, f"Ingrediente con id {ingrediente_id} no encontrado", "NOT_FOUND", "ingrediente_id")
        return ingrediente

    def create(self, data: IngredienteCreate) -> IngredienteOut:
        existing = self._session.exec(
            select(Ingrediente).where(Ingrediente.nombre == data.nombre, Ingrediente.deleted_at == None)
        ).first()
        if existing:
            raise http_error(409, "Ya existe un ingrediente con ese nombre", "ALREADY_EXISTS", "nombre")
        ingrediente = Ingrediente.model_validate(data)
        self._session.add(ingrediente)
        self._session.flush()
        self._session.commit()
        return IngredienteOut.model_validate(ingrediente)

    def get_by_id(self, ingrediente_id: int) -> IngredienteOut:
        ingrediente = self._get_or_404(ingrediente_id)
        return IngredienteOut.model_validate(ingrediente)

    def get_all(self) -> list[IngredienteOut]:
        ingredientes = self._session.exec(
            select(Ingrediente).where(Ingrediente.deleted_at == None)
        ).all()
        return [IngredienteOut.model_validate(i) for i in ingredientes]

    def update(self, ingrediente_id: int, data: IngredienteUpdate) -> IngredienteOut:
        ingrediente = self._get_or_404(ingrediente_id)
        patch = data.model_dump(exclude_unset=True)
        for field, value in patch.items():
            setattr(ingrediente, field, value)
        self._session.add(ingrediente)
        self._session.commit()
        return IngredienteOut.model_validate(ingrediente)

    def delete(self, ingrediente_id: int) -> None:
        ingrediente = self._get_or_404(ingrediente_id)
        ingrediente.deleted_at = datetime.now(timezone.utc)
        self._session.commit()
