# Consulta de Cuentas · Banca por Internet

Full Stack candidate: React + TypeScript (Atomic Design) y Java + Quarkus con PostgreSQL. Solo lectura, datos ficticios.

## Estructura
- `frontend/`: Vite + React + TS. Atoms / molecules / organisms / templates / pages. Cliente HTTP aislado en `src/api`.
- `backend/`: Quarkus. Resource → `AccountQueryService` → `AccountRepository` (interfaz) → `JdbcAccountRepository` (JDBC parametrizado).
- Migraciones Flyway en `backend/src/main/resources/db/migration` (`V1__schema.sql`, `V2__seed.sql`).

## API
- `GET /api/v1/accounts?page=0&size=20` (size máx. 50)
- `GET /api/v1/accounts/{id}`
- Cabecera `X-Customer-Id` (marcador provisional; la autenticación real la resolvería un gateway externo, sin definir). Todas las consultas filtran por ese cliente.
- Número de cuenta enmascarado (`****1234`); saldo como string decimal. Errores en `application/problem+json`.
- `/q/health` disponible.

## Variables de entorno
Backend: `QUARKUS_DATASOURCE_JDBC_URL` (por defecto `jdbc:postgresql://localhost:5432/banca`), `QUARKUS_DATASOURCE_USERNAME`, `QUARKUS_DATASOURCE_PASSWORD`, `CORS_ORIGINS`, `LOG_LEVEL`.
Frontend: `VITE_API_BASE_URL`, `VITE_CUSTOMER_ID` (ver `frontend/.env.example`).

## Build y pruebas
```
cd backend  && mvn test        # JUnit 5 + Mockito, sin base de datos
cd backend  && mvn quarkus:dev # requiere PostgreSQL y variables de entorno
cd frontend && npm install && npm test && npm run build && npm run dev
```

## Integración y persistencia
- Integración con el core bancario: sin definir; solo existe el puerto `AccountRepository`.
- Persistencia: PostgreSQL (`account`, `NUMERIC(18,2)`, índice por `customer_id`, restricciones CHECK).

## Estado
No se ha ejecutado compilación ni pruebas en este entorno de generación.
