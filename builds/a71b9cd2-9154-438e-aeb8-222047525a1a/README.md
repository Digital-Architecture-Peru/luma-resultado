# Payments Query API (Python + FastAPI)

API REST de **consulta** sobre el dominio **Pagos**, pensada para su consumo
desde la **app móvil**. Patrón: API REST. Integración: proveedor externo de
pagos (API externa) detrás de una interfaz (`PaymentGatewayClient`).
Persistencia: **no requerida** (la API es de solo lectura; el estado vive en
el proveedor externo o en datos ficticios en memoria mientras no haya uno
configurado).

## Estructura

```
app/
  main.py                   # Punto de entrada FastAPI
  core/
    config.py               # Settings (variables de entorno)
    correlation.py           # Correlation-id por request
    logging.py               # Logging estructurado
    exceptions.py            # Errores de dominio -> problem+json
    timeutils.py             # Normalización de fechas a UTC
  schemas/
    payments.py              # Modelos Pydantic (contrato)
  clients/
    base.py                  # Interfaz PaymentGatewayClient
    fake_payment_client.py   # Implementación en memoria (datos ficticios)
    external_payment_client.py  # Cliente HTTP real (httpx) al proveedor externo
    fixtures.py               # Datos ficticios
    dependency.py             # Fábrica/Depends que elige real vs. falso
  services/
    payment_service.py       # Casos de uso de consulta
  routers/
    payments.py               # GET /v1/payments, GET /v1/payments/{id}
    health.py                 # GET /health, GET /ready
tests/
  test_payments_api.py        # Pruebas de API (TestClient)
  test_payment_service.py     # Pruebas unitarias de servicio
  test_config.py              # Pruebas unitarias de configuración
  conftest.py                 # Fixtures compartidos (override del cliente por el falso)
docs/
  api.md                      # Contrato de la API con ejemplos
pyproject.toml                 # Manifiesto de dependencias y build
env.example.txt                 # Plantilla de variables de entorno (sin secretos)
```

## Build / instalación

Requiere Python 3.11+.

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
```

Instala el paquete `app` en modo editable junto con las dependencias de
desarrollo (`pytest`, `pytest-asyncio`, `coverage`), todas con versión
fijada en `pyproject.toml`.

## Configuración (variables de entorno)

Copiar la plantilla y ajustar valores (sin credenciales reales en el repo):

```bash
cp env.example.txt .env
```

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `ENVIRONMENT` | Nombre del entorno | `development` |
| `LOG_LEVEL` | Nivel de logging | `INFO` |
| `USE_FAKE_GATEWAY` | Usa datos ficticios en memoria en vez del proveedor real | `true` |
| `PAYMENT_GATEWAY_BASE_URL` | URL base del proveedor externo de pagos | *(vacío)* |
| `PAYMENT_GATEWAY_API_KEY` | API key del proveedor externo | *(vacío)* |
| `PAYMENT_GATEWAY_TIMEOUT_SECONDS` | Timeout de las llamadas al proveedor | `5` |
| `DEFAULT_PAGE_SIZE` / `MAX_PAGE_SIZE` | Límites de paginación | `20` / `100` |

Sin `PAYMENT_GATEWAY_BASE_URL` configurado (o con `USE_FAKE_GATEWAY=true`,
valor por defecto), la API responde con datos ficticios en memoria
(`app/clients/fixtures.py`) y **no realiza ninguna llamada de red real**.

## Ejecución local

```bash
uvicorn app.main:app --reload --port 8000
```

Documentación interactiva (OpenAPI/Swagger) una vez levantado:
`http://localhost:8000/docs` (ReDoc en `/redoc`).

Endpoints principales:
- `GET /v1/payments` — lista de pagos con filtros (`status`, `method`,
  `date_from`, `date_to`) y paginación (`page`, `page_size`).
- `GET /v1/payments/{payment_id}` — detalle de un pago.
- `GET /health`, `GET /ready` — observabilidad.

## Pruebas

```bash
pytest
```

Con cobertura:

```bash
coverage run -m pytest && coverage report
```

Incluye:
- **Unitarias**: `tests/test_payment_service.py` (casos de uso de
  paginación/filtrado), `tests/test_config.py` (lectura de settings).
- **API** (contrato HTTP con `TestClient`): `tests/test_payments_api.py`.

Todas las pruebas sobreescriben la dependencia `get_payment_gateway_client`
con `FakePaymentGatewayClient` (ver `tests/conftest.py`), por lo que son
deterministas, no dependen de servicios externos y no requieren red real.

## Contrato de API

Ver [`docs/api.md`](docs/api.md): recursos, parámetros de consulta, códigos
de estado, formato de error uniforme (`application/problem+json`) y
ejemplos de petición/respuesta.

## Integración con proveedor externo (API externa)

Toda llamada al dominio Pagos pasa por la interfaz `PaymentGatewayClient`
(`app/clients/base.py`), con dos implementaciones intercambiables mediante
`app/clients/dependency.py`:
- `FakePaymentGatewayClient`: datos ficticios en memoria, usada por defecto
  y en todas las pruebas.
- `ExternalPaymentGatewayClient`: cliente HTTP real con `httpx` hacia
  `PAYMENT_GATEWAY_BASE_URL`, mapeando fallos de red/timeout/HTTP a un
  error `502` uniforme (`ExternalGatewayError`). **No se probó contra un
  proveedor real** en este entorno; su contrato debe validarse en CI/CD con
  credenciales reales antes de producción.

## Persistencia

No se requiere base de datos propia: la API es de solo consulta y delega
el estado de los pagos en el proveedor externo; mientras no esté
configurado, se usa el conjunto de datos ficticios en memoria
(`app/clients/fixtures.py`), aislado detrás de la interfaz de repositorio
`PaymentGatewayClient`.

## Observabilidad

- `GET /health`: liveness.
- `GET /ready`: readiness (indica si hay proveedor configurado o si está
  activo el modo falso).
- Logs estructurados con `correlation_id`, propagado también en el header
  de respuesta `X-Correlation-Id` y en los errores `problem+json`
  (`instance`/`correlationId`).
- Manejo centralizado de errores en `app/core/exceptions.py`
  (`PaymentNotFoundError` → 404, `ExternalGatewayError` → 502, excepción
  genérica → 500), sin exponer trazas internas.

## Controles de seguridad aplicados (secure-coding)

- Entradas de query validadas por Pydantic/FastAPI (tipos, enums, rangos
  de paginación `page >= 1`, `1 <= page_size <= 100`).
- Sin cadenas de conexión ni credenciales en el código; todo por variables
  de entorno (`env.example.txt` sin valores reales).
- El header `Authorization` hacia el proveedor externo nunca se registra
  en logs (ver `external_payment_client.py`).
- Dependencias con versión fijada en `pyproject.toml`.
- Errores uniformes sin exponer trazas internas (`problem+json`).
- Logs sin datos sensibles (no se registran cuerpos de petición/respuesta
  completos ni cabeceras de autorización).

## Límites y qué NO se verificó en este entorno

- **No se ejecutó** `pip install`, `pytest` ni `uvicorn` en este host: no
  hay shell ni red disponibles para el agente constructor. Solo se
  verificó la sintaxis de los archivos Python mediante lectura cuidadosa;
  no se corrió un linter/parser automático.
- El cliente real (`ExternalPaymentGatewayClient`) **no se probó contra un
  proveedor real**: su contrato HTTP debe validarse en CI/CD con
  credenciales reales antes de producción.
- No se afirma que el proyecto "compila" o que "las pruebas pasan"; ambas
  cosas quedan pendientes de una build real (CI) con Python 3.11+
  instalado.
