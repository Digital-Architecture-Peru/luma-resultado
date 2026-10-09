# Consulta de Pagos — React + TypeScript y .NET 8

Aplicación de consulta de pagos con frontend Vite/React, API ASP.NET Core minimal y persistencia opcional en PostgreSQL. Los datos de ejemplo son ficticios. Esta guía refleja la estructura y configuración existentes; no presupone integración con servicios bancarios reales.

## Requisitos

- Node.js 20 o posterior y npm.
- .NET SDK 8.
- PostgreSQL solo si se quiere usar persistencia en base de datos (la API funciona sin él usando memoria).

## Ejecutar en desarrollo

Abra dos terminales desde la raíz del repositorio.

Terminal 1, API:

```sh
cd api
dotnet restore Pagos.sln
dotnet run --project src/Pagos.Api --urls http://localhost:5080
```

Terminal 2, frontend:

```sh
cd web
npm install
npm run dev
```

Abra la URL indicada por Vite (por defecto `http://localhost:5173`). El origen permitido por defecto de CORS coincide con esa URL. La aplicación espera que la API esté en `http://localhost:5080`.

### Configuración

La API lee `ConnectionStrings:Pagos` y `Cors:AllowedOrigin` desde la configuración estándar de ASP.NET Core. En variables de entorno se expresan como `ConnectionStrings__Pagos` y `Cors__AllowedOrigin`. Si no se define una cadena de conexión no vacía, se registra `InMemoryPagoRepository` con diez pagos ficticios.

El frontend lee variables Vite con prefijo `VITE_`:

| Variable | Valor por defecto | Propósito |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5080` | URL base de la API, sin sufijo de ruta. |
| `VITE_CLIENTE_ID` | `11111111-1111-1111-1111-111111111111` | UUID enviado como header stub `X-Cliente-Id`. |
| `VITE_LOCALE` | `es` | Locale de presentación. |

El archivo de referencia existente es `web/env.example.txt`. Vite carga normalmente variables desde un archivo llamado `.env` en `web/`; copie los valores de referencia a `web/.env` y ajústelos para el entorno local. No incluya secretos en variables `VITE_*`: se incorporan al bundle del navegador.

## Compilar y probar

Desde la raíz:

```sh
cd api
dotnet build Pagos.sln
dotnet test Pagos.sln
```

En otra terminal:

```sh
cd web
npm install
npm run build
npm test
```

`npm run build` ejecuta primero `tsc --noEmit` y después el build de Vite. `npm test` ejecuta Vitest en modo no interactivo. Las pruebas .NET son xUnit; las pruebas web usan Vitest y Testing Library.

## API e integración

- `GET /health`: comprobación básica de disponibilidad.
- `GET /api/v1/pagos?desde&hasta&estado&page&pageSize`: consulta paginada, respuesta con `items`, `page`, `pageSize` y `total`.
- `GET /api/v1/pagos/{id}`: detalle; devuelve 404 si no existe para el cliente consultante.

La lista acepta los estados `PENDIENTE`, `PROCESADO`, `RECHAZADO` y `REVERSADO`. Sin fechas se consulta por defecto un periodo reciente de 30 días; la validación limita el rango a 90 días. `page` comienza en 1 y `pageSize` admite de 1 a 50 (predeterminado 20). Los filtros inválidos producen 400 Problem Details. Las consultas devuelven la cuenta destino enmascarada.

El cliente web llama a la API mediante `web/src/services/pagosApi.ts`, enviando `X-Cliente-Id`. **Ese header es un stub de desarrollo, no autenticación.** Un usuario puede manipularlo; no despliegue esta versión exponiéndola a usuarios o datos reales. Antes de una integración bancaria se debe sustituir por autenticación/autorización confiable del lado servidor y derivar la identidad del cliente de la sesión validada. No hay conexión configurada a sistemas bancarios externos.

## Persistencia PostgreSQL

Las migraciones SQL se encuentran en `db/migrations/` y deben aplicarse en orden, una sola vez, a una base vacía o compatible:

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/V001__esquema_pagos.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/V002__seed_ficticio.sql
```

`V001` crea la tabla `pagos`, restricciones e índice por cliente y fecha. `V002` carga registros ficticios para dos UUID de demostración; no lo ejecute en datos reales. Estos scripts no implementan por sí solos un gestor de historial de migraciones: registre las versiones aplicadas con el mecanismo operativo de su entorno para evitar volver a ejecutar el seed.

Configure la API con una cadena PostgreSQL válida, sin poner credenciales en el repositorio. Ejemplo de formato (reemplace los valores localmente):

```text
Host=localhost;Port=5432;Database=pagos;Username=USUARIO;Password=CONTRASENA
```

En bash, por ejemplo:

```sh
export ConnectionStrings__Pagos='Host=localhost;Port=5432;Database=pagos;Username=USUARIO;Password=CONTRASENA'
```

En PowerShell:

```powershell
$env:ConnectionStrings__Pagos = 'Host=localhost;Port=5432;Database=pagos;Username=USUARIO;Password=CONTRASENA'
```

Luego inicie la API con el comando de desarrollo anterior. Cuando la conexión se configura, la infraestructura utiliza `PgPagoRepository` con consultas parametrizadas y filtro por `cliente_id`; si se omite, los datos en memoria no persisten al reiniciar.

## Organización

- `web/src/components/`: componentes de interfaz organizados en atoms, molecules, organisms y templates; `pages/`, `hooks/` y `services/` componen la consulta.
- `api/src/Pagos.Domain/`: modelo de dominio; `Pagos.Application/`: consulta y contratos; `Pagos.Infrastructure/`: repositorios PostgreSQL y memoria; `Pagos.Api/`: endpoints y configuración.
- `api/tests/Pagos.Application.Tests/`: pruebas unitarias de aplicación.
- `db/migrations/`: esquema y seed ficticio versionados.

## Alcance de verificación

Esta documentación describe los comandos definidos por los manifiestos y el código leído. No se ejecutaron aquí compilaciones, pruebas ni migraciones, y la persistencia PostgreSQL requiere validación en un servidor disponible.