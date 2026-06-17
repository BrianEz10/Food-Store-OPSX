from fastapi import APIRouter
from sqlmodel import select
from app.core.database import SessionDep
from app.core.deps import CurrentUser
from app.modules.pagos.forma_models import FormaPago
from app.modules.pagos.forma_schemas import FormaPagoOut
from app.modules.usuarios.rol_models import Rol
from app.modules.usuarios.rol_schemas import RolOut


router = APIRouter(tags=["catalogos"])


@router.get("/formas-pago", response_model=list[FormaPagoOut])
def listar_formas_pago(_user: CurrentUser, session: SessionDep):
    formas = session.exec(select(FormaPago)).all()
    return [FormaPagoOut.model_validate(f) for f in formas]


@router.get("/roles", response_model=list[RolOut])
def listar_roles(_user: CurrentUser, session: SessionDep):
    roles = session.exec(select(Rol)).all()
    return [RolOut.model_validate(r) for r in roles]
