"""Modelos de datos (contrato) del dominio Pagos."""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class PaymentMethod(str, Enum):
    CARD = "card"
    BANK_TRANSFER = "bank_transfer"
    WALLET = "wallet"


class Payment(BaseModel):
    id: str = Field(..., description="Identificador único del pago")
    amount: float = Field(..., ge=0, description="Monto del pago")
    currency: str = Field(..., min_length=3, max_length=3, description="Código ISO 4217, p. ej. USD")
    status: PaymentStatus
    method: PaymentMethod
    description: str
    counterparty: str
    created_at: datetime


class PaymentListResponse(BaseModel):
    items: list[Payment]
    page: int
    page_size: int
    total: int


class ProblemDetail(BaseModel):
    """Formato uniforme de error (application/problem+json)."""

    type: str
    title: str
    status: int
    detail: str
    instance: str
    correlation_id: Optional[str] = Field(default=None, alias="correlationId")

    model_config = {"populate_by_name": True}
