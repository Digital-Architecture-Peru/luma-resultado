# Banca por Internet · Consulta de Pagos (candidate)

Capacidad de **solo lectura**: listar pagos de un cliente (filtros por fecha y estado, paginado) y ver el detalle.
Stack: React + TypeScript (Vite, Atomic Design) · Java 17 + Quarkus 3.15 · PostgreSQL (Flyway). Datos ficticios.

## Estructura
- `backend/` Quarkus: `api` (resource, DTO, mapeo de errores) → `service` → `persistence` (interfaz `PaymentRepository` + `JdbcPaymentRepository` con `PreparedStatement`).
- `backend/src/main/resources/db/migration/` `V1__schema.sql` (tabla `payment`, índices) y `V2__seed_ficticio.sql`.
- `frontend/src/components/{atoms,molecules,organisms,templates}`, `pages/PaymentsPage.tsx`, `services/paymentsApi.ts`.

## API
- `GET /api/v1/payments?from=AAAA-MM-DD&to=AAAA-MM-DD&status=PENDING|COMPLETED|REJECTED&page=0&size=20` → `{items,page,size,total}`
- `GET /api/v1/payments/{id}`
- Header `X-Customer-Id` obligatorio (identidad **simulada**, ej. `CUST-0001`). Errores: `{code,message}` con 400/404.
- Montos como string decimal + `currency`. Cuentas del beneficiario enmascaradas.

## Build y pruebas
```
cd backend  && mvn package        # compila y ejecuta pruebas unitarias (JUnit 5)
cd frontend && npm install && npm run build && npm test   # tsc + vite build; vitest run
```

## Ejecución
Backend (PostgreSQL ≥ 13 local; Flyway migra al arrancar). Variables de entorno, sin secretos en el repo:
```
QUARKUS_DATASOURCE_JDBC_URL=jdbc:postgresql://localhost:5432/payments
QUARKUS_DATASOURCE_USERNAME=payments
QUARKUS_DATASOURCE_PASSWORD=<definir en el entorno>
mvn quarkus:dev
```
Si Docker está disponible, Quarkus Dev Services puede levantar la BD sin definir la URL.
Frontend: `VITE_API_BASE_URL` (por defecto `http://localhost:8080`) y `VITE_CUSTOMER_ID` (por defecto `CUST-0001`); `npm run dev` (puerto 5173; CORS habilitado solo en perfil dev).

## Integración y persistencia
- Integración: **sin definir**. El core bancario real se sustituye por la tabla `payment` con datos ficticios; basta otra implementación de `PaymentRepository`.
- Persistencia: PostgreSQL, migraciones versionadas, índices `(customer_id, executed_at DESC)` y `(customer_id, status)`.
- Seguridad: el header `X-Customer-Id` no es autenticación; en producción tomar la identidad del token (OIDC).

## Límites
Solo pruebas unitarias (service con repositorio en memoria, DTO, API client y componentes). Sin pruebas con base de datos ni E2E.
