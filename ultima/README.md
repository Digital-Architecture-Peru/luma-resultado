# Consulta de Pagos

Aplicación de solo lectura para consultar pagos, compuesta por frontend Angular 17, API .NET 8 Minimal API y PostgreSQL. Los registros incluidos en el seed son ficticios. La identidad del cliente es actualmente simulada: no se debe exponer esta configuración como autenticación de producción.

## Requisitos

- .NET SDK 8
- Node.js compatible con Angular 17 y npm
- PostgreSQL y `psql` para ejecutar la aplicación con persistencia

## Estructura

- `frontend/`: Angular, componentes organizados por Atomic Design, cliente HTTP y pruebas Jest.
- `backend/`: solución .NET con proyectos Domain, Application, Infrastructure y Api, más pruebas unitarias xUnit.
- `db/migrations/`: SQL de esquema y seed ficticio, aplicar en orden.

## Configuración y base de datos

Crear una base de datos PostgreSQL llamada `pagos` (o elegir otro nombre y ajustar la conexión), por ejemplo:

```sh
createdb pagos
psql -d pagos -v ON_ERROR_STOP=1 -f db/migrations/V001__esquema.sql
psql -d pagos -v ON_ERROR_STOP=1 -f db/migrations/V002__seed_ficticio.sql
```

Las migraciones no son idempotentes: no volver a aplicarlas sobre una base ya inicializada. V001 crea `pagos`, restricciones e índices; V002 inserta datos de demostración relativos al momento de ejecución. Para reiniciar el entorno local, eliminar y recrear la base de datos y ejecutar ambas migraciones.

Configurar las variables en el entorno del proceso que ejecuta la API:

| Variable | Uso | Valor de desarrollo sugerido |
|---|---|---|
| `PAGOS_DB_CONNECTION` | Cadena de conexión Npgsql. Obligatoria al iniciar la API. | `Host=localhost;Port=5432;Database=pagos;Username=postgres;Password=<contraseña-local>` |
| `PAGOS_STUB_CUENTAS` | Identificadores de cuenta autorizados por el stub, separados por coma. | `0012345678,0098765432` (valor por defecto) |
| `CORS_ORIGIN` | Origen único permitido por CORS. | `http://localhost:4200` (valor por defecto) |

No guardar contraseñas reales en el repositorio. La URL del backend que utiliza Angular se define en `frontend/src/environments/environment.ts` como `apiBaseUrl` y, por tanto, queda fijada al compilar el frontend.

## Ejecutar en desarrollo

Inicializar PostgreSQL y las migraciones según la sección anterior. Luego ejecutar cada proceso en una terminal separada.

### API

Desde la raíz del repositorio:

```sh
# Linux/macOS
export PAGOS_DB_CONNECTION='Host=localhost;Port=5432;Database=pagos;Username=postgres;Password=<contraseña-local>'
export CORS_ORIGIN='http://localhost:4200'

cd backend
dotnet restore Pagos.sln
dotnet run --project src/Pagos.Api/Pagos.Api.csproj --urls http://localhost:5080
```

En PowerShell, establecer las variables con `$env:PAGOS_DB_CONNECTION = '...'` y `$env:CORS_ORIGIN = 'http://localhost:4200'` antes de ejecutar `dotnet`.

### Frontend

```sh
cd frontend
npm install
npm start
```

Abrir `http://localhost:4200`. Para consumir otro backend, actualizar `apiBaseUrl` en el archivo de environment antes de iniciar o compilar.

## Compilar y probar

```sh
# Backend, desde backend/
dotnet build Pagos.sln
dotnet test Pagos.sln

# Frontend, desde frontend/
npm install
npm test
npm run build
```

`dotnet test` ejecuta las pruebas xUnit de validación y del handler con dobles de prueba; no requiere una base PostgreSQL. `npm test` ejecuta Jest en modo CI/no interactivo. El build de Angular realiza la compilación de producción.

## API disponible

- `GET /health`: comprobación básica de disponibilidad; devuelve `status: ok`.
- `GET /api/v1/pagos?desde=<ISO-8601>&hasta=<ISO-8601>&estado=<estado>&page=1&size=20`: consulta paginada. Estado es opcional; paginación y fechas se validan en Application. El tamaño máximo es 100 y el rango máximo es 90 días; si se omiten fechas, la consulta usa los últimos 30 días. Errores de validación se devuelven como `application/problem+json` con estado 400.
- `GET /api/v1/pagos/{id}`: detalle por UUID. Devuelve 404 si el pago no existe o no pertenece a las cuentas del cliente actual.

Estados admitidos: `PENDIENTE`, `PROCESADO`, `RECHAZADO` y `ANULADO`. Las fechas se almacenan como `timestamptz` y se consultan en UTC.

## Integración y persistencia

Angular inyecta `PagosApiService`, que envía solicitudes HTTP a la URL configurada en `environment.ts`; `HttpClient` recibe el filtro de consulta y modela la página de respuesta. La API registra `ConsultarPagosHandler` y `ObtenerPagoHandler`, los cuales dependen de las abstracciones de Application. `PagoRepository` implementa `IPagoRepository` usando Dapper y Npgsql; sus consultas parametrizan los valores y limitan lectura a las cuentas de `ICurrentCustomer`.

En esta entrega, `StubCurrentCustomer` obtiene `PAGOS_STUB_CUENTAS` o usa las dos cuentas ficticias predeterminadas. No hay proveedor de identidad, autenticación ni integración con un gateway implementados: la sustitución del stub por identidad confiable del canal es un requisito antes de cualquier despliegue real. CORS permite el origen indicado por `CORS_ORIGIN`.

PostgreSQL persiste los pagos en la tabla `pagos`: monto `numeric(18,2)`, código de moneda de tres letras, estado restringido y fecha `timestamptz`; existen índices por cuenta/fecha y estado. Las migraciones SQL son la fuente del esquema y del seed, no hay migrador automático en la API. El repositorio implementa únicamente operaciones de consulta.

## Límites conocidos

Los datos son de demostración y el stub de cliente no es una medida de seguridad. Las pruebas unitarias no verifican conexión real a PostgreSQL ni ejecución de migraciones; para validar la integración completa hace falta una base configurada y arrancar API y Angular. No se afirma aquí que build, pruebas o SQL hayan sido ejecutados.
