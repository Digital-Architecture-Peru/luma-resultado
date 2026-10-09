# Transferencias entre cuentas propias

Aplicación de ejemplo Full Stack con frontend Angular standalone, API .NET 8 Minimal API y PostgreSQL. Utiliza exclusivamente datos ficticios; la identidad del titular está simulada y no hay autenticación. **No usar en producción ni exponer en una red pública.**

## Requisitos

- .NET SDK 8
- Node.js compatible con Angular 20 (Node.js 20.19+, 22.12+ o 24+ recomendado) y npm
- PostgreSQL 13 o posterior
- `psql` para aplicar directamente las migraciones (alternativamente, ejecútelas con Flyway)

## Base de datos

Cree una base vacía, por ejemplo `banca`, y aplique los scripts en orden. Desde la raíz del repositorio, con `DATABASE_URL` en formato aceptado por `psql`:

```sh
createdb banca
export DATABASE_URL='postgresql://usuario:contraseña@localhost:5432/banca'
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/V001__esquema.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/V002__indices.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/V003__seed_ficticio.sql
```

`V001` crea cuentas, transferencias y movimientos con restricciones; `V002` agrega índices y `V003` inserta cuentas ficticias. Los scripts no llevan seguimiento de versiones ni están diseñados para reaplicarse sobre una base ya migrada. Para Flyway, configure su ubicación a `db/migrations` y ejecute `flyway migrate` con la conexión correspondiente. Mantenga las migraciones existentes inmutables y realice cambios mediante nuevas versiones.

## Compilar y probar

Backend, desde la raíz:

```sh
cd backend
dotnet restore Cuentas.sln
dotnet build Cuentas.sln
dotnet test Cuentas.sln
```

La suite `Cuentas.UnitTests` comprueba reglas y el caso de transferencia con un fake de unidad de trabajo; son pruebas unitarias, no una prueba de integración con PostgreSQL.

Frontend:

```sh
cd frontend
npm install
npm run build
npm test
```

`npm test` ejecuta Angular CLI sin modo watch (builder de pruebas unitarias con Vitest/jsdom). El frontend usa un proxy de desarrollo para `/api`.

## Ejecutar localmente

Aplique primero las migraciones y configure la conexión de la API mediante variable de entorno; no incluya contraseñas en el repositorio:

```sh
# Terminal 1; establezca aquí una cadena de conexión válida para su entorno.
# Ejemplo de forma: Host=localhost;Port=5432;Database=banca;Username=usuario;Password=...
export ConnectionStrings__Cuentas='Host=localhost;Port=5432;Database=banca;Username=usuario;Password=...'
export CORS_ORIGIN='http://localhost:4200' # opcional; valor predeterminado de desarrollo
cd backend/src/Cuentas.Api
dotnet run --urls http://localhost:5080
```

En otra terminal:

```sh
cd frontend
npm start
```

Abra `http://localhost:4200`. El proxy definido en `frontend/proxy.conf.json` redirige `/api` a `http://localhost:5080`. Para desarrollo frontend sin proxy, el servicio Angular usa `/api/v1` como URL base; en despliegue, enrute esa ruta al backend mediante un reverse proxy. La API requiere PostgreSQL disponible y una base con las migraciones aplicadas.

## Integración y contrato HTTP

No hay integraciones externas, autenticación ni autorización en este ejemplo. La API simula un titular fijo y filtra sus cuentas; el seed contiene también una cuenta de otro titular para ilustrar ese límite. Añada identidad autenticada y autorización por cuenta antes de cualquier uso real.

- `GET /health`: comprobación básica de disponibilidad.
- `GET /api/v1/cuentas`: devuelve las cuentas del titular simulado.
- `POST /api/v1/transferencias`: recibe `{ "origenId": "...", "destinoId": "...", "monto": 10.00, "moneda": "USD", "concepto": "..." }` y requiere la cabecera `Idempotency-Key`.
- Una transferencia nueva devuelve `201`; una repetición idéntica con la misma clave devuelve `200`. Reutilizar la clave con origen, destino, monto o moneda diferentes produce `409`.
- Errores previstos: `400` validación de entrada, `404` cuenta no encontrada, `409` conflicto de idempotencia y `422` regla de negocio. La API habilita CORS para un origen configurado por `CORS_ORIGIN` (por defecto `http://localhost:4200`).

El frontend obtiene cuentas y envía transferencias por `TransferenciasService`; genera una clave UUID y la conserva ante reintentos mientras la operación no se confirme. El backend valida la solicitud y delega reglas al dominio y la persistencia a los puertos de aplicación e infraestructura.

## Persistencia y consistencia

PostgreSQL se accede desde infraestructura con Npgsql y Dapper. La operación abre una sola transacción, consulta la clave de idempotencia, bloquea las cuentas con `SELECT ... FOR UPDATE` en orden de identificador, actualiza ambos saldos e inserta la transferencia y sus dos movimientos antes de confirmar. Un fallo revierte la transacción. La clave de idempotencia tiene restricción `UNIQUE`; los importes usan `numeric(18,2)` y el saldo tiene restricción no negativa. No hay broker, servicio externo, almacenamiento alternativo ni configuración de reintentos distribuida.

## Configuración y límites conocidos

- `ConnectionStrings__Cuentas`: obligatoria; cadena Npgsql para PostgreSQL.
- `CORS_ORIGIN`: opcional; origen permitido por CORS, predeterminado `http://localhost:4200`.
- Identidad simulada fija, sin login, seguridad de sesión ni controles de producción; seed exclusivamente ficticio.
- La configuración de conexión debe suministrarse fuera del código y del control de versiones. Use un gestor de secretos en entornos reales.
- No se verificó la compilación, las pruebas ni el comportamiento contra una instancia real de PostgreSQL en este entorno.
