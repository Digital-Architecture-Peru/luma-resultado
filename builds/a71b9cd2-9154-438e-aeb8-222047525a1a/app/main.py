"""Punto de entrada de la aplicación FastAPI."""

from fastapi import FastAPI, Request

from app.core.config import get_settings
from app.core.correlation import new_correlation_id, set_correlation_id
from app.core.exceptions import (
    ExternalGatewayError,
    PaymentNotFoundError,
    external_gateway_error_handler,
    payment_not_found_handler,
    unhandled_exception_handler,
)
from app.core.logging import configure_logging
from app.routers.health import router as health_router
from app.routers.payments import router as payments_router

settings = get_settings()
configure_logging(settings.log_level)

app = FastAPI(
    title="Payments Query API",
    description=(
        "API REST de consulta sobre el dominio Pagos, pensada para la app móvil. "
        "Integra un proveedor externo de pagos detrás de una interfaz; no requiere "
        "persistencia propia."
    ),
    version="0.1.0",
)


@app.middleware("http")
async def correlation_id_middleware(request: Request, call_next):
    incoming_id = request.headers.get("X-Correlation-Id") or new_correlation_id()
    set_correlation_id(incoming_id)
    response = await call_next(request)
    response.headers["X-Correlation-Id"] = incoming_id
    return response


app.add_exception_handler(PaymentNotFoundError, payment_not_found_handler)
app.add_exception_handler(ExternalGatewayError, external_gateway_error_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

app.include_router(health_router)
app.include_router(payments_router)
