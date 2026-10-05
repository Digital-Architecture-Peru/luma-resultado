"""Capa de dominio/servicio para la consulta de Cuentas.

Contiene la lógica de negocio de la capacidad de "Consulta" sobre el
dominio Cuentas, desacoplada de FastAPI y del repositorio concreto.
"""
from app.models.account import Account
from app.repositories.account_repository import AccountRepository


class AccountNotFoundError(Exception):
    """Se lanza cuando no existe una cuenta con el identificador dado."""

    def __init__(self, account_id: str) -> None:
        self.account_id = account_id
        super().__init__(f"Cuenta no encontrada: {account_id}")


class AccountQueryService:
    """Servicio de consulta de Cuentas (solo lectura)."""

    def __init__(self, repository: AccountRepository) -> None:
        self._repository = repository

    def list_accounts_for_owner(self, owner_id: str) -> list[Account]:
        """Devuelve las cuentas del titular indicado.

        Si el titular no tiene cuentas, devuelve una lista vacía (no es
        un error: es un resultado válido de la consulta).
        """
        if not owner_id or not owner_id.strip():
            raise ValueError("owner_id es obligatorio")
        return list(self._repository.list_by_owner(owner_id))

    def get_account(self, account_id: str) -> Account:
        """Devuelve el detalle de una cuenta por id.

        Lanza AccountNotFoundError si no existe.
        """
        if not account_id or not account_id.strip():
            raise ValueError("account_id es obligatorio")
        account = self._repository.get_by_id(account_id)
        if account is None:
            raise AccountNotFoundError(account_id)
        return account
