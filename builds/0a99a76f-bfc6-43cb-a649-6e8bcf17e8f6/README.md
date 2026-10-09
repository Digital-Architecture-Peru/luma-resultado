# Cuentas · Transacción

Aplicación de demostración para transferencias entre cuentas propias en la misma moneda. Stack: React + TypeScript (Vite) y .NET 8 Minimal API, con PostgreSQL mediante Npgsql. Los datos son ficticios. **Candidate: no usar en producción.**

## Requisitos

- .NET SDK 8
- Node.js compatible con Vite 5 y npm
- PostgreSQL y `psql`

## Preparar PostgreSQL

Crea una base vacía (por ejemplo, `cuentas_dev`) y aplica los scripts desde la raíz del repositorio, en este orden:

```sh
psql "$CUENTAS_DB" -v ON_ERROR_STOP=1 -f db/migrations/V001__schema.sql
psql "$CUENTAS_DB" -v ON_ERROR_STOP=1 -f db/migrations/V002__seed_ficticio.sql
```

`CUENTAS_DB` debe contener una cadena de conexión Npgsql válida, por ejemplo `Host=localhost;Port=5432;Database=cuentas_dev;Username=...;Password=...`. Configúrala en el entorno local; no guardes credenciales en el repositorio. La semilla crea cuentas ficticias de desarrollo y puede aplicarse otra vez sin duplicar los números de cuenta.

## Compilar y ejecutar

En una terminal, desde la raíz, configura las variables y arranca la API:

```sh
export CUENTAS_DB='Host=localhost;Port=5432;Database=cuentas_dev;Username=...;Password=...'
export ASPNETCORE_URLS='http://localhost:5080'
dotnet run --project backend/src/Cuentas.Api/Cuentas.Api.csproj
```

En otra terminal:

```sh
cd frontend
npm install
npm run dev
```

Abre la URL local que informa Vite (normalmente `http://localhost:5173`). El proxy de Vite reenvía `/api` a `http://localhost:5080`. Para generar el frontend de producción y ejecutar su comprobación TypeScript:

```sh
cd frontend
npm run build
```

La solución .NET se puede compilar desde la raíz con `dotnet build backend/Cuentas.sln`.

## Pruebas

```sh
dotnet test backend/Cuentas.sln
cd frontend
npm test
```

Las pruebas .NET son unitarias de dominio/servicio; no requieren PostgreSQL. Las pruebas frontend usan Vitest y no requieren una API ni base de datos activa. `npm run build` también ejecuta `tsc --noEmit` antes de Vite.

## API

- `GET /health`: estado básico de la API.
- `GET /api/accounts`: cuentas.
- `GET /api/accounts/{id}/transactions?limit=20`: movimientos de la cuenta; el límite se acota entre 1 y 100.
- `POST /api/transfers`: cuerpo JSON `{ "sourceAccountId": 1, "targetAccountId": 2, "amount": "10.50", "description": "..." }`. Requiere el encabezado `Idempotency-Key`. Montos se envían como decimal en string.

Una solicitud nueva responde `201`; un reintento idéntico de clave idempotente responde `200`. Los errores se exponen como Problem Details. La implementación contempla respuestas de validación/no encontrado/conflicto indicadas por la capa API y dominio.

## Integración y persistencia

La UI consume la API HTTP a través de `frontend/src/api/accountsClient.ts`; en desarrollo Vite realiza el proxy `/api`. No hay integración con core bancario, proveedor externo ni autenticación: la aplicación es una demo sin identidad de usuario y no debe exponerse públicamente.

La API usa PostgreSQL/Npgsql, consultas parametrizadas e interfaces de aplicación (`IAccountRepository`, `ITransferUnitOfWorkFactory`) para aislar persistencia. Las migraciones SQL están en `db/migrations/` y deben aplicarse manualmente, en orden; no se ejecutan automáticamente al iniciar la API. La transferencia registra ambos movimientos, actualiza saldos y crea la transferencia dentro de una transacción; bloquea cuentas en orden de id para evitar interbloqueo y la clave idempotente tiene restricción única en la base. No se incluye contenedor ni configuración de despliegue.

## Límites de verificación

La documentación describe el código presente, pero no se ejecutaron build, pruebas ni migraciones en esta sesión. Verifica el comportamiento con la versión local de .NET, Node y PostgreSQL antes de usarlo.