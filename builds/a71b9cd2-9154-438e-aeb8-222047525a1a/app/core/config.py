"""Configuración de la aplicación leída desde variables de entorno.

No contiene secretos: los valores sensibles (p. ej. la API key del
proveedor externo) solo se leen del entorno y nunca tienen un valor por
defecto distinto de cadena vacía o None.
"""

from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    environment: str = "development"
    log_level: str = "INFO"

    # Integración con la API externa del proveedor de pagos.
    use_fake_gateway: bool = True
    payment_gateway_base_url: Optional[str] = None
    payment_gateway_api_key: Optional[str] = None
    payment_gateway_timeout_seconds: float = 5.0

    # Paginación por defecto para la consulta de pagos.
    default_page_size: int = 20
    max_page_size: int = 100


@lru_cache
def get_settings() -> Settings:
    """Devuelve una instancia cacheada de Settings (una por proceso)."""
    return Settings()
