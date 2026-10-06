"""Endpoints REST de consulta del dominio Pagos (v1)."""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, Query

from app.clients.base import PaymentGatewayClient
from app.clients.dependency import get_payment_gateway_client
from app.schemas.payments import Payment, PaymentListResponse, PaymentMethod, PaymentStatus
from app.services.payment_service import PaymentQueryService

router = APIRouter(prefix="/v1/payments", tags=["payments"])


def get_payment_service(
    gateway_client: PaymentGatewayClient = Depends(get_payment_gateway_client),
) -> PaymentQueryService:
    return PaymentQueryService(gateway_client)


@router.get("", response_model=PaymentListResponse, summary="Listar pagos")
async def list_payments(
    status: Optional[PaymentStatus] = Query(default=None, description="Filtra por estado del pago"),
    method: Optional[PaymentMethod] = Query(default=None, description="Filtra por método de pago"),
    date_from: Optional[datetime] = Query(default=None, description="Fecha mínima, ISO-8601"),
    date_to: Optional[datetime] = Query(default=None, description="Fecha máxima, ISO-8601"),
    page: int = Query(default=1, ge=1, description="Número de página"),
    page_size: int = Query(default=20, ge=1, le=100, description="Tamaño de página"),
    service: PaymentQueryService = Depends(get_payment_service),
) -> PaymentListResponse:
    return await service.list_payments(
        status=status,
        method=method,
        date_from=date_from,
        date_to=date_to,
        page=page,
        page_size=page_size,
    )


@router.get("/{payment_id}", response_model=Payment, summary="Obtener detalle de un pago")
async def get_payment(
    payment_id: str,
    service: PaymentQueryService = Depends(get_payment_service),
) -> Payment:
    return await service.get_payment(payment_id)
