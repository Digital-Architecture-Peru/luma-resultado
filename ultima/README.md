# Notificaciones de tarjetas

Aplicación de bandeja de notificaciones y preferencias para banca por Internet. Stack: Angular 17, .NET 8 Web API y PostgreSQL opcional. Incluye datos de demostración ficticios. Estado: candidate; las instrucciones describen el código, pero no se ejecutaron en esta sesión.

## Estructura

- `frontend/`: aplicación Angular standalone, componentes organizados con Atomic Design, cliente HTTP y store con signals.
- `backend/`: solución .NET (`Domain`, `Application`, `Infrastructure`, `Api`) y pruebas xUnit en `tests/Application.Tests`.
- `db/migrations/`: SQL PostgreSQL versionado: `V001__init.sql` crea tablas e índices; `V002__seed_ficticio.sql` inserta datos y preferencias de ejemplo.

## Requisitos

- .NET SDK 8.
- Node.js compatible con Angular CLI 17 y npm.
- Opcional para persistencia: PostgreSQL y `psql` (o herramienta de migraciones equivalente).

## Backend: compilar, probar y ejecutar

Desde la raíz del repositorio:

```sh
cd backend
dotnet restore Tarjetas.Notificaciones.sln
dotnet build Tarjetas.Notificaciones.sln
dotnet test Tarjetas.Notificaciones.sln
```

Para iniciar la API en `http://localhost:5080`:

```sh
ASPNETCORE_URLS=http://localhost:5080 dotnet run --project src/Api
```

En PowerShell, configure `ASPNETCORE_URLS` con `$env:ASPNETCORE_URLS = 'http://localhost:5080'` antes de `dotnet run`.

Sin `ConnectionStrings__Default`, el servicio utiliza repositorio en memoria, carga datos ficticios al arrancar y pierde los cambios al detenerse. La identidad de demostración es `CLI-0001`; puede cambiarse con `Demo__CustomerId`. La ruta `GET /health` comprueba liveness.

## Persistencia PostgreSQL

Configure una base PostgreSQL accesible y `ConnectionStrings__Default` con una cadena Npgsql (por ejemplo, `Host=localhost;Database=tarjetas;Username=...;Password=...`). Mantenga las credenciales fuera del repositorio y utilice un usuario con permisos mínimos. No se incluye servicio PostgreSQL ni automatización de migraciones.

Desde la raíz, aplique los scripts en orden una sola vez, usando la base de datos correspondiente:

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/V001__init.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/V002__seed_ficticio.sql
```

`DATABASE_URL` es una variable local del ejemplo, no la configuración que consume la API. Configure además `ConnectionStrings__Default` para el proceso .NET. Al existir esa cadena, la API usa PostgreSQL; no carga automáticamente `DemoData`, por lo que aplique el seed para contar con ejemplos. Las migraciones son SQL directo, no se autoejecutan al iniciar la API.

El esquema contiene `notification` (unicidad de `event_id`, índices para bandeja y no leídas) y `notification_preference` (clave compuesta por cliente, tipo y canal). Se persiste una referencia tokenizada de tarjeta y sus últimos cuatro dígitos; nunca el PAN. Las operaciones SQL usan parámetros.

## Frontend: instalar, compilar, probar y ejecutar

```sh
cd frontend
npm install
npm run build
npm test
npm start
```

La aplicación queda en `http://localhost:4200`. Su URL de API está definida en `src/environments/environment.ts` (`http://localhost:5080` por defecto). Para otro entorno, ajuste esa configuración antes de compilar. `npm test` ejecuta Vitest en modo no interactivo.

## Integración frontend/API

El frontend utiliza `HttpClient` y el prefijo `/api/v1`. Con el backend local, su origen `http://localhost:4200` está permitido por la configuración incluida. Para otro origen, defina `Cors__AllowedOrigins__0` (o configure `Cors:AllowedOrigins`) en el backend. La autenticación real no está implementada: `ICurrentCustomer` se resuelve a un cliente fijo de demostración mediante `Demo__CustomerId`. No exponga este modo como autenticación en producción.

| Método | Ruta | Uso |
|---|---|---|
| `GET` | `/api/v1/notifications?unreadOnly=false&page=1&pageSize=20` | Bandeja paginada; el tamaño máximo es 50. |
| `PATCH` | `/api/v1/notifications/{id}/read` | Marca como leída; devuelve 204 o 404. |
| `GET` | `/api/v1/notification-preferences` | Lee preferencias tipo/canal. |
| `PUT` | `/api/v1/notification-preferences` | Guarda preferencias enviadas; entradas duplicadas producen 400. |
| `GET` | `/health` | Liveness. |

Las respuestas de error siguen `application/problem+json`. Tipos: `Compra`, `Bloqueo`, `Vencimiento`, `PagoMinimo`; canales: `InApp`, `Email`, `Sms`, `Push`.

## Límites de integración

La recepción de eventos del core de tarjetas no está conectada. `NotificationService.RegisterEventAsync` ofrece idempotencia por `EventId` y está preparado para una futura integración (por ejemplo, cola o webhook), pero no hay consumidor configurado. `INotificationDispatcher` se implementa actualmente con `FakeDispatcher`: registra identificador y canal, sin enviar email, SMS ni push. La elección de canales y entrega externa requiere una integración real y sus controles operativos.

## Verificación

No se ejecutaron build, pruebas, migraciones ni la aplicación durante la preparación de este README. El seed y la configuración de CORS deben validarse en el entorno destino antes de considerar el despliegue.
