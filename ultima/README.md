# Consulta de Pagos

Aplicación de consulta de pagos de solo lectura con React + TypeScript (Vite), ASP.NET Core .NET 8 Web API y PostgreSQL. Los datos de ejemplo son ficticios.

## Estructura

- `frontend/`: interfaz web y pruebas Vitest.
- `backend/`: solución .NET (`Pagos.sln`), capas Domain, Application, Infrastructure, Api y pruebas xUnit.
- `db/migrations/`: SQL versionado inicial y datos de demostración. No existe un ejecutor automático de migraciones en la aplicación.

## Requisitos

.NET SDK 8, Node.js/npm y PostgreSQL compatible. Los comandos asumen que se ejecutan desde la raíz del repositorio. Para configurar PostgreSQL, use un usuario/base de datos locales con permisos para crear tablas e insertar los datos; no incluya credenciales reales en el repositorio.

## Base de datos y persistencia

La API lee pagos de PostgreSQL mediante Npgsql y Dapper. El repositorio implementa `IPagosRepository`; la aplicación no ofrece endpoints de escritura. La persistencia requiere aplicar los scripts una sola vez y en orden sobre una base vacía:

```sh
psql "$PAGOS_DB_CONNECTION" -v ON_ERROR_STOP=1 -f db/migrations/V001__init.sql
psql "$PAGOS_DB_CONNECTION" -v ON_ERROR_STOP=1 -f db/migrations/V002__seed.sql
```

`V001` crea la tabla `pagos`, restricciones e índices; `V002` inserta registros ficticios para `CLI-0001` y `CLI-0002`. No re-ejecute el seed: los identificadores y referencias son únicos. Para reiniciar el entorno local, elimine la tabla/base de datos de prueba y vuelva a aplicar ambos scripts. La aplicación no migra ni siembra automáticamente.

## Configuración

La API requiere `PAGOS_DB_CONNECTION` (cadena de conexión Npgsql). También acepta:

- `PAGOS_CORS_ORIGIN`: origen permitido del navegador; predeterminado `http://localhost:5173`.
- `PAGOS_CLIENTE_ID`: cliente asociado a las consultas; predeterminado `CLI-0001`.
- `VITE_API_BASE_URL`: URL base de API para el frontend; en desarrollo local puede dejarse vacía si Vite proxifica solicitudes.

Ejemplo local, usando una cadena ficticia y solo para entorno de desarrollo:

```sh
export PAGOS_DB_CONNECTION='Host=localhost;Port=5432;Database=pagos;Username=pagos_dev;Password=CAMBIAR_LOCALMENTE'
export PAGOS_CORS_ORIGIN='http://localhost:5173'
export PAGOS_CLIENTE_ID='CLI-0001'
```

Guarde secretos únicamente en configuración local segura o en variables de entorno; no los agregue a Git. Vite está configurado para desarrollo en el puerto 5173. Revise `frontend/vite.config.ts` y `frontend/src/api/pagosClient.ts` al configurar la URL de la API: no se debe asumir un proxy que no esté definido allí. Para despliegues donde frontend y API tengan orígenes distintos, defina `VITE_API_BASE_URL` antes de iniciar/compilar el frontend y permita ese origen con `PAGOS_CORS_ORIGIN`.

## Compilar y ejecutar

### 1. Backend

```sh
cd backend
dotnet restore Pagos.sln
dotnet build Pagos.sln
dotnet run --project src/Pagos.Api/Pagos.Api.csproj --urls http://localhost:5080
```

Defina `PAGOS_DB_CONNECTION` en el entorno del proceso antes de `dotnet run`; la API falla al arrancar si falta. Compruebe disponibilidad en `http://localhost:5080/health`.

### 2. Frontend

En otra terminal, desde la raíz:

```sh
cd frontend
npm install
npm run dev
```

Abra la URL que informa Vite (normalmente `http://localhost:5173`). Para producción, configure `VITE_API_BASE_URL` con la URL pública de la API antes de `npm run build`; sirva luego el contenido de `frontend/dist/` desde un servidor web.

## Pruebas

Las pruebas unitarias del servicio .NET usan un repositorio simulado y no requieren PostgreSQL:

```sh
cd backend
dotnet test Pagos.sln
```

Pruebas del cliente HTTP y de la página React:

```sh
cd frontend
npm install
npm test
```

Verificación TypeScript y bundle de producción:

```sh
cd frontend
npm run build
```

Las pruebas de integración real con PostgreSQL no están incluidas: los scripts SQL, conexión y consulta del repositorio deben validarse en un entorno PostgreSQL local de prueba.

## API

Prefijo: `/api/v1/pagos`.

- `GET /api/v1/pagos?desde=<ISO-8601>&hasta=<ISO-8601>&estado=<estado>&page=<n>&pageSize=<n>`: listado paginado `{ items, total, page, pageSize }`. La ventana por defecto son los últimos 30 días; tamaño predeterminado 20, máximo 50 y rango máximo 366 días. Estados válidos: `PENDIENTE`, `APLICADO`, `RECHAZADO`.
- `GET /api/v1/pagos/{id}`: detalle por UUID; devuelve 404 si no existe para el cliente actual.
- `GET /health`: comprobación de disponibilidad de la aplicación.

Las consultas siempre filtran por `cliente_id`; errores de validación usan Problem Details y se devuelve el monto como texto decimal para preservar precisión. La cuenta de destino se expone en forma enmascarada.

## Límites conocidos

`PAGOS_CLIENTE_ID` es un stub de desarrollo, no autenticación ni autorización de producción. Antes de desplegar, intégrense identidad/autorización reales y gestión segura de secretos. Los scripts son PostgreSQL específico; no se ha indicado ni verificado ejecución contra una instancia real.