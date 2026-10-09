# Pagos — ejemplo full stack

Aplicación demostrativa con Angular 17, .NET 8 Web API y PostgreSQL opcional. Los datos son ficticios; no procesa pagos reales. `X-Customer-Id` es una cabecera de ejemplo, no autenticación.

## Requisitos

Node.js/npm (Angular CLI 17), .NET SDK 8 y, opcionalmente, Docker Compose. Chrome/Chromium headless se requiere para las pruebas Karma del frontend.

## Ejecución

### PostgreSQL (opcional)

Desde la raíz del proyecto:

```bash
DB_PASSWORD=clave-local docker compose up -d
```

Compose inicia solamente PostgreSQL en el puerto 5432. Al inicializar un volumen vacío, la imagen ejecuta en orden `db/migrations/V001__init.sql` y `V002__seed.sql`. No repite los scripts con un volumen existente. Para borrar la base local y recrearla (se pierden los datos): `docker compose down -v` y vuelve a ejecutar `docker compose up -d` con `DB_PASSWORD` definido.

### API

```bash
cd backend
dotnet restore
dotnet run --project src/Payments.Api --urls http://localhost:5080
```

Si no se define `PAYMENTS_DB_CONNECTION`, se usa almacenamiento en memoria y los registros se pierden al reiniciar. Para persistir en PostgreSQL, configura esa variable con una cadena Npgsql que apunte a `localhost:5432`, base `payments`, usuario `payments_app` y la contraseña definida para Compose. No incluyas la contraseña en archivos versionados.

Configuraciones adicionales: `Payments__MaxAmount` (predeterminado 10000) y `Cors__Origins` (predeterminado `http://localhost:4200`, admite orígenes separados por coma). Estado: <http://localhost:5080/health>.

### Angular

En otra terminal:

```bash
cd frontend
npm install
npm start
```

Abre <http://localhost:4200>. `src/environments/environment.ts` define la API local y el cliente ficticio `C-1001`.

## Compilar y probar

```bash
cd backend
dotnet build Payments.sln
dotnet test Payments.sln
```

```bash
cd frontend
npm install
npm run build
npm test
```

Las pruebas .NET son unitarias y no requieren base de datos. `npm test` ejecuta Karma sin watch y requiere Chrome/Chromium headless.

## API e integración

- `POST /api/v1/payments`: cabeceras `X-Customer-Id` e `Idempotency-Key`; cuerpo con `sourceAccountId`, `beneficiaryAccount`, `amount`, `currency` y `concept`. Respuestas de creación `201`, validación `400` y clave duplicada `409`.
- `GET /api/v1/payments/{id}`: consulta asociada al cliente de la cabecera `X-Customer-Id`.
- `GET /api/v1/payments?accountId={id}`: lista pagos de la cuenta de origen; máximo 100.
- `GET /health`: estado básico.

El frontend concentra las solicitudes en `PaymentApiService`. CORS permite por defecto el origen local Angular. `IPaymentProcessor` es el punto de integración; hoy se inyecta `FakePaymentProcessor`, sin llamadas externas, que rechaza como caso demostrativo cuentas destino terminadas en `0000`. Para una integración real hay que sustituirlo y definir autenticación, errores y estados del proveedor.

## Persistencia y límites

`IPaymentRepository` separa persistencia del dominio. Con `PAYMENTS_DB_CONNECTION` se usa PostgreSQL mediante Npgsql/Dapper; sin esa variable se usa memoria. Las consultas son parametrizadas. El índice único sobre `idempotency_key` aplica globalmente, no por cliente.

Las migraciones SQL están en `db/migrations`; la API no las ejecuta. Compose las carga solamente al inicializar una base vacía. `V002__seed.sql` contiene pagos ficticios para `C-1001`. Para bases existentes, aplica las migraciones con un procedimiento operacional controlado.

No apto para producción tal cual: el cliente indicado en `X-Customer-Id` no se autentica ni autoriza; no existe procesador real ni gestión de saldos. Protege la conexión y añade autenticación, autorización y controles operativos antes de exponer el servicio.