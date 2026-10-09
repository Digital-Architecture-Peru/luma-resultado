# Consulta de cuentas

Aplicación de consulta de cuentas de solo lectura: React 18 + TypeScript + Vite en el frontend, .NET 8 Minimal API en el backend y PostgreSQL como persistencia. Los datos de la migración de seed son ficticios y están destinados únicamente al desarrollo local.

## Requisitos

- Node.js y npm compatibles con el proyecto Vite.
- .NET SDK 8.
- PostgreSQL accesible para la API y `psql` para aplicar las migraciones (o una herramienta compatible con scripts SQL PostgreSQL).

## Configuración e inicio local

1. Cree una base de datos PostgreSQL vacía, por ejemplo `cuentas`.
2. Aplique las migraciones desde la raíz del repositorio, en orden:

   ```sh
   psql "$CUENTAS_DB_CONNECTION" -v ON_ERROR_STOP=1 -f db/migrations/V001__crear_cuentas.sql
   psql "$CUENTAS_DB_CONNECTION" -v ON_ERROR_STOP=1 -f db/migrations/V002__datos_ficticios.sql
   ```

   `CUENTAS_DB_CONNECTION` debe ser una cadena de conexión Npgsql/psql válida, por ejemplo `Host=localhost;Database=cuentas;Username=postgres;Password=...`. No incluya contraseñas reales en el repositorio ni en documentación compartida. Las migraciones no están configuradas como migrador automático: ejecútelas una sola vez sobre una base vacía; `V002` inserta filas fijas y no es idempotente.

3. Configure el backend y arránquelo:

   ```sh
   export CUENTAS_DB_CONNECTION='Host=localhost;Database=cuentas;Username=postgres;Password=...'
   export CORS_ORIGIN='http://localhost:5173'
   dotnet run --project backend/src/Cuentas.Api --urls http://localhost:5000
   ```

   `CUENTAS_DB_CONNECTION` es obligatorio. `CORS_ORIGIN` es opcional y por defecto vale `http://localhost:5173`; debe coincidir con el origen desde el que se sirve el frontend. La API expone `GET /health`, `GET /api/v1/cuentas` y `GET /api/v1/cuentas/{id}`.

4. En otra terminal, instale y ejecute el frontend:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

   Vite se sirve normalmente en `http://localhost:5173`. `VITE_API_BASE_URL` configura la URL base de la API y por defecto es `http://localhost:5000`. `VITE_CLIENTE_ID` permite configurar el UUID del cliente de demostración en el cliente; el valor de la semilla es `aaaaaaaa-0000-0000-0000-000000000001`. Las variables `VITE_*` se leen al iniciar Vite.

## Compilar y probar

Desde la raíz:

```sh
dotnet build backend/Cuentas.sln
dotnet test backend/Cuentas.sln
```

En el frontend:

```sh
cd frontend
npm install
npm test
npm run build
```

`npm test` ejecuta Vitest en modo no interactivo; `npm run build` incluye el chequeo de tipos TypeScript antes de generar la distribución Vite. Las pruebas .NET son unitarias del servicio de aplicación; no requieren PostgreSQL. Las pruebas frontend cubren componentes y cliente HTTP. Para comprobar una instalación integrada, arranque PostgreSQL, aplique las migraciones, inicie la API y abra la aplicación frontend.

## Contrato e integración

El frontend llama a `GET {VITE_API_BASE_URL}/api/v1/cuentas` y `GET {VITE_API_BASE_URL}/api/v1/cuentas/{id}`, enviando el header `X-Cliente-Id` con un UUID. La API valida que el header exista y sea un UUID no vacío; si falta o es inválido responde 400 con Problem Details. Una cuenta que no pertenezca al cliente se presenta como no encontrada (404). Otros errores HTTP se expresan mediante Problem Details. CORS permite el origen configurado, el header `X-Cliente-Id` y solicitudes `GET`.

El backend separa API, aplicación e infraestructura: el servicio de aplicación usa `ICuentaRepository`, y `PgCuentaRepository` implementa el acceso PostgreSQL con Dapper y consultas parametrizadas mediante Npgsql. La consulta siempre filtra por `cliente_id`; el detalle filtra tanto por identificador de cuenta como por cliente. La API serializa DTOs, que enmascaran el número de cuenta. PostgreSQL persiste cuentas en la tabla `cuentas`; `V001` crea tabla, restricciones e índice por cliente y `V002` carga ejemplos ficticios.

No hay integración con un proveedor de identidad, servicios bancarios externos, contenedores ni automatización de migraciones en este proyecto. `X-Cliente-Id` es una identidad simulada para la demostración, no un control de acceso. Antes de cualquier uso real, reemplácelo por autenticación y autorización confiables, proteja secretos con el mecanismo de despliegue correspondiente y revise el modelo de seguridad y privacidad. No utilice los datos ficticios como datos de clientes.
