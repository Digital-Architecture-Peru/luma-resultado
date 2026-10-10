# Notificaciones de Pagos – Banca por Internet (candidate)

Capacidad de notificaciones in-app sobre eventos de pago: `PAGO_EXITOSO`, `PAGO_RECHAZADO` y `PAGO_PROGRAMADO_PROXIMO`.
Angular 17 (Atomic Design) + Java 17 + Quarkus 3.15 + PostgreSQL. Todos los datos son ficticios.

## Estructura
- `backend/`: Quarkus. `api → service → port → adapter` (Panache con parámetros nombrados). Migraciones Flyway en `src/main/resources/db/migration` (`V1__schema.sql`, `V2__seed_ficticio.sql`).
- `frontend/`: Angular standalone. `atoms/`, `molecules/`, `organisms/`, `templates/`, `pages/`, `core/`.

## Backend
```
cd backend
mvn test         # pruebas unitarias (JUnit 5, sin base de datos)
mvn package
mvn quarkus:dev
```
Variables de entorno (sin secretos en el repo):
| Variable | Uso |
|---|---|
| `QUARKUS_DATASOURCE_JDBC_URL` | por defecto `jdbc:postgresql://localhost:5432/notifications` |
| `QUARKUS_DATASOURCE_USERNAME` / `QUARKUS_DATASOURCE_PASSWORD` | credenciales de PostgreSQL |
| `CORS_ORIGINS` | por defecto `http://localhost:4200` |
| `PORT`, `LOG_LEVEL` | puerto y nivel de log |

Flyway aplica el esquema y el seed al arrancar. Salud: `/q/health`.

## API v1
- `GET /api/v1/payment-notifications?status=UNREAD&page=0&size=20` → `200 {items[], total}`
- `PATCH /api/v1/payment-notifications/{id}/read` → `204` o `404`
- `POST /api/v1/payment-notifications` (interno, simula el evento) → `201` o `409` si el par `(paymentReference, type)` ya existe
- Cabecera `X-Customer-Id` obligatoria (sustituye a la autenticación real, fuera de alcance). Errores: `{code, message}`.

## Frontend
```
cd frontend
npm install
npm test         # Jest (jest-preset-angular), una sola pasada
npm run build
npm start        # http://localhost:4200, proxy /api → http://localhost:8080
```
Consulta periódica cada 30 s (evolución posible: SSE).

## Integración (sin definir)
El origen real de los eventos de pago no está definido: se simula con el `POST`. El envío por otros canales (email/SMS) queda tras el puerto `NotificationChannel`, con la implementación `FakeChannel`.

## Persistencia (PostgreSQL)
Tabla `payment_notification`: importes `NUMERIC(15,2)`, `UNIQUE(payment_reference, type)` para idempotencia e índice `(customer_id, status, created_at DESC)`. El número de cuenta se enmascara (`****1234`) y no se guarda.

## No verificado
Compilación y pruebas (Maven y npm no ejecutados), ejecución del SQL contra PostgreSQL, arranque de Quarkus y contrato real de integración.
