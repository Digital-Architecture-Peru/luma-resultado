"""Punto de entrada de la aplicación FastAPI.

Capacidad: Consulta sobre el dominio Cuentas, para Banca por Internet.
Integración: Ninguna. Persistencia: No requiere (repositorio en memoria).
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import accounts

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="API REST de consulta de Cuentas (Banca por Internet)",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(accounts.router, prefix=settings.api_prefix)


@app.get("/health", tags=["Salud"], summary="Verifica el estado del servicio")
def health() -> dict:
    return {"status": "UP", "app": settings.app_name, "env": settings.app_env}
