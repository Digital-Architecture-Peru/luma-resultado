# Notificaciones de Tarjetas · Banca por Internet (candidate)

Capacidad de **notificación** sobre el dominio **Tarjetas**: bandeja de avisos (compra aprobada/rechazada, bloqueo/desbloqueo, cambio de límite, vencimiento próximo) y preferencias por evento y canal.

- **Frontend**: React 18 + TypeScript + Vite, Atomic Design (`atoms → molecules → organisms → templates → pages`).
- **Backend**: .NET 8 Web API en capas `Domain → Application → Infrastructure → Api`.
- **Persistencia**: PostgreSQL (Npgsql + Dapper, SQL parametrizado). Migraciones en `db/migrations`.
- **Pruebas**: unitarias con xUnit (backend) y Vitest + Testing Library (frontend).

> Estado: **candidate**. No se ha ejecutado compilación ni pruebas en este entorno; ver "Límites".

## Estructura
```
backend/   CardNotifications.sln, src/{Domain,Application,Infrastructure,Api}, tests/UnitTests
frontend/  Vite + React + TS (src/components/{atoms,molecules,organisms,templates}, pages, api, hooks, model)
db/migrations/  V001__schema.sql, V002__seed_ficticio.sql (datos ficticios)
docker-compose.yml  PostgreSQL local (contraseña desde DB_PASSWORD)
```

## Cómo ejecutar
Requisitos: .NET SDK 8, Node 20 LTS, PostgreSQL 14+ (o Docker).

```bash
# 1. Base de datos (las migraciones se aplican en la primera inicialización)
export DB_PASSWORD=<defínela-localmente>
docker compose up -d db
# Sin Docker: ejecutar en orden db/migrations/V001__schema.sql y V002__seed_ficticio.sql

# 2. Backend
export ASPNETCORE_ENVIRONMENT=Development
export ASPNETCORE_URLS=http://localhost:5080
export ConnectionStrings__Notifications="Host=localhost;Port=5432;Database=card_notifications;Username=cardnotif;Password=$DB_PASSWORD"
dotnet run --project backend/src/CardNotifications.Api

# 3. Frontend (proxy /api -> VITE_API_TARGET, por defecto http://localhost:5080)
cd frontend && npm install && npm run dev
```

Build y pruebas:
```bash
dotnet build backend/CardNotifications.sln && dotnet test backend/CardNotifications.sln
cd frontend && npm run build && npm test     # build incluye type-check (tsc --noEmit)
```

## Variables de entorno
| Variable | Uso |
|---|---|
| `ConnectionStrings__Notifications` | Cadena Npgsql (obligatoria; el API no arranca sin ella) |
| `DB_PASSWORD` | Contraseña del PostgreSQL local (docker-compose) |
| `ASPNETCORE_ENVIRONMENT` / `ASPNETCORE_URLS` | Entorno y URL del API |
| `VITE_API_TARGET` | Destino del proxy de desarrollo del frontend |

No hay secretos en el repositorio.

## API v1
| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/v1/cards/notifications?status=unread\|all&page=&size=` | 200 `{items, unread, page, size}` (size ≤ 50) |
| PATCH | `/api/v1/cards/notifications/{id}/read` | 204 / 404 (idempotente) |
| POST | `/api/v1/cards/notifications/read-all` | 200 `{updated}` |
| GET | `/api/v1/cards/notification-preferences` | 200 matriz completa evento × canal |
| PUT | `/api/v1/cards/notification-preferences` | 200 / 422 si se desactiva un aviso de seguridad |
| GET | `/health` | 200 |
| POST | `/api/v1/cards/notifications/simulate` | **Solo Development**: genera notificaciones desde la fuente fake |

Errores en `application/problem+json`. Se propaga `X-Correlation-Id` y se incluye en el ámbito de logs.

## Integración (sin definir)
La fuente real de eventos y los canales externos no están definidos, por lo que hay puertos con implementación **fake**:
- `ICardEventSource` → `FakeCardEventSource` (eventos ficticios).
- `IChannelDispatcher` → `FakeChannelDispatcher` (solo registra canal y tipo).

El canal real es **in-app**; correo, SMS y push existen solo como preferencia. Para integrar, implementar los puertos y registrarlos en `Program.cs`.

## Persistencia (PostgreSQL)
- `card_notification`: `id uuid PK`, `customer_id`, `card_ref`, `card_last4 char(4)`, `type`, `title`, `body`, `severity`, `created_at timestamptz`, `read_at timestamptz NULL`.
- `notification_preference`: PK (`customer_id`, `event_type`, `channel`), `enabled`.
- Índices: (`customer_id`, `created_at DESC`) y parcial de no leídas (`WHERE read_at IS NULL`).
- Nunca se guarda ni muestra el PAN: solo `card_last4` y `card_ref` opaco. Fechas en UTC; el navegador las muestra en hora local.

## Seguridad y supuestos
- `customer_id` proviene del claim `sub`. **Stub de desarrollo**: en `Development` se acepta la cabecera `X-Customer-Id` (o el cliente `CUST-DEMO-001`); fuera de `Development` el API responde 401 hasta configurar autenticación real. Debe sustituirse antes de cualquier uso productivo.
- Avisos de seguridad (bloqueo, desbloqueo, compra rechazada) no se pueden desactivar en in-app (regla en backend y frontend).
- Paginación por offset (suficiente para demostración). Se asumen .NET 8 y Node 20.

## Límites (no verificado)
- No se ha ejecutado `dotnet build/test` ni `npm install/build/test` en este entorno.
- El esquema PostgreSQL solo tiene revisión estática; no se ejecutó contra un motor real.
- `PgNotificationRepository` no tiene pruebas de integración (solo unitarias del dominio/servicio y del frontend).
- Sin autenticación real, sin integración real, sin despliegue. Añade `bin/ obj/ node_modules/ dist/ .env` a tu `.gitignore`.
