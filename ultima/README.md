# Pagos de tarjetas — React + TypeScript y .NET 8

Aplicación de ejemplo para registrar pagos de tarjeta de crédito y consultar movimientos. La interfaz está en `frontend/` (Vite, React y TypeScript); la API está en `backend/` (ASP.NET Core 8, organizada en Api, Application, Domain e Infrastructure). PostgreSQL almacena tarjetas y transacciones. Los datos incluidos son ficticios.

## Requisitos

- Node.js y npm compatibles con Vite 5 (Node.js 18+ recomendado).
- .NET SDK 8.
- PostgreSQL 13+ en ejecución y `psql` disponible para aplicar los scripts.

## Base de datos

Desde la raíz del repositorio, crea una base local (por ejemplo `cards`) y ejecuta las migraciones en orden:

```sh
createdb cards
psql -v ON_ERROR_STOP=1 -d cards -f db/migrations/V001__schema.sql
psql -v ON_ERROR_STOP=1 -d cards -f db/migrations/V002__indexes.sql
psql -v ON_ERROR_STOP=1 -d cards -f db/migrations/V003__seed_ficticio.sql
```

Si tu instalación requiere usuario o host explícitos, configúralos mediante las opciones habituales de `psql`/`createdb`. Los scripts crean el esquema, índices y dos tarjetas de demostración con movimientos ficticios. No vuelvas a ejecutar el seed sobre la misma base: sus identificadores son fijos y se producirían conflictos. Para reiniciar el entorno local, elimina y crea de nuevo la base antes de aplicar los scripts.

## Compilar, probar y ejecutar el backend

La cadena de conexión y el origen permitido se configuran por variables de entorno. No guardes credenciales reales en el repositorio. Ejemplo para una shell tipo Bash (reemplaza los valores locales):

```sh
export ConnectionStrings__Cards='Host=localhost;Database=cards;Username=postgres;Password=CAMBIAR_LOCALMENTE'
export Payments__MaxAmount=5000
export Cors__AllowedOrigin=http://localhost:5173
cd backend
dotnet restore Cards.sln
dotnet build Cards.sln
dotnet test Cards.sln
dotnet run --project src/Cards.Api --urls http://localhost:5080
```

Configura las variables en el mecanismo apropiado de tu sistema operativo o IDE si no utilizas Bash. `ConnectionStrings__Cards` es obligatoria; `Payments__MaxAmount` y `Cors__AllowedOrigin` son opcionales (por defecto, `5000` y `http://localhost:5173`). La API queda en `http://localhost:5080`. Comprueba disponibilidad con `GET /health`.

## Compilar, probar y ejecutar el frontend

En otra terminal, desde la raíz:

```sh
cd frontend
npm install
npm run build
npm test
npm run dev
```

El build ejecuta el chequeo de tipos de TypeScript y Vite. Las pruebas Vitest se ejecutan una vez, sin modo interactivo. Vite publica la app en la dirección que indique al iniciar (normalmente `http://localhost:5173`). La URL de API opcional se configura antes de ejecutar/build mediante `VITE_API_URL`; el valor por defecto es `http://localhost:5080`. Por ejemplo: `VITE_API_URL=http://localhost:5080 npm run dev` en Bash.

## API e integración

La interfaz usa `frontend/src/services/cardTransactionsApi.ts` para llamar a la API. Rutas implementadas:

- `GET /health`: indicador básico de disponibilidad.
- `GET /v1/cards`: tarjetas activas.
- `GET /v1/cards/{cardId}/transactions?limit=20`: movimientos, ordenados del más reciente; el límite predeterminado es 20 y se acota a 1–100.
- `POST /v1/card-payments`: registra un pago; requiere cabecera `Idempotency-Key` de 8–64 caracteres. Cuerpo JSON: `{"cardId":"11111111-1111-4111-8111-111111111111","amount":25.50,"currency":"USD"}`.

Una operación nueva responde `201`; el reintento con una clave ya registrada responde `200` con la transacción existente. La clave es global y se devuelve la operación anterior aunque el nuevo cuerpo sea distinto. Errores de dominio se exponen como `application/problem+json` (por ejemplo, 422 para una operación inválida y 404 para una tarjeta inexistente o inactiva). El origen CORS permitido se puede cambiar con `Cors__AllowedOrigin`.

El puerto `ICardTransactionGateway` separa la autorización de la lógica de aplicación, pero actualmente está conectado a `FakeCoreGateway`, no a un procesador bancario real. En la simulación, importes que terminan en `.99` se rechazan; además, se rechazan importes superiores al límite configurado. La integración con un core real, autenticación/autorización de usuarios, gestión de secretos operativa y cumplimiento de requisitos regulatorios quedan fuera del alcance de este ejemplo. No debe exponerse como servicio financiero real sin esos controles.

## Persistencia y datos sensibles

`DapperCardTransactionRepository` implementa el puerto `ICardTransactionRepository` sobre PostgreSQL usando Npgsql y consultas parametrizadas. `db/migrations/V001__schema.sql` define tarjetas y transacciones; V002 añade el índice para consultar movimientos por tarjeta/fecha. La restricción única de `idempotency_key`, junto con `INSERT ... ON CONFLICT DO NOTHING`, protege la inserción ante reintentos concurrentes. Las migraciones se aplican manualmente con `psql` o pueden gestionarse con una herramienta de migraciones elegida por el equipo.

El seed contiene identificadores, alias y tokens ficticios para desarrollo. El esquema conserva solo PAN enmascarado y un token ficticio: no envíes ni almacenes el PAN completo o CVV. La base debe ser local/de prueba; define copias de seguridad, permisos, cifrado y retención antes de cualquier uso no local.

## Pruebas y límites de verificación

- Backend: pruebas unitarias xUnit en `backend/tests/Cards.UnitTests`; `dotnet test Cards.sln`.
- Frontend: pruebas Vitest/Testing Library en `frontend/src/__tests__`; `npm test`.
- Las pruebas existentes no sustituyen pruebas de integración con PostgreSQL ni verifican un core externo. El build y las pruebas deben ejecutarse localmente con los SDK y servicios requeridos; este documento no afirma que se hayan ejecutado en este entorno.
