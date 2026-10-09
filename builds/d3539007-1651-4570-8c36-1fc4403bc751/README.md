# Transaccion de Tarjetas · Banca por Internet (candidate)

Full Stack: Angular 17 (Atomic Design) + Java 17 / Spring Boot 3 (hexagonal) + PostgreSQL. Datos ficticios.

## Requisitos
Java 17, Maven, Node 18.19+/20, PostgreSQL con base `cards`.

## Backend
```
export DB_URL=jdbc:postgresql://localhost:5432/cards DB_USER=<usuario> DB_PASSWORD=<clave>
cd backend && mvn test          # pruebas unitarias (sin BD)
mvn spring-boot:run             # Flyway aplica V1 (esquema) y V2 (seed ficticio)
```
Variables: ver `.env.example`. No hay secretos en el repositorio.

## Frontend
```
cd frontend && npm install && npm test && npm run build
npm start                       # proxy /api -> http://localhost:8080
```

## API
- `GET /api/v1/cards`
- `POST /api/v1/cards/{id}/transactions` (encabezado `Idempotency-Key` obligatorio) -> 201 `{transactionId,status}`
- `GET /api/v1/cards/{id}/transactions?page&size`
- Errores RFC 7807: 400, 404, 409 (idempotencia), 422 (regla de negocio).

## Integracion (sin definir)
Puerto `CardNetworkPort` con `StubCardNetworkAdapter` (aprueba montos > 0 y <= 100000). Reemplazable sin tocar el dominio.

## Persistencia
PostgreSQL via `NamedParameterJdbcTemplate` (consultas parametrizadas) y migraciones Flyway en `backend/src/main/resources/db/migration`. El debito de saldo es atomico (`UPDATE ... WHERE available_balance >= :amount`).

## Hipotesis y limites
- H1 "Transaccion" = consumo/pago sobre tarjeta que descuenta saldo disponible (no confirmado).
- Autenticacion simulada con `DEMO_CUSTOMER_ID`; moneda unica sin FX.
- Candidate: no ejecutado contra PostgreSQL real; compilacion y pruebas sin verificar.
