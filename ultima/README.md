# Notificaciones de cuentas

Aplicación de notificaciones in-app para cuentas bancarias: lista paginada, filtro de no leídas, conteo de no leídas y acción para marcar como leída. Frontend Angular 17 standalone, API .NET 8 y persistencia PostgreSQL.

## Estructura

- `frontend/`: aplicación Angular y pruebas Jest.
- `backend/`: solución .NET con Domain, Application, Infrastructure, API y pruebas unitarias.
- `db/migrations/`: SQL versionado para esquema y datos ficticios.

## Requisitos

Node.js/npm compatibles con Angular 17, .NET SDK 8 y PostgreSQL. La API y la base de datos deben estar disponibles antes de usar el frontend. Los comandos de frontend se ejecutan desde `frontend/` y los de .NET desde `backend/`.

## Base de datos

Crear una base PostgreSQL vacía y ejecutar las migraciones en orden, sustituyendo el marcador por la URL de conexión administrativa local (no guardar credenciales en el repositorio):

```sh
psql "$NOTIF_DB_ADMIN_URL" -v ON_ERROR_STOP=1 -f db/migrations/V001__create_account_notification.sql
psql "$NOTIF_DB_ADMIN_URL" -v ON_ERROR_STOP=1 -f db/migrations/V002__seed_fictitious.sql
```

Las migraciones crean `account_notification`, índices para las consultas por propietario/cuenta y registros de demostración ficticios. V002 está pensada para una base limpia; no es idempotente. En entornos posteriores, aplicar únicamente migraciones aún no ejecutadas, manteniendo el orden.

## Backend: compilar, probar y ejecutar

Configurar `NOTIF_DB_CONNECTION` como cadena de conexión Npgsql, por ejemplo `Host=localhost;Database=notifications;Username=app;Password=<contraseña-local>`. La variable debe existir en el entorno del proceso; no se incluye valor de conexión en el código. Opcionalmente, establecer `NOTIF_ALLOWED_ORIGIN` (predeterminado `http://localhost:4200`).

```sh
cd backend
dotnet restore Notifications.sln
dotnet build Notifications.sln --no-restore
dotnet test Notifications.sln --no-build
dotnet run --project src/Notifications.Api --urls http://localhost:5080
```

La API expone `GET /health` y las rutas bajo `/api/v1`:

- `GET /api/v1/accounts/{accountId}/notifications?status=all|unread&page=1&pageSize=20` devuelve `{items,total}`. `pageSize` admite 1–100.
- `GET /api/v1/accounts/{accountId}/notifications/unread-count` devuelve `{count}`.
- `PATCH /api/v1/notifications/{id}/read` devuelve `204` al completar y `404` si la notificación no existe para el cliente.

Las rutas de notificaciones requieren `X-Customer-Id`; errores de entrada se devuelven como `application/problem+json`. La identidad se simula mediante esa cabecera y no equivale a autenticación.

## Frontend: instalar, probar y ejecutar

```sh
cd frontend
npm install
npm test
npm run build
npm start
```

La interfaz estará en `http://localhost:4200`. `npm test` ejecuta Jest en modo CI, sin modo watch. La URL de API y la identidad/cuenta demostrativas se encuentran en `src/environments/environment.ts` (`apiBaseUrl`, `devCustomerId`, `demoAccountId`). Para desarrollo local, el valor predeterminado de API es `http://localhost:5080/api/v1`.

## Integración y persistencia

Angular consume la API HTTP mediante `NotificationService`; envía `X-Customer-Id` y emplea los endpoints de listado, conteo y marcado. La API valida y delega las operaciones en Application; `PgNotificationRepository` usa Dapper/Npgsql y SQL parametrizado sobre PostgreSQL. Las lecturas y escrituras se filtran por `customer_id`; el marcado persiste `read_at`. La persistencia requiere una base ya migrada, no se inicializa automáticamente al arrancar la API.

La creación de nuevas notificaciones desde el core bancario no está implementada: los datos disponibles provienen del seed ficticio. No se incluye autenticación real, autorización basada en identidad bancaria ni actualizaciones push/SignalR; la cabecera de cliente y el seed son exclusivamente demostrativos. No exponer esta API tal cual en producción.
