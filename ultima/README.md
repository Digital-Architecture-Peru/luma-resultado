# Notificaciones de pagos · Banca por Internet

Aplicación de muestra full stack: Angular 17, ASP.NET Core / .NET 8 y PostgreSQL. El cliente presenta notificaciones de pagos; la API expone consulta, conteo de no leídas, marcado como leída e ingreso de eventos ficticios. No hay proveedor externo de pagos ni autenticación implementados.

## Requisitos

- .NET SDK 8
- Node.js/npm compatibles con Angular CLI 17
- PostgreSQL accesible desde la máquina donde corre la API
- `psql` para aplicar el esquema y los datos de desarrollo

## Persistencia y base de datos

La API conecta mediante Npgsql y el repositorio usa Dapper con consultas parametrizadas. `backend/db/migrations/V001__init.sql` crea la tabla, restricciones e índice; `V002__seed.sql` agrega tres registros ficticios para `CUST-0001` y tolera repetición por la clave de evento.

Cree previamente una base de datos PostgreSQL vacía y configure la conexión (no se incluye `.env.example`):

```sh
export ConnectionStrings__Notifications='Host=localhost;Port=5432;Database=notifications;Username=postgres;Password=CAMBIAR'
psql "$ConnectionStrings__Notifications" -f backend/db/migrations/V001__init.sql
psql "$ConnectionStrings__Notifications" -f backend/db/migrations/V002__seed.sql
```

En PowerShell, defina la variable con `$env:ConnectionStrings__Notifications='Host=...;Database=...;Username=...;Password=...'`. Use credenciales locales/de desarrollo apropiadas; no las incorpore al repositorio. Las migraciones se aplican manualmente y no existe un runner de migraciones ni una configuración de Docker.

## Ejecutar backend

Desde la raíz del repositorio:

```sh
cd backend
dotnet restore Notifications.sln
dotnet build Notifications.sln
dotnet test Notifications.sln
dotnet run --project src/Notifications.Api
```

La API escucha en `http://localhost:5080` según `appsettings.json`. `GET /health` es una comprobación de disponibilidad. CORS permite por defecto el origen `http://localhost:4200`; personalice `Cors:AllowedOrigins` con configuración de ASP.NET Core para otros orígenes.

## Ejecutar frontend

En otra terminal, desde la raíz:

```sh
cd frontend
npm install
npm test
npm run build
npm start
```

Abra `http://localhost:4200`. La URL de API, el cliente ficticio y el intervalo de actualización se encuentran en `frontend/src/environments/environment.ts`. Las pruebas Jest se ejecutan en modo CI, sin modo interactivo. Para modificar la dirección de la API durante desarrollo, actualice `apiBaseUrl` en ese archivo.

## API e integración

Todas las rutas de aplicación requieren `X-Customer-Id`; el frontend envía `CUST-0001`.

- `GET /api/v1/notifications?status=UNREAD|READ&page=1&size=20`: lista paginada; `status` es opcional.
- `GET /api/v1/notifications/unread-count`: devuelve `{ "count": n }`.
- `PATCH /api/v1/notifications/{id}/read`: marca como leída; responde 404 si no existe para ese cliente.
- `POST /api/v1/payment-events`: recibe `paymentEventId`, `type`, `amount`, `currency` y `account`; tipos admitidos: `PAYMENT_COMPLETED`, `PAYMENT_REJECTED`, `PAYMENT_SCHEDULED`.
- Errores de dominio: `application/problem+json` con 422; falta la cabecera de cliente: 400. `GET /health` no requiere esa cabecera.

El flujo de ingreso usa la abstracción `INotificationChannel`; hoy solo se registra `InAppChannel`, que persiste en PostgreSQL a través de `INotificationRepository`. La restricción única `(customer_id, payment_event_id)` brinda idempotencia en base de datos: conflicto significa evento ya insertado, no una segunda notificación. No se integra con un sistema real de pagos ni con email, SMS o push. El código HTTP del POST depende de si el canal reporta una inserción nueva (201) o duplicada (200).

## Pruebas y límites

Las pruebas .NET de `Notifications.UnitTests` ejercitan el servicio con dependencias falsas; no requieren PostgreSQL. Las pruebas Angular están junto a sus componentes/servicio. Las pruebas unitarias no sustituyen una comprobación de integración API–PostgreSQL.

`X-Customer-Id` es un marcador de desarrollo y no una identidad segura: la API confía en esa cabecera. Antes de producción debe reemplazarse por identidad autenticada y autorización basada en claims. Los datos del seed son inventados. Migraciones, build y pruebas no se verificaron al redactar este documento; use los comandos indicados para comprobarlos en el entorno local.
