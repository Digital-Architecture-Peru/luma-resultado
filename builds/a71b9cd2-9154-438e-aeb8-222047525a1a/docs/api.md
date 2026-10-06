# Contrato de API - Consulta de Pagos (v1)

Formato de error uniforme: `application/problem+json` con los campos
`type`, `title`, `status`, `detail`, `instance`, `correlationId`.

## GET /v1/payments

Lista pagos con filtros y paginación.

### Query params
| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| status | enum: pending, completed, failed, refunded | no | Filtra por estado |
| method | enum: card, bank_transfer, wallet | no | Filtra por método |
| date_from | datetime ISO-8601 | no | Fecha mínima (inclusive) |
| date_to | datetime ISO-8601 | no | Fecha máxima (inclusive) |
| page | int, >=1, default 1 | no | Número de página |
| page_size | int, 1-100, default 20 | no | Tamaño de página |

### Respuesta 200
```json
{
  "items": [
    {
      "id": "pay_1001",
      "amount": 149.9,
      "currency": "USD",
      "status": "completed",
      "method": "card",
      "description": "Compra en tienda Luma Store",
      "counterparty": "Luma Store",
      "created_at": "2026-09-28T14:32:00+00:00"
    }
  ],
  "page": 1,
  "page_size": 20,
  "total": 5
}
```

### Errores
- `422` parámetros inválidos (p. ej. `page_size=0`).
- `502` el proveedor externo falló o no respondió a tiempo.

## GET /v1/payments/{payment_id}

Obtiene el detalle de un pago.

### Respuesta 200
```json
{
  "id": "pay_1001",
  "amount": 149.9,
  "currency": "USD",
  "status": "completed",
  "method": "card",
  "description": "Compra en tienda Luma Store",
  "counterparty": "Luma Store",
  "created_at": "2026-09-28T14:32:00+00:00"
}
```

### Errores
- `404` el pago no existe:
```json
{
  "type": "about:blank",
  "title": "Payment not found",
  "status": 404,
  "detail": "Payment 'does-not-exist' not found",
  "instance": "/v1/payments/does-not-exist",
  "correlationId": "c6c1f2e0-..."
}
```
- `502` el proveedor externo falló o no respondió a tiempo.

## GET /health y GET /ready

Endpoints de observabilidad (liveness/readiness). Ver skill
`observability-logging`.

## Integración con proveedor externo

Toda llamada al dominio Pagos pasa por la interfaz `PaymentGatewayClient`
(`app/clients/base.py`). Hay dos implementaciones:
- `FakePaymentGatewayClient`: datos ficticios en memoria, usada por
  defecto (`USE_FAKE_GATEWAY=true`) y en todas las pruebas.
- `ExternalPaymentGatewayClient`: cliente HTTP real (httpx) hacia
  `PAYMENT_GATEWAY_BASE_URL`, sin ejecutar ni validar contra una red real
  en este entorno.

## Persistencia

No se requiere persistencia propia: la API es de solo consulta y delega
el estado de los pagos en el proveedor externo (o en los datos ficticios
en memoria mientras no haya proveedor configurado).
