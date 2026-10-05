"""Esquemas (DTOs) de entrada/salida de la API de Cuentas.

Separados del modelo de dominio para desacoplar el contrato público de
la representación interna.
"""
from datetime import datetime

from pydantic import BaseModel, Field

from app.models.account import AccountStatus, AccountType


class AccountSummary(BaseModel):
    """Representación resumida de una cuenta para listados."""

    account_id: str = Field(..., examples=["acc-001"])
    account_number: str = Field(..., examples=["0001-0002-0003-000456"])
    account_type: AccountType
    status: AccountStatus
    balance: float = Field(..., examples=[1523.45])
    currency: str = Field(..., examples=["PEN"])


class AccountDetail(AccountSummary):
    """Representación detallada de una cuenta."""

    owner_id: str = Field(..., examples=["cust-123"])
    opened_at: datetime


class ErrorResponse(BaseModel):
    """Formato uniforme de error, estilo problem+json simplificado."""

    type: str = Field(..., examples=["about:blank"])
    title: str = Field(..., examples=["Cuenta no encontrada"])
    status: int = Field(..., examples=[404])
    detail: str = Field(..., examples=["No existe la cuenta solicitada"])
    instance: str | None = None
