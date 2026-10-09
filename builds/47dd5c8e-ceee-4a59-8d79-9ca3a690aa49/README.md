# Consulta de Pagos – Banca por Internet (candidate)

Capacidad de solo lectura: historial de pagos con filtros por estado y fechas.
Angular 17 (Atomic Design) + Spring Boot 3.3 / Java 17 + PostgreSQL.

## Estructura
- `backend/`: API `GET /api/v1/pagos` (filtros `estado`, `desde`, `hasta`, `page`, `size`≤100) y `GET /api/v1/pagos/{id}`. Capas controller → service → `PagoRepository` (JDBC parametrizado). Errores como `ProblemDetail`. `/actuator/health` para salud.
- `frontend/`: atoms (`badge-estado`), molecules (`fila-pago`, `filtros-pagos`), organisms (`tabla-pagos`), templates (`template-consulta`), page (`consulta-pagos`).

## Backend
Variables de entorno: `DB_URL` (por defecto `jdbc:postgresql://localhost:5432/banca`), `DB_USER` (por defecto `banca_app`), `DB_PASSWORD` (obligatoria, sin valor por defecto), `SERVER_PORT`, `LOG_LEVEL`.
```
cd backend
mvn test            # pruebas unitarias (JUnit 5 + Mockito, sin BD)
DB_PASSWORD=... mvn spring-boot:run
```
Flyway aplica `V1__schema.sql` (tabla `pago`, índice `ix_pago_cliente_fecha`) y `V2__seed_ficticio.sql` (datos ficticios, cuentas enmascaradas).

## Frontend
```
cd frontend
npm install
npm test            # Jest, una sola pasada
npm run build
npm start           # proxy /api -> http://localhost:8080
```

## Integración (sin definir)
`ConsultaPagosExternaPort` + stub vacío: no se llama a sistemas reales.

## Advertencias
- La identidad del cliente es **simulada** (header `X-Cliente-Id`, valor en `environment.ts`). Debe sustituirse por la autenticación real de Banca por Internet antes de cualquier uso real.
- Sin verificar contra un PostgreSQL real ni compilado en este entorno.
