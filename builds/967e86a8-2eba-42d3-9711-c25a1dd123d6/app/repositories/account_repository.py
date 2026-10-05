"""Interfaz de repositorio de Cuentas y una implementación en memoria.

Persistencia: "No requiere" según el guion. Se modela detrás de una
interfaz (AccountRepository) para permitir sustituir la implementación
en memoria por una real (BD, integración externa, etc.) sin tocar la
capa de servicio ni la capa de entrada.
"""
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Iterable

from app.models.account import Account, AccountStatus, AccountType


class AccountRepository(ABC):
    """Puerto de salida para acceso a datos de Cuentas."""

    @abstractmethod
    def list_by_owner(self, owner_id: str) -> Iterable[Account]:
        """Lista las cuentas pertenecientes a un titular."""

    @abstractmethod
    def get_by_id(self, account_id: str) -> Account | None:
        """Obtiene una cuenta por su identificador, o None si no existe."""


class InMemoryAccountRepository(AccountRepository):
    """Implementación en memoria con datos ficticios.

    No requiere persistencia real; útil para demo y pruebas. Los datos
    se reinician en cada arranque del proceso.
    """

    def __init__(self) -> None:
        self._accounts: dict[str, Account] = {
            "acc-001": Account(
                account_id="acc-001",
                owner_id="cust-123",
                account_number="0001-0002-0003-000456",
                account_type=AccountType.SAVINGS,
                status=AccountStatus.ACTIVE,
                balance=1523.45,
                currency="PEN",
                opened_at=datetime(2022, 3, 15, 9, 30, 0),
            ),
            "acc-002": Account(
                account_id="acc-002",
                owner_id="cust-123",
                account_number="0001-0002-0003-000789",
                account_type=AccountType.CHECKING,
                status=AccountStatus.ACTIVE,
                balance=250.00,
                currency="PEN",
                opened_at=datetime(2023, 7, 1, 14, 0, 0),
            ),
            "acc-003": Account(
                account_id="acc-003",
                owner_id="cust-456",
                account_number="0001-0002-0003-001111",
                account_type=AccountType.CREDIT,
                status=AccountStatus.BLOCKED,
                balance=-340.10,
                currency="USD",
                opened_at=datetime(2021, 11, 20, 8, 15, 0),
            ),
        }

    def list_by_owner(self, owner_id: str) -> Iterable[Account]:
        return [a for a in self._accounts.values() if a.owner_id == owner_id]

    def get_by_id(self, account_id: str) -> Account | None:
        return self._accounts.get(account_id)


_shared_repository = InMemoryAccountRepository()


def get_account_repository() -> AccountRepository:
    """Proveedor de dependencia FastAPI para el repositorio de Cuentas."""
    return _shared_repository
