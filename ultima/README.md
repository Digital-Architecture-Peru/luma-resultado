# Consulta de cuentas

Aplicación de consulta de solo lectura: Angular 17 (frontend), .NET 8 Minimal API (backend), Dapper y PostgreSQL. Incluye cuentas ficticias; no integra un core bancario real.

## Requisitos

- Node.js/npm compatibles con Angular CLI 17.
- .NET SDK 8 (los proyectos admiten roll-forward al runtime mayor instalado, pero compilar requiere SDK compatible).
- PostgreSQL local y `psql` para aplicar las migraciones.

## Base de datos y persistencia

Crear una base vacía (ejemplo: `createdb accounts`) y aplicar en orden desde la raíz del repositorio:

```sh
psql "$ACCOUNTS_DB_CONNECTION" -v ON_ERROR_STOP=1 -f db/migrations/V001__create_accounts.sql
psql "$ACCOUNTS_DB_CONNECTION" -v ON_ERROR_STOP=1 -f db/migrations/V002__seed_ficticio.sql
```

`ACCOUNTS_DB_CONNECTION` debe ser una cadena PostgreSQL aceptada por Npgsql, por ejemplo `Host=localhost;Port=5432;Database=accounts;Username=...;Password=...`. Configúrala en el entorno local; no guardes credenciales en el repositorio. Las migraciones crean la tabla e índices y cargan cuatro registros totalmente ficticios, incluyendo dos clientes. El repositorio `PgAccountRepository` accede a PostgreSQL mediante Dapper y `IAccountRepository`; el almacenamiento de cuentas no es en memoria. Las consultas siempre filtran por `customer_id`. No se proporciona migrador automático: ejecutar cada SQL una sola vez y conservar el orden.

## Compilar y probar

Backend (desde la raíz):

```sh
cd backend
dotnet restore Accounts.sln
dotnet build Accounts.sln
dotnet test Accounts.sln
```

Frontend:

```sh
cd frontend
npm install
npm run build
npm test -- --runInBand
```

Las pruebas unitarias .NET y Jest del frontend no necesitan conectarse a PostgreSQL. Para comprobar el flujo integral, iniciar la API con la base inicializada y luego el frontend.

## Ejecución local integrada

Terminal 1, API (desde `backend/src/Accounts.Api`):

```sh
export ACCOUNTS_DB_CONNECTION='Host=localhost;Port=5432;Database=accounts;Username=postgres;Password=CAMBIAR_LOCALMENTE'
export ASPNETCORE_ENVIRONMENT=Development
export ASPNETCORE_URLS=http://localhost:5080
dotnet run
```

En PowerShell, establecer las mismas variables con `$env:NOMBRE='valor'`. La API requiere `ACCOUNTS_DB_CONNECTION` al arrancar. Salud: `http://localhost:5080/health`.

Terminal 2, frontend (desde `frontend`):

```sh
npm start
```

Abrir la URL que indique Angular CLI (normalmente `http://localhost:4200`). El proxy de desarrollo reenvía `/api` a `http://localhost:5080`; la UI usa `/api/v1`.

## API e identidad

- `GET /api/v1/accounts?page=1&size=20`: listado paginado (tamaño máximo 50).
- `GET /api/v1/accounts/{id}`: detalle; inexistente o ajena responde 404.
- `GET /health`: estado del servicio.

Las rutas de cuentas requieren un claim `customer_id` con GUID, que debe ser establecido por autenticación aguas arriba. Este proyecto no configura proveedor, middleware ni emisión de tokens. Solo en `Development`, el backend acepta `X-Customer-Id`; el frontend local envía por defecto `11111111-1111-4111-8111-111111111111`, que corresponde a los datos semilla. Ese encabezado es exclusivamente una facilidad de desarrollo y **no es autenticación**: no habilitarlo ni confiar en él en producción. En entornos distintos de Development, una solicitud sin claim recibe 401.

La API enmascara el número de cuenta en sus DTOs. El frontend obtiene los datos por `AccountsApi`; al desplegar fuera del proxy local debe configurar la URL base de API mediante el token Angular `API_BASE_URL` y resolver CORS/origen según la infraestructura. La integración con core bancario y el mecanismo productivo de identidad quedan fuera del alcance actual.

## Configuración y seguridad

- Backend: `ACCOUNTS_DB_CONNECTION`, `ASPNETCORE_ENVIRONMENT`, `ASPNETCORE_URLS`.
- Frontend: proxy de desarrollo en `frontend/proxy.conf.json`; base predeterminada `/api/v1` (`API_BASE_URL`).
- Usar secretos del gestor de secretos/entorno local y nunca incluir contraseñas reales, datos de clientes ni tokens en código o commits.
