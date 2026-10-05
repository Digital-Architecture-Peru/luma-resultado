"""Capa de entrada: endpoints REST de consulta de Cuentas.

Patrón: API REST. Expone recursos bajo /accounts, usa verbos GET
(capacidad "Consulta"), códigos HTTP estándar y errores uniformes.
"""
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import JSONResponse

from app.repositories.account_repository import (
    AccountRepository,
    get_account_repository,
)
from app.schemas.account import AccountDetail, AccountSummary, ErrorResponse
from app.services.account_service import AccountNotFoundError, AccountQueryService

router = APIRouter(prefix="/accounts", tags=["Cuentas"])


def get_account_service(
    repository: AccountRepository = Depends(get_account_repository),
) -> AccountQueryService:
    return AccountQueryService(repository)


def _to_summary(account) -> AccountSummary:
    return AccountSummary(
        account_id=account.account_id,
        account_number=account.account_number,
        account_type=account.account_type,
        status=account.status,
        balance=account.balance,
        currency=account.currency,
    )


def _to_detail(account) -> AccountDetail:
    return AccountDetail(
        account_id=account.account_id,
        account_number=account.account_number,
        account_type=account.account_type,
        status=account.status,
        balance=account.balance,
        currency=account.currency,
        owner_id=account.owner_id,
        opened_at=account.opened_at,
    )


@router.get(
    "",
    response_model=list[AccountSummary],
    summary="Lista las cuentas de un titular",
)
def list_accounts(
    owner_id: str = Query(..., min_length=1, description="Identificador del titular"),
    service: AccountQueryService = Depends(get_account_service),
) -> list[AccountSummary]:
    try:
        accounts = service.list_accounts_for_owner(owner_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return [_to_summary(a) for a in accounts]


@router.get(
    "/{account_id}",
    response_model=AccountDetail,
    responses={404: {"model": ErrorResponse}},
    summary="Obtiene el detalle de una cuenta",
)
def get_account(
    account_id: str,
    request: Request,
    service: AccountQueryService = Depends(get_account_service),
):
    try:
        account = service.get_account(account_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except AccountNotFoundError as exc:
        return JSONResponse(
            status_code=404,
            content=ErrorResponse(
                type="about:blank",
                title="Cuenta no encontrada",
                status=404,
                detail=str(exc),
                instance=str(request.url.path),
            ).model_dump(),
        )
    return _to_detail(account)
