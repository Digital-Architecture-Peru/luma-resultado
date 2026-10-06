"""Excepciones de dominio y manejadores que responden en formato problem+json."""

from fastapi import Request, status
from fastapi.responses import JSONResponse

from app.core.correlation import get_correlation_id


class PaymentNotFoundError(Exception):
    def __init__(self, payment_id: str) -> None:
        self.payment_id = payment_id
        super().__init__(f"Payment '{payment_id}' not found")


class ExternalGatewayError(Exception):
    def __init__(self, detail: str) -> None:
        self.detail = detail
        super().__init__(detail)


class InvalidQueryError(Exception):
    def __init__(self, detail: str) -> None:
        self.detail = detail
        super().__init__(detail)


def _problem(status_code: int, title: str, detail: str, instance: str) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        media_type="application/problem+json",
        content={
            "type": "about:blank",
            "title": title,
            "status": status_code,
            "detail": detail,
            "instance": instance,
            "correlationId": get_correlation_id(),
        },
    )


async def payment_not_found_handler(request: Request, exc: PaymentNotFoundError) -> JSONResponse:
    return _problem(status.HTTP_404_NOT_FOUND, "Payment not found", str(exc), str(request.url.path))


async def external_gateway_error_handler(request: Request, exc: ExternalGatewayError) -> JSONResponse:
    return _problem(status.HTTP_502_BAD_GATEWAY, "External gateway error", exc.detail, str(request.url.path))


async def invalid_query_handler(request: Request, exc: InvalidQueryError) -> JSONResponse:
    return _problem(status.HTTP_422_UNPROCESSABLE_ENTITY, "Invalid query", exc.detail, str(request.url.path))


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return _problem(
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        "Internal server error",
        "An unexpected error occurred",
        str(request.url.path),
    )
