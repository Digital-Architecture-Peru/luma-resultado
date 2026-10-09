# Transacción de Tarjetas · Banca por Internet (candidate)

Pago de tarjeta de crédito desde una cuenta propia y consulta de movimientos. Datos 100 % ficticios.

- `backend/`: Java 17 + Spring Boot 3.2 + PostgreSQL (Flyway, `NamedParameterJdbcTemplate`).
- `frontend/`: React 18 + TypeScript + Vite, Atomic Design (`atoms → molecules → organisms → templates → pages`).

## Variables de entorno
| Variable | Capa | Por defecto |
|---|---|---|
| `DB_URL` | backend | `jdbc:postgresql://localhost:5432/cards` |
| `DB_USER`, `DB_PASSWORD` | backend | sin valor (obligatorias, nunca se versionan) |
| `PORT` | backend | `8080` |
| `CORS_ALLOWED_ORIGIN` | backend | `http://localhost:5173` |
| `LOG_LEVEL` | backend | `INFO` |
| `VITE_API_BASE_URL` | frontend | `http://localhost:8080` |
| `VITE_CUSTOMER_ID` | frontend | `cust-001` (ficticio) |

## Ejecutar
```bash
# Cree una BD PostgreSQL vacía "cards"; Flyway aplica V1 (esquema) y V2 (seed ficticio).
cd backend
export DB_USER=... DB_PASSWORD=...
mvn spring-boot:run

cd ../frontend
npm install
npm run dev        # http://localhost:5173
```

## Pruebas unitarias
```bash
cd backend && mvn test        # JUnit 5 + Mockito (PaymentService) y @WebMvcTest (CardController)
cd frontend && npm test       # Vitest + Testing Library (atoms, organisms, validación, cliente API)
cd frontend && npm run build  # type-check + build
```

## API v1 (header `X-Customer-Id`, ficticio: la autenticación la resuelve Banca por Internet)
| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/v1/cards` | Tarjetas enmascaradas (`last4`) |
| GET | `/api/v1/accounts` | Cuentas de origen (añadido al contrato para poblar el formulario) |
| GET | `/api/v1/cards/{id}/transactions?page=&size=` | Movimientos paginados |
| POST | `/api/v1/cards/{id}/payments` + `Idempotency-Key` | `201`; `409` clave duplicada o conflicto de concurrencia; `422` saldo insuficiente / monto inválido |

Los montos viajan como string (`"150.00"`). Errores en formato RFC 7807. Health: `/actuator/health`.

## Integración (sin definir)
`CoreBankingPort` aísla el core bancario; `FakeCoreBankingAdapter` acepta todo. Un adaptador real implementa esa interfaz sin tocar el dominio.

## Persistencia (PostgreSQL)
Tablas `card`, `account`, `card_transaction` (migraciones en `backend/src/main/resources/db/migration`). Bloqueo optimista con `version`; `idempotency_key` UNIQUE; solo se guardan los últimos 4 dígitos de la tarjeta.

## Límites
Sin pruebas de integración ni E2E; SQL de PostgreSQL con revisión estática; restricciones SGC no validadas (fallback).
