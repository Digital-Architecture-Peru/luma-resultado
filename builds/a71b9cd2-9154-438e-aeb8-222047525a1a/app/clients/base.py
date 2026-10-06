"""Interfaz hacia el proveedor externo de pagos.

Toda implementación (real o de prueba) debe respetar este contrato para que
el resto de la aplicación sea independiente del proveedor concreto.
"""

from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional

from app.schemas.payments import Payment, PaymentMethod, PaymentStatus


class PaymentGatewayClient(ABC):
    @abstractmethod
    async def list_payments(
        self,
        *,
        status: Optional[PaymentStatus] = None,
        method: Optional[PaymentMethod] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
    ) -> list[Payment]:
        raise NotImplementedError

    @abstractmethod
    async def get_payment(self, payment_id: str) -> Optional[Payment]:
        raise NotImplementedError
