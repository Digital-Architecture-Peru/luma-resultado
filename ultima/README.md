# Consulta de tarjetas

Aplicación de solo lectura para listar y consultar tarjetas de un cliente. Frontend React + TypeScript (Vite), API .NET 8 y PostgreSQL. La API devuelve datos enmascarados: se almacena únicamente `pan_last4`; no se persisten PAN completo ni CVV.

## Estructura

- `frontend/`: aplicación y pruebas Vitest.
- `backend/`: solución .NET (`Cards.Api`, `Cards.Application`, `Cards.Infrastructure`) y pruebas xUnit.
- `db/migrations/`: SQL versionado; aplicar `V001` antes de `V002`.

## Requisitos

- Node.js y npm.
- .NET SDK 8.
- PostgreSQL accesible para ejecutar la API.

## Base de datos

Crea una base vacía `cards` y aplica las migraciones en orden, por ejemplo con `psql`:

```sh
createdb cards
psql -d cards -v ON_ERROR_STOP=1 -f db/migrations/V001__create_cards.sql
psql -d cards -v ON_ERROR_STOP=1 -f db/migrations/V002__seed_fictitious.sql
```

`V002` inserta datos ficticios para los clientes demo `11111111-1111-4111-8111-111111111111` y `22222222-2222-4222-8222-222222222222`. No vuelvas a ejecutar el seed sin limpiar antes la tabla: los IDs son claves primarias.

## Compilar y probar

Frontend:

```sh
cd frontend
npm install
npm run build  # incluye tsc --noEmit y el build de Vite
npm test       # Vitest en modo no interactivo
```

Backend:

```sh
cd backend
dotnet restore Cards.sln
dotnet build Cards.sln
dotnet test Cards.sln
```

## Ejecutar localmente

Arranca PostgreSQL, aplica las migraciones y configura la conexión en el entorno del proceso de la API. La cadena sigue el formato de Npgsql; no guardes credenciales en el repositorio.

```sh
# Terminal 1, desde la raíz del repositorio
CARDS_DB_CONNECTION='Host=localhost;Database=cards;Username=TU_USUARIO;Password=TU_PASSWORD' \
CORS_ORIGINS='http://localhost:5173' \
dotnet run --project backend/src/Cards.Api --urls http://localhost:5080
```

En otra terminal inicia la interfaz:

```sh
cd frontend
VITE_API_BASE_URL='http://localhost:5080' \
VITE_CUSTOMER_ID='11111111-1111-4111-8111-111111111111' \
npm run dev
```

Abre la URL que indique Vite (normalmente `http://localhost:5173`). Vite lee `VITE_*` al iniciar; reinícialo al cambiar esos valores. El frontend provee valores predeterminados para API (`http://localhost:5080`) y cliente demo.

## API e integración

La API permite GET solamente:

- `GET /health` — comprobación básica de disponibilidad.
- `GET /api/v1/cards` — lista del cliente.
- `GET /api/v1/cards/{cardId}` — detalle; devuelve 404 si la tarjeta no existe o no pertenece al cliente.

Las dos rutas de tarjetas requieren la cabecera `X-Customer-Id` con un UUID. Si falta o no es válido, responden 400 ProblemDetails. El cliente web la envía usando `VITE_CUSTOMER_ID`. CORS permite por defecto `http://localhost:5173` y se configura con `CORS_ORIGINS` (orígenes separados por comas).

**Advertencia de seguridad:** `X-Customer-Id` es un mecanismo mock de desarrollo, no autenticación. En un despliegue real, sustituirlo por identidad validada por un proveedor de autenticación y derivar el cliente de claims confiables; no aceptar el identificador elegido por el navegador como autorización. Usar TLS y administrar secretos mediante el entorno/gestor de secretos de la plataforma.

## Persistencia y diseño

`Cards.Api` recibe solicitudes HTTP; `Cards.Application` contiene consulta, DTOs y contrato `ICardRepository`; `Cards.Infrastructure` implementa ese contrato mediante PostgreSQL, Npgsql y Dapper. Las consultas usan parámetros y filtran por cliente. Las migraciones definen restricciones de formato y rangos, más un índice por `customer_id`. Sustituir el repositorio permite integrar un sistema de tarjetas/core sin acoplar la lógica de consulta al proveedor.

La persistencia actual es PostgreSQL de solo lectura desde esta API; no hay endpoints de escritura ni se guardan datos en memoria del servidor. Los importes y estados de las migraciones son datos demostrativos, no información bancaria real.

## Configuración

- `CARDS_DB_CONNECTION`: cadena de conexión PostgreSQL; obligatoria para iniciar el repositorio.
- `CORS_ORIGINS`: lista separada por comas; valor por defecto `http://localhost:5173`.
- `VITE_API_BASE_URL`: URL base de la API; por defecto `http://localhost:5080`.
- `VITE_CUSTOMER_ID`: UUID usado por el mock; por defecto el cliente demo indicado arriba.

No se pudo verificar la ejecución de compilación o pruebas en esta sesión.
