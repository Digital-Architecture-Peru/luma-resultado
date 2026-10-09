# Pagos · Transacción (Banca por Internet) — candidate

Full Stack: React 18 + TypeScript (Atomic Design) · .NET 8 (Domain/Application/Infrastructure/Api) · PostgreSQL.
Datos ficticios; sin credenciales. Autenticación fuera de alcance (la resuelve el host de Banca por Internet).

## Estructura
- `frontend/` Vite + React; `atoms → molecules → organisms → templates → pages`, `services/`, `hooks/`.
- `backend/` solución `Payments.sln` con `src/Payments.*` y `tests/Payments.UnitTests` (xUnit).
- `db/migrations/` `V001__schema.sql`, `V002__seed.sql` (PostgreSQL 13+).

## Configuración (ver `env.example`)
`ConnectionStrings__Payments` (cadena Npgsql), `Payments__MaxAmount`, `DB_PASSWORD` (solo docker-compose), `VITE_API_BASE_URL`, `VITE_PROXY_TARGET`.

## Ejecutar
```
export DB_PASSWORD=<local>            # no versionar
docker compose up -d db               # aplica db/migrations al primer arranque
export ConnectionStrings__Payments="Host=localhost;Database=payments;Username=payments;Password=$DB_PASSWORD"
dotnet run --project backend/src/Payments.Api --urls http://localhost:5080
cd frontend && npm install && npm run dev
```

## Build y pruebas
```
cd backend && dotnet build && dotnet test
cd frontend && npm install && npm run build && npm test
```

## API
- `GET /api/accounts`
- `POST /api/payments` con header `Idempotency-Key` (≤64) y body `{sourceAccountId, beneficiaryAccount, amount, currency, reference}` → `201 {id,status,...}`; `400` validación; `409` clave repetida con otro payload; misma clave y payload devuelve el pago original.
- `GET /api/payments/{id}`; `GET /health`.

## Integración (sin definir)
`IPaymentGateway` aísla el sistema externo; `FakePaymentGateway` es determinista y rechaza beneficiarios terminados en `0000`.

## Persistencia
Dapper + Npgsql con SQL parametrizado tras `IPaymentRepository`. El débito usa `UPDATE ... WHERE balance >= @Amount` en la misma transacción que el INSERT; `idempotency_key` es UNIQUE.

## No verificado
Compilación, pruebas, SQL contra PostgreSQL real y pruebas de integración con la BD (solo hay unitarias). Sin lockfile de npm. Pendiente alinear con estándares corporativos (SGC en fallback).
