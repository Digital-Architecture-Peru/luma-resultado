"""Logging estructurado (texto plano con campos clave=valor) con correlation-id.

No se registran datos sensibles ni objetos completos de petición/respuesta.
"""

import logging
import sys

from app.core.correlation import get_correlation_id


class CorrelationIdFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.correlation_id = get_correlation_id() or "-"
        return True


def configure_logging(level: str = "INFO") -> None:
    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        fmt="%(asctime)s level=%(levelname)s correlation_id=%(correlation_id)s "
        "logger=%(name)s message=%(message)s"
    )
    handler.setFormatter(formatter)
    handler.addFilter(CorrelationIdFilter())

    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(level.upper())
