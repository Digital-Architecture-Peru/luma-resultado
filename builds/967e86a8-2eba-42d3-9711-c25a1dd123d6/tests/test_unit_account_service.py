"""Pruebas unitarias del servicio de consulta de Cuentas."""
import pytest

from app.repositories.account_repository import InMemoryAccountRepository
from app.services.account_service import AccountNotFoundError, AccountQueryService


@pytest.fixture
def service() -> AccountQueryService:
    return AccountQueryService(InMemoryAccountRepository())


def test_list_accounts_for_owner_returns_only_owner_accounts(service):
    accounts = service.list_accounts_for_owner("cust-123")
    assert len(accounts) == 2
    assert all(a.owner_id == "cust-123" for a in accounts)


def test_list_accounts_for_owner_without_accounts_returns_empty_list(service):
    accounts = service.list_accounts_for_owner("cust-does-not-exist")
    assert accounts == []


def test_list_accounts_for_owner_rejects_blank_owner_id(service):
    with pytest.raises(ValueError):
        service.list_accounts_for_owner("   ")


def test_get_account_returns_matching_account(service):
    account = service.get_account("acc-001")
    assert account.account_id == "acc-001"
    assert account.owner_id == "cust-123"


def test_get_account_raises_not_found_for_unknown_id(service):
    with pytest.raises(AccountNotFoundError):
        service.get_account("acc-unknown")


def test_get_account_rejects_blank_account_id(service):
    with pytest.raises(ValueError):
        service.get_account("")
