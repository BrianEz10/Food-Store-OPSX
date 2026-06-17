import logging, os, uuid, shutil
from fastapi import UploadFile
from app.core.errors import http_error

logger = logging.getLogger(__name__)

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024

UPLOAD_DIR = "/app/imagenes"

class UploadService:
    def __init__(self) -> None:
        os.makedirs(UPLOAD_DIR, exist_ok=True)

    def _ext(self, filename: str) -> str:
        _, ext = os.path.splitext(filename)
        return ext.lower()

    def _validate_file(self, file: UploadFile) -> None:
        ext = self._ext(file.filename or "")
        if ext not in ALLOWED_EXTENSIONS:
            raise http_error(400, f"Extensión no soportada: {ext}. Permitidas: jpg, png, webp", "INVALID_FILE", "file")

    def _validate_file_size(self, content: bytes) -> None:
        if len(content) > MAX_FILE_SIZE:
            raise http_error(400, "Archivo demasiado grande. Máximo 5 MB", "INVALID_FILE", "file")

    def upload_imagen(self, file: UploadFile) -> dict:
        self._validate_file(file)
        content = file.file.read()
        self._validate_file_size(content)
        ext = self._ext(file.filename or ".jpg")
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(content)
        return {
            "secure_url": f"/imagenes/{filename}",
            "public_id": filename,
            "format": ext.lstrip("."),
        }

    def eliminar_imagen(self, public_id: str) -> None:
        filepath = os.path.join(UPLOAD_DIR, public_id)
        if os.path.exists(filepath):
            os.remove(filepath)
