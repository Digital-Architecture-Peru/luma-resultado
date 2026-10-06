"""Utilidades de fechas para normalizar filtros de consulta a UTC."""

from datetime import datetime, timezone
from typing import Optional


def ensure_utc(value: Optional[datetime]) -> Optional[datetime]:
    """Garantiza que el datetime tenga zona horaria UTC.

    Si el valor llega sin zona horaria (naive), se asume UTC para evitar
    comparaciones ambiguas con los datos del proveedor externo.
    """
    if value is None:
        return None
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)
