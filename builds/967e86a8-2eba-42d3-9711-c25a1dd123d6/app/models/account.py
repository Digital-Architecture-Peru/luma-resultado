"""Modelo de dominio: Cuenta.

Representa el estado interno de una cuenta bancaria. Es un modelo de
dominio simple, independiente de la capa de entrada (API) y de la capa
de persistencia (repositorio).
"""
from dataclasses import dataclass
from datetime import datetime
from enum import Enum


class AccountType(str, Enum):
    CHECKING = "CHECKING"
    SAVINGS = "SAVINGS"
    CREDIT = "CREDIT"


class AccountStatus(str, Enum):
    ACTIVE = "ACTIVE"
    BLOCKED = "BLOCKED"
    CLOSED = "CLOSED"


@dataclass(frozen=True)
class Account:
    account_id: str
    owner_id: str
    account_number: str
    account_type: AccountType
    status: AccountStatus
    balance: float
    currency: str
    opened_at: datetime
