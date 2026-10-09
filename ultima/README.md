# Pago de tarjetas · Banca por Internet

Aplicación de ejemplo para consultar tarjetas y movimientos, y registrar pagos. Stack: Angular 17 standalone, .NET 8 Web API y PostgreSQL. Los datos de seed y el procesador de pagos son ficticios; no usar en producción.

## Estructura

- `frontend/`: interfaz Angular y pruebas Jest.
- `backend/`: solución .NET (`Cards.Api`, `Cards.Application`, `Cards.Domain`, `Cards.Infrastructure`) y pruebas unitarias xUnit.
- `db/migrations/`: SQL de esquema y datos demostrativos.

## Requisitos

- Node.js compatible con Angular CLI 17 y npm.
- .NET SDK 8.
- PostgreSQL accesible para la API.

## Base de datos

Crear una base vacía y aplicar los scripts en orden desde la raíz del repositorio. Configure `DATABASE_URL` con una cadena reconocida por `psql`:

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/V001__init.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/V002__seed.sql
```

Ejemplo local (no usar credenciales reales):

```sh
export DATABASE_URL='postgresql://localhost:5432/cards_dev'
```

Los scripts no son un migrador ni están diseñados para repetirse sobre una base ya creada: V001 crea tablas e índices; V002 agrega registros ficticios. Para reiniciar localmente, use una base vacía. El esquema persiste tarjetas y transacciones; `NUMERIC(18,2)` almacena importes, la clave de idempotencia es única y existe un índice por tarjeta/fecha. El PAN completo no se almacena, solo el valor enmascarado del seed.

## Backend (.NET)

Desde la raíz, configure la cadena de conexión requerida (no guardar secretos en archivos versionados) y ejecute:

```sh
export ConnectionStrings__Cards='Host=localhost;Port=5432;Database=cards_dev;Username=TU_USUARIO;Password=TU_PASSWORD'
export Cors__AllowedOrigin='http://localhost:4200' # opcional; este es el valor por defecto
export ASPNETCORE_URLS='http://localhost:5080'
cd backend
dotnet restore Cards.sln
dotnet build Cards.sln
dotnet test Cards.sln
dotnet run --project src/Cards.Api
```

`ConnectionStrings__Cards` debe apuntar a la base con los scripts aplicados; la API falla al iniciar si falta. La infraestructura usa Npgsql y Dapper con consultas parametrizadas. La aplicación no aplica migraciones automáticamente. `GET /health` sirve como comprobación básica de disponibilidad.

### API

Base URL local: `http://localhost:5080/api/v1`.

- `GET /cards`: lista tarjetas.
- `GET /cards/{id}/transactions?page=1`: lista movimientos de la tarjeta.
- `POST /cards/{id}/payments`: registra un pago.

Ejemplo de pago:

```sh
curl -i -X POST 'http://localhost:5080/api/v1/cards/11111111-1111-4111-8111-111111111111/payments' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: demo-payment-001' \
  -d '{"amount":25.00,"currency":"USD","sourceAccountAlias":"Cuenta demo"}'
```

La clave de idempotencia es obligatoria (máximo 64 caracteres). Una repetición con la misma clave y contenido devuelve la transacción existente; reutilizarla para otro pago produce conflicto. Las respuestas de error usan `application/problem+json`. El middleware de errores y las validaciones determinan los códigos HTTP según el error (por ejemplo, solicitud inválida, tarjeta inexistente o conflicto).

## Frontend (Angular)

En otra terminal:

```sh
cd frontend
npm install
npm run build
npm test -- --runInBand
npm start
```

Abre `http://localhost:4200`. La URL base de la API está declarada en `frontend/src/environments/environment.ts` como `http://localhost:5080/api/v1`; actualizarla para otros entornos y permitir ese origen en CORS del backend. El script de pruebas invoca Jest.

## Integración y persistencia

Angular usa `CardsApiService` para llamar a la API; el origen configurado debe coincidir con `Cors__AllowedOrigin`. La API organiza el caso de uso en Application y delega lectura/escritura al contrato de repositorio implementado en Infrastructure sobre PostgreSQL. El pago actualiza condicionalmente el saldo disponible y registra el movimiento dentro de una transacción; una restricción única en base de datos y la lógica del caso de uso respaldan la idempotencia, incluso ante solicitudes concurrentes.

`ICardProcessorGateway` aísla la autorización externa; hoy se inyecta `FakeCardProcessorGateway`, que aprueba importes de hasta 100 000. No hay conexión con un procesador real ni un contrato definido: sustituir esa implementación y acordar autenticación, manejo de credenciales, timeouts y reconciliación antes de una integración real. `sourceAccountAlias` es validado, pero en el estado actual no se persiste como dato de transacción.

## Pruebas y límites conocidos

`dotnet test backend/Cards.sln` ejecuta pruebas unitarias xUnit. `npm test -- --runInBand` ejecuta pruebas Jest del servicio HTTP y componentes Angular. No hay pruebas E2E ni pruebas de integración automatizadas contra PostgreSQL; la ejecución del backend y la verificación completa del flujo requieren una base PostgreSQL preparada manualmente. Autenticación y autorización no están implementadas, por lo que este ejemplo no debe exponerse como servicio bancario real.
