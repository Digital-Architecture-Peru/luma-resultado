# Notificaciones de pagos

Aplicación de bandeja de notificaciones para pagos, con frontend React + TypeScript (Vite), API .NET 8 y persistencia opcional en PostgreSQL. El contenido y los clientes de ejemplo son ficticios. La API no implementa autenticación: `X-Customer-Id` es un identificador de desarrollo, no una frontera de seguridad.

## Requisitos

- Node.js y npm compatibles con las versiones fijadas en `frontend/package.json`.
- .NET SDK 8.
- PostgreSQL solo si se desea probar el almacenamiento persistente (y `psql` para aplicar SQL).

## Frontend: compilar, ejecutar y probar

```sh
cd frontend
npm install
npm test
npm run build
npm run dev
```

Vite sirve el frontend por defecto en `http://localhost:5173`. Puede abrirse solo con el mock local: establecer `VITE_USE_MOCK=true` en `frontend/.env` (o exportar la variable al iniciar Vite). En este modo no se requiere API ni base de datos y los cambios viven únicamente en memoria.

Para usar la API, configurar en `frontend/.env`:

```dotenv
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:5080
VITE_CUSTOMER_ID=CUST-001
```

`VITE_API_URL` es el origen base de la API, sin `/api/v1/notifications`. Al no definir `VITE_USE_MOCK=true`, la fábrica selecciona HTTP y usa esos valores de respaldo para URL e identificador. No incluir credenciales reales en variables `VITE_*`: se empaquetan en el cliente y son visibles en el navegador. `.env` es configuración local; no se debe versionar.

## Backend: compilar, ejecutar y probar

Desde `backend/`:

```sh
dotnet restore Payments.Notifications.sln
dotnet build Payments.Notifications.sln
dotnet test Payments.Notifications.sln
dotnet run --project src/Payments.Notifications.Api/Payments.Notifications.Api.csproj --urls http://localhost:5080
```

La configuración se lee desde variables de entorno ASP.NET Core:

- `ConnectionStrings__Notifications`: cadena de conexión PostgreSQL. Si está ausente o vacía, se registra el repositorio en memoria con datos proporcionados por `FakeNotificationSource`; los cambios se pierden al reiniciar.
- `Cors__Origins`: lista de orígenes permitidos separados por comas. El valor predeterminado es `http://localhost:5173`.

La API expone `GET /health` y las rutas descritas abajo. El middleware devuelve errores mediante `ProblemDetails`. El repositorio PostgreSQL usa Npgsql y Dapper; el repositorio en memoria es adecuado para demostración, no para persistencia compartida.

## Contrato HTTP

Todas las rutas de notificaciones requieren el header ficticio de desarrollo `X-Customer-Id` (máximo 64 caracteres). El cliente se usa para acotar lecturas y modificaciones. Sin header válido se devuelve un error de solicitud. En producción debe sustituirse por una identidad autenticada, obtenida y validada en el servidor; no confiar en un identificador arbitrario enviado por el navegador.

- `GET /api/v1/notifications?status=unread&page=1&size=20`: listado paginado, más reciente primero. `status` acepta `unread` o `all` (predeterminado `all`); `page` empieza en 1; `size` debe estar entre 1 y 100. Respuesta: `{ items, total, page, size }`.
- `GET /api/v1/notifications/unread-count`: contador de no leídas, respuesta `{ count }`.
- `PATCH /api/v1/notifications/{id}/read`: marca como leída; `id` debe ser GUID. Una notificación inexistente para ese cliente devuelve no encontrado.
- `GET /health`: comprobación básica, respuesta `{ status: "ok" }`.

El frontend HTTP pide página 1 con tamaño 50 y actualiza el listado/contador tras marcar como leída.

## PostgreSQL, migraciones y persistencia

Crear primero una base de datos y un rol con los permisos necesarios; no se suministran credenciales. Aplicar desde la raíz del repositorio en este orden:

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/V001__schema.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/V002__seed.sql
```

`DATABASE_URL` debe ser una variable local configurada por quien ejecuta el proyecto; nunca almacenar una cadena con contraseña en el repositorio. Para conectar la API, definir `ConnectionStrings__Notifications` con la cadena PostgreSQL aceptada por Npgsql y arrancar el backend. Las migraciones SQL están versionadas y usan nombres compatibles con Flyway, pero no se incorpora ni configura un ejecutor de migraciones automático: aplicar cada versión una sola vez, en orden. El seed inserta datos ficticios para `CUST-001` y `CUST-002`; no ejecutarlo repetidamente, pues los UUID son claves primarias.

El esquema `payment_notifications` guarda cliente, referencia enmascarada, tipo, texto, monto, moneda, fecha de creación y fecha de lectura; define restricciones e índices para listado/contador. PostgreSQL conserva las modificaciones entre reinicios. Con almacenamiento en memoria no hay sincronización con el seed SQL.

## Integración de eventos

La entrada de notificaciones de pago está aislada mediante `INotificationSource`. La implementación actual `FakeNotificationSource` genera datos de demostración usados al inicializar el repositorio en memoria. No hay consumidor de eventos de pagos, conexión a un proveedor externo, ni envío por correo/SMS implementado. Al usar PostgreSQL, las filas se cargan mediante las migraciones; la API no ingiere automáticamente las notificaciones simuladas. La integración productiva requiere definir el origen, autenticación, idempotencia, reintentos y política de errores antes de conectar eventos reales.

## Pruebas disponibles y límites

- Frontend: Vitest y Testing Library, mediante `npm test`.
- Backend: pruebas unitarias xUnit, mediante `dotnet test backend/Payments.Notifications.sln` (desde la raíz) o los comandos anteriores.
- No hay pruebas de integración de PostgreSQL ni automatización que aplique migraciones. Los comandos de compilación y pruebas están documentados, pero no se han ejecutado al redactar este README.
