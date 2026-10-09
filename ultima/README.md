# Transferencias entre cuentas propias · Banca por Internet (candidate)

Full Stack: **Angular 17** (`frontend/`, Atomic Design) + **Java 17 / Quarkus 3.15** (`backend/`) + **PostgreSQL**.
Todos los datos son ficticios; no hay autenticación (el titular es `APP_OWNER_ID`, por defecto `demo-owner`).

## Alcance (hipótesis)
"Transacción" = transferencia entre cuentas propias del mismo titular, misma moneda, sin FX, sin terceros ni otros bancos.
La integración con un core bancario está **sin definir**: no existe adaptador real; el acceso a datos está detrás de
`AccountRepository` / `TransferRepository` (implementación PostgreSQL en `persistence/pg`).

## Backend
```bash
cd backend
mvn test            # pruebas unitarias (fakes en memoria, sin BD)
mvn package         # compila y empaqueta
mvn quarkus:dev     # requiere PostgreSQL y las variables de .env.example
```
Variables (ver `.env.example`): `QUARKUS_DATASOURCE_JDBC_URL`, `QUARKUS_DATASOURCE_USERNAME`,
`QUARKUS_DATASOURCE_PASSWORD`, `CORS_ORIGINS`, `APP_OWNER_ID`, `LOG_LEVEL`, `PORT`.
Flyway aplica al arrancar `V1__schema.sql` (esquema, índices, CHECKs) y `V2__seed_ficticio.sql`.

### API (`/api/v1`)
- `GET /accounts`: cuentas del titular.
- `POST /transfers` con cabecera `Idempotency-Key`; cuerpo `{sourceAccountId, targetAccountId, amount, currency, description}` (monto como string decimal).
  `201` ok · `400` validación · `404` cuenta inexistente/ajena · `409` clave reutilizada con otro payload · `422` saldo insuficiente, misma cuenta o moneda distinta.
- `GET /accounts/{id}/movements?page=0&size=20`.
Errores en `application/problem+json`. Un reintento idéntico devuelve la transferencia original (también `201`).

Decisiones: débito y crédito en una sola `@Transactional`; cuentas bloqueadas con `SELECT ... FOR UPDATE` ordenadas por id; montos `NUMERIC(19,2)`/`BigDecimal`; SQL parametrizado.

## Frontend
```bash
cd frontend
npm install
npm test            # Jest + jest-preset-angular (una pasada)
npm run build       # type-check + build de Angular
npm start           # ng serve con proxy /api -> http://localhost:8080
```
Estructura: `atoms/` (app-button, field-error, amount-input), `molecules/` (account-selector, amount-field),
`organisms/` (transfer-form, movements-table), `templates/` (transaction-layout), `pages/` (transfer-page), `core/` (servicios, modelos).
La URL base de la API es `/api/v1` (token `API_BASE_URL`); en desarrollo la resuelve `proxy.conf.json`.

## Límites
- Nada se compiló ni ejecutó al escribir estos archivos: build y pruebas **sin verificar** hasta correr `mvn test` y `npm test`.
- Sin pruebas de integración ni de concurrencia (faltan Testcontainers para validar `FOR UPDATE` y la restricción UNIQUE de idempotencia).
- Una carrera de dos peticiones con la misma clave nueva terminaría en error 500 por la UNIQUE (no hay mapeo específico).
- Interpretación de "Transacción" por validar con negocio.
