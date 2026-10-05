"""Configuración de la aplicación basada en variables de entorno.

No contiene secretos. Todos los valores tienen defaults seguros para
desarrollo local y deben sobreescribirse vía entorno en despliegues reales.
"""
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "banca-cuentas-consulta"
    app_env: str = "development"
    api_prefix: str = "/api/v1"
    log_level: str = "INFO"
    cors_allowed_origins: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.cors_allowed_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
