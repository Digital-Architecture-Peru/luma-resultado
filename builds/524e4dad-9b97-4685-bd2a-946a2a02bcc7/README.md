# Consulta de pagos · Banca por Internet

Aplicación de consulta de pagos, de solo lectura, construida con React + TypeScript y .NET 8. El backend separa API, aplicación, dominio e infraestructura; puede usar datos ficticios en memoria o consultar una tabla de PostgreSQL. No se crean, modifican ni eliminan pagos.

> **Estado:** candidate. La autenticación actual es solo una simulación de desarrollo; no desplegar con datos reales ni exponer públicamente tal como está.

## Requisitos

- .NET SDK 8.
- Node.js 20 o superior y npm.
- Para el modo persistente: PostgreSQL y `psql` (o una herramienta equivalente para ejecutar SQL).

## Compilar, probar y ejecutar

### Backend

Desde la raíz del repositorio:

```sh
cd backend
dotnet restore Payments.sln
dotnet build Payments.sln
dotnet test Payments.sln
dotnet run --project src/Payments.Api --urls http://localhost:5080
```

La API queda en `http://localhost:5080`. En otra terminal se puede comprobar `GET /health`.

Configuración por variables de entorno (la configuración predeterminada selecciona memoria):

| Variable | Uso | Predeterminado |
|---|---|---|
| `PAYMENTS_STORE` | Repositorio `memory` o `postgres` | `memory` |
| `PAYMENTS_DB_CONNECTION` | Cadena de conexión Npgsql; necesaria en modo PostgreSQL | Sin valor |
| `ALLOWED_ORIGINS` | Orígenes permitidos por CORS, separados por coma | `http://localhost:5173` |

Ejemplo para PowerShell:

```powershell
$env:PAYMENTS_STORE = 'postgres'
$env:PAYMENTS_DB_CONNECTION = 'Host=localhost;Database=payments;Username=payments_app;Password=<local-password>'
$env:ALLOWED_ORIGINS = 'http://localhost:5173'
dotnet run --project src/Payments.Api --urls http://localhost:5080
```

En Unix, establece las mismas variables con `export`. No guardes contraseñas reales en el repositorio; configura secretos fuera del código. `PAYMENTS_STORE` distinto de `postgres` utiliza el repositorio en memoria.

### Frontend

En una terminal desde la raíz:

```sh
cd frontend
npm install
npm test
npm run build
npm run dev
```

Vite sirve la aplicación normalmente en `http://localhost:5173`. `npm run build` ejecuta el chequeo TypeScript y genera el bundle de producción. Para que el navegador conecte con la API, inicia el backend y configura:

| Variable | Uso | Valor local sugerido |
|---|---|---|
| `VITE_API_BASE_URL` | URL base del backend | `http://localhost:5080` |
| `VITE_CUSTOMER_ID` | Identificador ficticio enviado en `X-Customer-Id` | `11111111-1111-1111-1111-111111111111` |

Vite lee variables `VITE_` al iniciar; define las variables antes de ejecutar `npm run dev` (o crea `frontend/.env.local`, que no debe contener secretos). Ejemplo Unix:

```sh
VITE_API_BASE_URL=http://localhost:5080 VITE_CUSTOMER_ID=11111111-1111-1111-1111-111111111111 npm run dev
```

El identificador anterior es de demostración y corresponde a registros ficticios. La interfaz consulta la lista; aunque el backend ofrece una ruta de detalle, la pantalla actual no implementa esa navegación.

## API e integración

Todas las rutas de pagos requieren el header `X-Customer-Id` con un GUID válido. Este header **no autentica** al usuario ni debe aceptarse como identidad en producción: el cliente lo envía como mecanismo provisional de demo.

- `GET /health` — comprobación básica de disponibilidad.
- `GET /api/payments?from=&to=&status=&page=&pageSize=` — lista paginada y filtrable por rango temporal y estado.
- `GET /api/payments/{id}` — consulta un pago por GUID; la búsqueda está limitada al cliente de la petición.

La API devuelve JSON, usa respuestas Problem Details para los errores y admite únicamente operaciones GET. Valores predeterminados de paginación: página 1 y 20 elementos; tamaño máximo de página: 100. Fechas `from` y `to` se interpretan como `DateTimeOffset`. El frontend envía fechas UTC al inicio y fin del día elegido. Estados soportados: `PENDING`, `COMPLETED` y `REJECTED`.

El punto de integración del dominio es `IPaymentQueryRepository`. `RepositoryFactory` selecciona la implementación según `PAYMENTS_STORE`; la infraestructura contiene un repositorio en memoria y otro PostgreSQL. La conexión con un core bancario, la identidad y el proceso de actualización de datos no están definidos en este proyecto. Antes de una integración real, sustituir la identidad de demostración por autenticación/autorización confiable (por ejemplo OIDC/JWT validado en servidor), vincular el cliente a claims verificados, y definir contratos, observabilidad y controles operativos.

## Persistencia PostgreSQL

Las migraciones SQL versionadas están en `backend/db/migrations` y se ejecutan en orden una vez contra una base de datos creada previamente:

```sh
psql "$PAYMENTS_DB_CONNECTION" -v ON_ERROR_STOP=1 -f backend/db/migrations/V001__create_payments.sql
psql "$PAYMENTS_DB_CONNECTION" -v ON_ERROR_STOP=1 -f backend/db/migrations/V002__seed_fake.sql
```

En PowerShell se puede pasar la cadena a `psql` directamente como argumento. V001 crea la tabla de consulta e índices; V002 inserta filas **ficticias** para dos GUID de cliente de demostración. Los scripts no implementan una tabla de control de migraciones ni son idempotentes: aplícalos una sola vez y en orden en una base limpia. Para reconfigurar la demo, prepara una base vacía y vuelve a aplicar ambos scripts.

Con la base preparada, inicia la API con `PAYMENTS_STORE=postgres` y `PAYMENTS_DB_CONNECTION` configurada. Las consultas usan parámetros y siempre filtran por `customer_id`, incluso al cargar por identificador. La tabla es un modelo de lectura; no se sincroniza automáticamente con un core ni recibe escrituras desde esta aplicación.

## Pruebas

- Backend: `cd backend && dotnet test Payments.sln` ejecuta pruebas del servicio de consulta y del repositorio en memoria.
- Frontend: `cd frontend && npm test` ejecuta la suite Vitest en modo no interactivo, incluyendo cliente HTTP, componentes y página.
- Compilación frontend: `cd frontend && npm run build` realiza type-check y bundle de producción.

Las pruebas existentes no requieren PostgreSQL. No se afirma que se hayan ejecutado en el entorno de documentación.
