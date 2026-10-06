"""Fixtures compartidos para las pruebas de API.

Las pruebas nunca llaman al proveedor externo real: se sobreescribe la
dependencia del cliente de pagos con la implementación en memoria.
"""

from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app.clients.base import PaymentGatewayClient
from app.clients.dependency import get_payment_gateway_client
from app.clients.fake_payment_client import FakePaymentGatewayClient
from app.main import app


@pytest.fixture()
def fake_client() -> FakePaymentGatewayClient:
    return FakePaymentGatewayClient()


@pytest.fixture()
def client(fake_client: FakePaymentGatewayClient) -> Iterator[TestClient]:
    def _override() -> PaymentGatewayClient:
        return fake_client

    app.dependency_overrides[get_payment_gateway_client] = _override
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
