"""Fábrica/Depends que elige la implementación del cliente de pagos.

Por defecto (USE_FAKE_GATEWAY=true o sin PAYMENT_GATEWAY_BASE_URL) se usa
la implementación en memoria con datos ficticios; si se configura un
proveedor real, se usa el cliente HTTP.
"""

from app.clients.base import PaymentGatewayClient
from app.clients.external_payment_client import ExternalPaymentGatewayClient
from app.clients.fake_payment_client import FakePaymentGatewayClient
from app.core.config import Settings, get_settings


def build_payment_gateway_client(settings: Settings) -> PaymentGatewayClient:
    if settings.use_fake_gateway or not settings.payment_gateway_base_url:
        return FakePaymentGatewayClient()
    return ExternalPaymentGatewayClient(
        base_url=settings.payment_gateway_base_url,
        api_key=settings.payment_gateway_api_key,
        timeout_seconds=settings.payment_gateway_timeout_seconds,
    )


def get_payment_gateway_client() -> PaymentGatewayClient:
    settings = get_settings()
    return build_payment_gateway_client(settings)
