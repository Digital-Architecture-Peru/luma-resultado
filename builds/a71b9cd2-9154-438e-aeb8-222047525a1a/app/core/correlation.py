"""Correlation-id por request, propagado a logs y respuestas."""

import uuid
from contextvars import ContextVar
from typing import Optional

_correlation_id_ctx: ContextVar[Optional[str]] = ContextVar("correlation_id", default=None)


def new_correlation_id() -> str:
    return str(uuid.uuid4())


def set_correlation_id(value: str) -> None:
    _correlation_id_ctx.set(value)


def get_correlation_id() -> Optional[str]:
    return _correlation_id_ctx.get()
