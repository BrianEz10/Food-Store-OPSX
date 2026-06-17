from fastapi import APIRouter, Depends, UploadFile, File, status
from typing import Annotated
from app.core.deps import require_role
from app.modules.usuarios.models import Usuario
from app.modules.productos.schemas import UploadResponse
from app.modules.productos.upload_service import UploadService


router = APIRouter(prefix="/uploads", tags=["uploads"])


def get_upload_service() -> UploadService:
    return UploadService()


@router.post("/imagen", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
def subir_imagen(_admin: Annotated[Usuario, Depends(require_role(["ADMIN"]))], svc: UploadService = Depends(get_upload_service), file: UploadFile = File(...)):
    return svc.upload_imagen(file)


@router.delete("/imagen/{filename}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar(filename: str, _admin: Annotated[Usuario, Depends(require_role(["ADMIN"]))], svc: UploadService = Depends(get_upload_service)):
    svc.eliminar_imagen(filename)
