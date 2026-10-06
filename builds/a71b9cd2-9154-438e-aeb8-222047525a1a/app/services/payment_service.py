"""Casos de uso de consulta sobre el dominio Pagos."""

from datetime import datetime
from typing import Optional

from app.clients.base import PaymentGatewayClient
from app.core.exceptions import PaymentNotFoundError
from app.core.timeutils import ensure_utc
from app.schemas.payments import Payment, PaymentListResponse, PaymentMethod, PaymentStatus


class PaymentQueryService:
    def __init__(self, gateway_client: PaymentGatewayClient) -> None:
        self._gateway_client = gateway_client

    async def list_payments(
        self,
        *,
        status: Optional[PaymentStatus] = None,
        method: Optional[PaymentMethod] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> PaymentListResponse:
        all_matching = await self._gateway_client.list_payments(
            status=status,
            method=method,
            date_from=ensure_utc(date_from),
            date_to=ensure_utc(date_to),
        )

        total = len(all_matching)
        start = (page - 1) * page_size
        end = start + page_size
        page_items = all_matching[start:end]

        return PaymentListResponse(items=page_items, page=page, page_size=page_size, total=total)

    async def get_payment(self, payment_id: str) -> Payment:
        payment = await self._gateway_client.get_payment(payment_id)
        if payment is None:
            raise PaymentNotFoundError(payment_id)
        return payment
