# Notificaciones de Tarjetas · Banca por Internet

Capacidad *Notificación* sobre el dominio *Tarjetas*. Monorepo:

- `backend/`: Java 17 + Spring Boot 3.3 (Maven), PostgreSQL con Flyway.
- `frontend/`: Angular 20 (standalone, zoneless) organizado con Atomic Design.

## Arquitectura
- Backend en capas `api → application → domain ← infrastructure`. El dominio no depende de Spring.
- Puerto `NotificationRepository` (adaptador `JdbcNotificationRepository`, consultas parametrizadas con `NamedParameterJdbcTemplate`).
- Puerto `NotificationDispatcher` (adaptador `LoggingDispatcher`): **la integración de entrega está sin definir**; el adaptador solo escribe un log sin el mensaje. Para integrar un canal real, implementar el puerto.
- Frontend: `atoms/` (badge, button, type-icon), `molecules/` (notification-item), `organisms/` (notification-list, notification-bell), `templates/` (layout), `pages/` y `data/` (modelo y servicio HTTP).

## API v1
| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/v1/cards/{cardRef}/notifications?status=&page=&size=` | Página `{items, page, size, total}` (size 1–50) |
| GET | `/api/v1/notifications/unread-count` | `{count}` |
| PATCH | `/api/v1/notifications/{id}/read` | 204 o 404 |

Todas requieren la cabecera `X-Customer-Ref` (hipótesis: la autenticación real la aporta la plataforma de Banca por Internet). Errores en `ProblemDetail` (RFC 7807).

## Persistencia (PostgreSQL)
Tabla `card_notification` con CHECK en tipo y estado e índices `(customer_ref, status, created_at DESC)` y `(card_ref, created_at DESC)`. Solo se guarda el token de tarjeta y `last4`, nunca el PAN. Migraciones: `V1__schema.sql` y `V2__seed.sql` (datos ficticios; tarjeta de demo `CARD-TOK-0001`, cliente `CUST-0001`).

Variables de entorno (ver `backend/env.example`): `DB_URL`, `DB_USER`, `DB_PASSWORD`, `PORT`, `LOG_LEVEL`. No hay credenciales en el repositorio.

## Compilar y ejecutar
```bash
# Backend (requiere JDK 17+, Maven y PostgreSQL)
cd backend
export DB_URL=jdbc:postgresql://localhost:5432/notifications DB_USER=... DB_PASSWORD=...
mvn test
mvn spring-boot:run

# Frontend (requiere Node 20+)
cd frontend
npm install
npm test        # ng test --watch=false (Vitest, una sola pasada)
npm run build
npm start       # proxy /api → http://localhost:8080
```

## Pruebas
Unitarias: `NotificationServiceTest`, `NotificationResponseTest` (JUnit 5 + Mockito) y specs de Angular para servicio HTTP, item y lista. No se prueba contra PostgreSQL real.

## Hipótesis y límites
- Tipos de notificación supuestos: `TRANSACTION`, `PAYMENT_DUE`, `LIMIT_REACHED`, `CARD_BLOCKED`.
- Sin push en tiempo real (WebSocket/SSE fuera de alcance).
- La tarjeta mostrada en el frontend es fija (`CARD-TOK-0001`) hasta integrarse con el selector de tarjetas de la plataforma.
