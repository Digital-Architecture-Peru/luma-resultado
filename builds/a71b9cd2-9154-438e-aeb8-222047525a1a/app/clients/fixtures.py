"""Datos ficticios usados por el cliente falso (desarrollo y pruebas).

Ninguno de estos registros corresponde a personas, cuentas o transacciones
reales.
"""

from datetime import datetime, timezone

FAKE_PAYMENTS: list[dict] = [
    {
        "id": "pay_1001",
        "amount": 149.90,
        "currency": "USD",
        "status": "completed",
        "method": "card",
        "description": "Compra en tienda Luma Store",
        "counterparty": "Luma Store",
        "created_at": datetime(2026, 9, 28, 14, 32, tzinfo=timezone.utc),
    },
    {
        "id": "pay_1002",
        "amount": 25.00,
        "currency": "USD",
        "status": "pending",
        "method": "wallet",
        "description": "Transferencia a contacto",
        "counterparty": "Juan Pérez",
        "created_at": datetime(2026, 9, 29, 9, 10, tzinfo=timezone.utc),
    },
    {
        "id": "pay_1003",
        "amount": 980.50,
        "currency": "USD",
        "status": "failed",
        "method": "bank_transfer",
        "description": "Pago de servicio - intento fallido",
        "counterparty": "Compañía Eléctrica Nacional",
        "created_at": datetime(2026, 9, 30, 18, 5, tzinfo=timezone.utc),
    },
    {
        "id": "pay_1004",
        "amount": 60.00,
        "currency": "USD",
        "status": "refunded",
        "method": "card",
        "description": "Reembolso de compra cancelada",
        "counterparty": "Luma Store",
        "created_at": datetime(2026, 10, 1, 11, 47, tzinfo=timezone.utc),
    },
    {
        "id": "pay_1005",
        "amount": 300.00,
        "currency": "USD",
        "status": "completed",
        "method": "bank_transfer",
        "description": "Pago de arriendo",
        "counterparty": "Inmobiliaria del Sur",
        "created_at": datetime(2026, 10, 2, 8, 0, tzinfo=timezone.utc),
    },
]
