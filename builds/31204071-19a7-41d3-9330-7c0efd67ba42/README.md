# Notificaciones de Tarjetas · Banca por Internet

Capacidad **Notificación** sobre el dominio **Tarjetas**: centro de notificaciones (lista paginada, filtro de no leídas, marcar como leída) y preferencias de aviso por tarjeta.

> Estado: **candidate**. El código no se ha compilado ni ejecutado en este entorno; no está listo para producción.

## Estructura

```
backend/    Quarkus 3.15 · Java 17 · Maven · PostgreSQL (Flyway)
frontend/   React 18 · TypeScript · Vite · Vitest (Atomic Design)
docker-compose.yml   PostgreSQL local (solo desarrollo)
```

### Backend (capas)
`api` (recurso REST, DTOs, errores) → `service` (casos de uso, validación, propiedad de tarjeta) → `port` (interfaces) → `adapter` (JDBC con consultas parametrizadas, stub de propiedad, reloj).

### Frontend (Atomic Design)
`atoms` (Badge, Icon, Toggle) → `molecules` (NotificationItem, PreferenceRow, Pager) → `organisms` (NotificationList, PreferencesPanel) → `templates` (CardNotificationsLayout) → `pages` (CardNotificationsPage). Cliente HTTP tipado en `src/api`, hooks de estado remoto en `src/hooks`.

## Variables de entorno

Backend (no se incluyen valores reales; defínelas en tu entorno o en un `.env` local ignorado por git):

| Variable | Descripción | Por defecto |
|---|---|---|
| `QUARKUS_DATASOURCE_JDBC_URL` | URL JDBC de PostgreSQL | `jdbc:postgresql://localhost:5432/cards_notifications` |
| `QUARKUS_DATASOURCE_USERNAME` | Usuario de la base | (obligatoria) |
| `QUARKUS_DATASOURCE_PASSWORD` | Contraseña de la base | (obligatoria) |
| `DB_POOL_MAX_SIZE` | Tamaño máximo del pool | `10` |
| `FLYWAY_LOCATIONS` | Ubicaciones de migraciones; quita `db/seed` fuera de demo | `db/migration,db/seed` |
| `CORS_ORIGINS` | Orígenes permitidos | `http://localhost:5173` |
| `LOG_LEVEL` | Nivel de log | `INFO` |
| `PORT` | Puerto HTTP | `8080` |

Frontend (Vite): `VITE_API_BASE_URL` (por defecto `http://localhost:8080/api/v1`) y `VITE_CUSTOMER_ID` (por defecto `cust-demo-001`, identidad ficticia).

## Compilar, probar y ejecutar

```bash
# Backend (requiere JDK 17 y Maven)
cd backend
mvn test           # pruebas unitarias (no necesitan PostgreSQL)
mvn package
mvn quarkus:dev    # requiere PostgreSQL y las variables anteriores

# Base de datos local (opcional)
export QUARKUS_DATASOURCE_USERNAME=<usuario> QUARKUS_DATASOURCE_PASSWORD=<contraseña>
docker compose up -d

# Frontend (requiere Node 18+)
cd frontend
npm install
npm test           # vitest run (una sola pasada)
npm run build      # tsc --noEmit && vite build
npm run dev        # http://localhost:5173
```

## API `/api/v1`

Todas las rutas requieren el encabezado `X-Customer-Id` (la autenticación real pertenece a Banca por Internet).

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/cards/{cardId}/notifications?unread=false&page=0&size=20` | Lista paginada (máx. `size=50`), más recientes primero |
| PATCH | `/notifications/{id}/read` | Marca como leída (idempotente) |
| GET | `/cards/{cardId}/notification-preferences` | Preferencias (tipos sin fila = activados) |
| PUT | `/cards/{cardId}/notification-preferences` | Cuerpo: `[{"type":"PURCHASE","enabled":false}]` |

Errores: JSON con `type`, `title`, `status`, `detail` (campos de RFC 7807) y códigos 400, 401, 403, 404, 500. Salud: `/q/health`.

Ejemplo:
```bash
curl -H "X-Customer-Id: cust-demo-001" \
  "http://localhost:8080/api/v1/cards/11111111-1111-4111-8111-111111111111/notifications?unread=true"
```

## Persistencia (PostgreSQL)

- `db/migration/V1__schema.sql`: tablas `card_notification` y `notification_preference`, restricciones CHECK e índices (`(card_id, created_at DESC)` y parcial `WHERE read_at IS NULL`).
- `db/seed/V2__seed.sql`: datos **ficticios** para demostración.
- Solo se guardan `card_id` (UUID) y los últimos 4 dígitos; nunca el PAN.
- Flyway migra al arrancar (`quarkus.flyway.migrate-at-start=true`). Las consultas JDBC usan parámetros.

## Integración (sin definir) e hipótesis

- **H1** Notificación = centro de notificaciones en la app. Push, SMS y email quedan fuera; las preferencias se guardan pero aún no gobiernan un envío.
- **H2** La identidad llega por `X-Customer-Id` y la propiedad de la tarjeta la valida `CardOwnershipPort`, hoy un **stub** (`StubCardOwnership`) con datos ficticios.
- **H3** La integración con el core de tarjetas o el motor de eventos no está definida; los eventos se simulan con el seed.
- **H4** Paginación por offset. **H5** Moneda única (PEN) y textos en español.
- Los errores usan `application/json` con los campos de RFC 7807 (no `application/problem+json`).

## Seguridad

Sin secretos en el repositorio, validación de entrada en el servicio, verificación de propiedad de la tarjeta antes de cada consulta o cambio (anti-IDOR), `last4` únicamente en las respuestas y sin registrar cuerpos de petición. Esto no constituye una afirmación de que el sistema sea seguro.
