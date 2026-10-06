"""Implementación en memoria de PaymentGatewayClient.

Se usa cuando no hay proveedor externo configurado (USE_FAKE_GATEWAY=true,
valor por defecto) y en las pruebas automáticas. No persiste datos ni
realiza llamadas de red.
"""

from datetime import datetime
from typing import Optional

from app.clients.base import PaymentGatewayClient
from app.clients.fixtures import FAKE_PAYMENTS
from app.schemas.payments import Payment, PaymentMethod, PaymentStatus


class FakePaymentGatewayClient(PaymentGatewayClient):
    def __init__(self, records: Optional[list[dict]] = None) -> None:
        self._records = records if records is not None else FAKE_PAYMENTS

    async def list_payments(
        self,
        *,
        status: Optional[PaymentStatus] = None,
        method: Optional[PaymentMethod] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
    ) -> list[Payment]:
        results = [Payment(**record) for record in self._records]

        if status is not None:
            results = [p for p in results if p.status == status]
        if method is not None:
            results = [p for p in results if p.method == method]
        if date_from is not None:
            results = [p for p in results if p.created_at >= date_from]
        if date_to is not None:
            results = [p for p in results if p.created_at <= date_to]

        return sorted(results, key=lambda p: p.created_at, reverse=True)

    async def get_payment(self, payment_id: str) -> Optional[Payment]:
        for record in self._records:
            if record["id"] == payment_id:
                return Payment(**record)
        return None
