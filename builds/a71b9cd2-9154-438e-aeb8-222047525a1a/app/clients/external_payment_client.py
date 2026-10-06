"""Cliente real hacia el proveedor externo de pagos (API externa).

Esta implementación no se ejecuta en este entorno (sin red disponible);
su contrato y manejo de errores quedan listos para validarse en CI/CD con
credenciales reales provistas por variables de entorno.
"""

from datetime import datetime
from typing import Optional

import httpx

from app.clients.base import PaymentGatewayClient
from app.core.exceptions import ExternalGatewayError
from app.schemas.payments import Payment, PaymentMethod, PaymentStatus


class ExternalPaymentGatewayClient(PaymentGatewayClient):
    def __init__(self, base_url: str, api_key: Optional[str], timeout_seconds: float) -> None:
        self._base_url = base_url.rstrip("/")
        self._api_key = api_key
        self._timeout = timeout_seconds

    def _headers(self) -> dict:
        headers = {"Accept": "application/json"}
        if self._api_key:
            headers["Authorization"] = f"Bearer {self._api_key}"
        return headers

    async def list_payments(
        self,
        *,
        status: Optional[PaymentStatus] = None,
        method: Optional[PaymentMethod] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
    ) -> list[Payment]:
        params: dict = {}
        if status is not None:
            params["status"] = status.value
        if method is not None:
            params["method"] = method.value
        if date_from is not None:
            params["date_from"] = date_from.isoformat()
        if date_to is not None:
            params["date_to"] = date_to.isoformat()

        try:
            async with httpx.AsyncClient(
                base_url=self._base_url, timeout=self._timeout, headers=self._headers()
            ) as client:
                response = await client.get("/payments", params=params)
                response.raise_for_status()
                data = response.json()
        except httpx.HTTPError as exc:
            raise ExternalGatewayError(
                f"Fallo al consultar pagos en el proveedor externo: {exc}"
            ) from exc

        return [Payment(**item) for item in data.get("items", [])]

    async def get_payment(self, payment_id: str) -> Optional[Payment]:
        try:
            async with httpx.AsyncClient(
                base_url=self._base_url, timeout=self._timeout, headers=self._headers()
            ) as client:
                response = await client.get(f"/payments/{payment_id}")
                if response.status_code == 404:
                    return None
                response.raise_for_status()
                data = response.json()
        except httpx.HTTPError as exc:
            raise ExternalGatewayError(
                f"Fallo al consultar el pago '{payment_id}' en el proveedor externo: {exc}"
            ) from exc

        return Payment(**data)
