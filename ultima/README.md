# Notificación de Pagos · Banca por Internet

Full Stack (candidate): **Quarkus 3 (Java 17)** + **React 18 + TypeScript (Vite)** + **PostgreSQL**. Datos ficticios, sin secretos.

## Estructura
- `backend/`: `api` (recursos REST) → `service` → `port` (`NotificationRepository`) → `adapter/jdbc` (JDBC parametrizado). Migraciones Flyway en `src/main/resources/db/migration`.
- `frontend/`: Atomic Design (`atoms`, `molecules`, `organisms`, `templates`, `pages`), cliente API tipado (`api/`) y hook `useNotifications` (polling cada 30 s).

## Ejecución
```bash
# Base de datos local (la contraseña viene del entorno)
export DB_PASSWORD=<elige-una>
docker compose up -d db

# Backend
cd backend
export QUARKUS_DATASOURCE_PASSWORD=$DB_PASSWORD   # ver .env.example
mvn quarkus:dev          # arranca y aplica V1 (esquema) y V2 (seed ficticio)
mvn test                 # pruebas unitarias (JUnit 5, sin base de datos)

# Frontend
cd frontend
npm install
npm run dev              # http://localhost:5173
npm test                 # Vitest + Testing Library
npm run build            # tsc --noEmit && vite build
```

## Variables de entorno
Backend: `QUARKUS_DATASOURCE_JDBC_URL`, `QUARKUS_DATASOURCE_USERNAME`, `QUARKUS_DATASOURCE_PASSWORD`, `CORS_ORIGINS`, `PORT`, `LOG_LEVEL`. Frontend: `VITE_API_URL`, `VITE_CUSTOMER_ID`.

## API v1
| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/v1/notifications?status=unread\|all&limit=20` | 200 `NotificationDto[]` |
| GET | `/api/v1/notifications/unread-count` | 200 `{count}` |
| PATCH | `/api/v1/notifications/{id}/read` | 204 / 404 si no es del cliente |
| POST | `/api/v1/notifications` (interno, simula evento de pago) | 201 / 400 / 409 duplicado |

Todas requieren la cabecera `X-Customer-Id`. Errores en `application/problem+json`. Salud: `/q/health`.

## Persistencia (PostgreSQL)
Tabla `notification` con `UNIQUE(payment_id, type)` (idempotencia), índice `(customer_id, created_at DESC)` e índice parcial de no leídas. Importes `NUMERIC(15,2)` / `BigDecimal`. Solo se guardan los últimos 4 dígitos de la cuenta. Todas las consultas filtran por `customer_id`.

## Integración (sin definir) y alcance
- El origen de los eventos de pago no está definido: se simula con `POST /api/v1/notifications` y el seed.
- Solo canal in-app (sin email/SMS/push). Evolución prevista: SSE/WebSocket.
- `X-Customer-Id` es un sustituto temporal; la autenticación real (OIDC) queda pendiente. El `POST` interno debe protegerse antes de exponerlo.
