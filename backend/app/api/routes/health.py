from fastapi import APIRouter

from app.core.config import settings

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check() -> dict[str, str]:
    return {
        "app": settings.app_name,
        "message": "Backend is running",
        "status": "ok",
    }
