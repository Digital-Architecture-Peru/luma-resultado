# Consulta de tarjetas

Aplicación de consulta **solo lectura** con frontend React + TypeScript (Vite), API .NET 8 y persistencia opcional PostgreSQL. Todos los registros incluidos son ficticios. La API usa memoria si no se configura una cadena de conexión y PostgreSQL en caso contrario.

## Requisitos

- Node.js y npm compatibles con Vite 5.
- .NET SDK 8.
- PostgreSQL 13+ solo para el modo persistente.

## Ejecutar en desarrollo (sin PostgreSQL)

En terminales separadas:

```sh
cd backend
dotnet restore Cards.sln
dotnet build Cards.sln
dotnet run --project src/Cards.Api --urls http://localhost:5080
```

Si `ConnectionStrings__Cards` no está definida, la API usa las tarjetas ficticias en memoria. En otra terminal:

```sh
cd frontend
npm install
npm run dev
```

Abrir la URL de Vite (normalmente `http://localhost:5173`). La API utiliza ese origen por defecto en la política CORS.

La URL base del servicio web se configura con `VITE_API_BASE_URL` (predeterminada: `http://localhost:5080`). Para cambiarla, definirla en el entorno antes de iniciar Vite o en un `.env.local` no versionado dentro de `frontend/`. En producción configurar la URL correspondiente al desplegar; Vite incorpora esta variable durante el build.

## Compilar y probar

Backend, desde `backend/`:

```sh
dotnet build Cards.sln
dotnet test Cards.sln
```

Frontend, desde `frontend/`:

```sh
npm install
npm test
npm run build
```

`npm test` ejecuta Vitest una vez; `npm run build` comprueba tipos TypeScript y genera el bundle de producción. Para servirlo localmente después de compilar: `npm run preview`.

## Persistencia PostgreSQL

La configuración de conexión activa el repositorio PostgreSQL; las consultas usan parámetros SQL. Si la variable no existe o está vacía, la aplicación no se conecta a la base y usa el repositorio in-memory.

1. Crear una base de datos PostgreSQL 13+ y conectarse a ella.
2. Aplicar los scripts en orden desde la raíz del repositorio (requiere `psql`):

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/V001__schema.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/V002__seed.sql
```

`DATABASE_URL` es aquí una variable local con una URI de conexión de PostgreSQL; no se necesita guardar credenciales en los archivos del proyecto. La migración inicial utiliza `gen_random_uuid()` (disponible en PostgreSQL 13+). El seed es idempotente para los IDs que inserta.

Configurar la cadena ADO.NET de Npgsql como `ConnectionStrings__Cards` y arrancar la API. Ejemplo con valores ficticios, adaptar a la instalación local:

```sh
export ConnectionStrings__Cards='Host=localhost;Port=5432;Database=cards;Username=cards_app;Password=local-dev-only'
export Cors__AllowedOrigins__0='http://localhost:5173'
dotnet run --project backend/src/Cards.Api --urls http://localhost:5080
```

No usar la contraseña del ejemplo fuera de desarrollo. La API no incluye ejecutor de migraciones: el despliegue debe aplicar los SQL explícitamente y otorgar a la identidad de runtime solo los permisos requeridos de lectura.

## Contrato HTTP e integración

- `GET /health` → estado básico de la API.
- `GET /api/v1/customers/{customerId}/cards` → lista de resúmenes; identificador inválido devuelve 400.
- `GET /api/v1/cards/{cardId}` → detalle por UUID; tarjeta ausente devuelve 404 con Problem Details.

Ejemplo con seed: `GET http://localhost:5080/api/v1/customers/demo-001/cards`; un ID de tarjeta conocido es `11111111-1111-1111-1111-111111111101`. El frontend consume las rutas anteriores y espera JSON camelCase.

CORS permite por defecto `http://localhost:5173`; para otros orígenes configurar `Cors__AllowedOrigins__0` (y demás índices si aplica). No hay autenticación, autorización, BFF ni conexión con un core real de tarjetas: estos componentes no están implementados. No exponer esta API públicamente ni considerarla lista para producción sin añadir autenticación/autorización, controles operativos y revisión de seguridad.

## Datos y seguridad

El esquema guarda solo PAN enmascarado y últimos cuatro dígitos; no guarda PAN completo ni CVV. Los datos demo no son datos de clientes reales. Proteger secretos mediante el gestor de secretos del entorno de ejecución, no en el repositorio. Aunque las rutas son de solo lectura, la API en su estado actual no autentica a quien consulta.

## Estructura

- `frontend/`: interfaz, servicio HTTP y pruebas Vitest.
- `backend/`: solución .NET con Domain, Application, Infrastructure y API; pruebas xUnit en `tests/Cards.UnitTests`.
- `db/migrations/`: esquema y seed de desarrollo.

**Verificación:** las instrucciones describen los manifiestos y fuentes existentes; build, pruebas y conexión a PostgreSQL no se ejecutaron al preparar este README.
