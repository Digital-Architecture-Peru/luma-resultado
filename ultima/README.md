# Notificaciones de tarjetas

Aplicación de referencia para la bandeja de notificaciones de tarjeta. Stack: Angular 17, .NET 8 y PostgreSQL. Las muestras son ficticias; no se almacenan números PAN, solo una referencia de tarjeta y sus últimos cuatro dígitos.

## Requisitos

- Node.js compatible con Angular 17 y npm.
- .NET SDK 8.
- PostgreSQL disponible para ejecutar la API.

## Puesta en marcha

### 1. Preparar PostgreSQL

Crea una base de datos vacía (por ejemplo, `notificaciones`) y aplica los scripts desde la raíz del repositorio, en orden:

```sh
psql "$NOTIF_DB_CONNECTION" -v ON_ERROR_STOP=1 -f backend/db/migrations/V001__init.sql
psql "$NOTIF_DB_CONNECTION" -v ON_ERROR_STOP=1 -f backend/db/migrations/V002__seed.sql
```

`V001` crea las tablas e índices; `V002` inserta registros ficticios para `cliente-demo` y la tarjeta `tok_demo_001`. Los scripts SQL no crean una tabla de control de versiones ni son idempotentes: aplícalos una sola vez a una base vacía. Para otros entornos, registra y ejecuta las migraciones con el mecanismo de despliegue elegido.

### 2. Compilar, probar y ejecutar el backend

```sh
cd backend
dotnet restore Tarjetas.Notificaciones.sln
dotnet build Tarjetas.Notificaciones.sln
dotnet test Tarjetas.Notificaciones.sln
```

Configura la conexión por variable de entorno (no guardes credenciales en el repositorio):

```sh
export NOTIF_DB_CONNECTION='Host=localhost;Database=notificaciones;Username=<usuario>;Password=<contraseña>'
export CORS_ORIGIN='http://localhost:4200' # opcional; este es el valor por defecto
dotnet run --project src/Api --urls http://localhost:5080
```

En PowerShell usa `$env:NOTIF_DB_CONNECTION` y `$env:CORS_ORIGIN` en lugar de `export`. La cadena `NOTIF_DB_CONNECTION` es obligatoria. La API expone `GET /health` para una comprobación básica.

### 3. Instalar, probar y ejecutar Angular

En otra terminal:

```sh
cd frontend
npm install
npm run build
npm test
npm start
```

El front se sirve normalmente en `http://localhost:4200`. La base URL de API predeterminada es `http://localhost:5080`; para cambiarla, establece `globalThis.API_BASE_URL` en `frontend/src/index.html` antes de cargar la aplicación. El origen configurado en `CORS_ORIGIN` debe coincidir con el del navegador.

## Integración y contrato

La API versionada usa prefijo `/api/v1`. Todas las operaciones de tarjetas requieren el header `X-Cliente-Id`; el front actual envía `cliente-demo` como identidad de demostración. **Este header no autentica ni autoriza por sí solo.** En producción debe sustituirse por identidad confiable propagada por el gateway y validarse autorización por cliente/tarjeta. No exponer el valor demo como mecanismo de seguridad.

- `GET /api/v1/tarjetas/{tarjetaRef}/notificaciones?leida=&page=&size=` devuelve página (`items`, `total`, `page`, `size`); valores predeterminados page 1 y size 20, máximo size 50.
- `PATCH /api/v1/notificaciones/{id}/lectura` marca leída y responde 204.
- `GET /api/v1/tarjetas/{tarjetaRef}/preferencias` obtiene preferencias.
- `PUT /api/v1/tarjetas/{tarjetaRef}/preferencias` actualiza preferencias y devuelve la colección guardada.
- Los errores controlados se devuelven como `ProblemDetails`; solicitud inválida 400, inexistente 404 y fallo inesperado 500.

CORS permite el origen configurado y los métodos GET, PATCH y PUT, junto a `X-Cliente-Id` y `Content-Type`. El servicio publica un puerto `INotificacionPublisher`, pero el envío efectivo por email/SMS/push no está implementado ni configurado; las preferencias no representan una integración de entrega activa.

## Persistencia y límites

PostgreSQL guarda notificaciones y preferencias. Las consultas filtran por cliente y referencia de tarjeta; los comandos del repositorio usan parámetros SQL. Las preferencias se guardan dentro de una transacción y su clave compuesta impide duplicados por cliente, tarjeta, tipo y canal. No se incluyen contenedores ni configuración de despliegue; cada entorno debe proveer PostgreSQL, aplicar migraciones y configurar secretos fuera del código.

Las pruebas .NET existentes son unitarias del servicio y no requieren base de datos. Las pruebas Angular/Jest son pruebas del front. La verificación de integración completa requiere PostgreSQL con las migraciones aplicadas y ambos servicios en ejecución.

## Estructura

- `frontend/`: aplicación Angular con componentes organizados por Atomic Design.
- `backend/src/Api`: endpoints HTTP y configuración de entrada.
- `backend/src/Application` y `Domain`: casos de uso, reglas y puertos.
- `backend/src/Infrastructure`: persistencia PostgreSQL con Npgsql.
- `backend/db/migrations`: esquema inicial y seed ficticio.
- `backend/tests/UnitTests`: pruebas unitarias del servicio.

## Estado de verificación

Estas instrucciones describen comandos y configuración a partir del código presente; no se ejecutaron builds, pruebas ni scripts SQL durante la preparación de este documento.
