"""Endpoints de salud (liveness/readiness)."""

from fastapi import APIRouter

from app.core.config import get_settings

router = APIRouter(tags=["health"])


@router.get("/health", summary="Liveness probe")
async def health() -> dict:
    return {"status": "ok"}


@router.get("/ready", summary="Readiness probe")
async def ready() -> dict:
    settings = get_settings()
    gateway_configured = settings.use_fake_gateway or bool(settings.payment_gateway_base_url)
    return {"status": "ok" if gateway_configured else "degraded"}
