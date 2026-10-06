"""Pruebas unitarias de la lógica de negocio (sin capa HTTP)."""

import pytest

from app.clients.fake_payment_client import FakePaymentGatewayClient
from app.core.exceptions import PaymentNotFoundError
from app.schemas.payments import PaymentMethod, PaymentStatus
from app.services.payment_service import PaymentQueryService


@pytest.fixture()
def service() -> PaymentQueryService:
    return PaymentQueryService(FakePaymentGatewayClient())


@pytest.mark.asyncio
async def test_list_payments_given_no_filters_returns_all(service: PaymentQueryService) -> None:
    result = await service.list_payments()

    assert result.total == 5
    assert len(result.items) == 5


@pytest.mark.asyncio
async def test_list_payments_given_status_filter_returns_subset(service: PaymentQueryService) -> None:
    result = await service.list_payments(status=PaymentStatus.FAILED)

    assert result.total == 1
    assert result.items[0].status == PaymentStatus.FAILED


@pytest.mark.asyncio
async def test_list_payments_given_method_filter_returns_subset(service: PaymentQueryService) -> None:
    result = await service.list_payments(method=PaymentMethod.CARD)

    assert result.total == 2
    assert all(item.method == PaymentMethod.CARD for item in result.items)


@pytest.mark.asyncio
async def test_list_payments_given_page_beyond_range_returns_empty_items(
    service: PaymentQueryService,
) -> None:
    result = await service.list_payments(page=10, page_size=20)

    assert result.total == 5
    assert result.items == []


@pytest.mark.asyncio
async def test_get_payment_given_existing_id_returns_payment(service: PaymentQueryService) -> None:
    payment = await service.get_payment("pay_1002")

    assert payment.id == "pay_1002"
    assert payment.status == PaymentStatus.PENDING


@pytest.mark.asyncio
async def test_get_payment_given_missing_id_raises_not_found(service: PaymentQueryService) -> None:
    with pytest.raises(PaymentNotFoundError):
        await service.get_payment("unknown")
