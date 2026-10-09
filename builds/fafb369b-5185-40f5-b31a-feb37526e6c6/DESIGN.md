# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + .NET (capa Full Stack) para "Consulta" sobre Pagos en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + .NET y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento

## Decisiones de arquitectura

| # | Decisión | Justificación |
|---|---|---|
| D1 | Backend **.NET 8 Web API** en capas `Api / Application / Domain / Infrastructure` | Separa el contrato HTTP de la lógica de consulta y del acceso a PostgreSQL. Permite probar cada capa de forma unitaria. |
| D2 | **Solo lectura**, con *query handlers* (CQRS ligero) | La capacidad es "Consulta". No se exponen endpoints de escritura. |
| D3 | Acceso a datos con **Npgsql + Dapper** detrás de `IPagoRepository` | Las consultas quedan explícitas y **parametrizadas**, con menos dependencias que EF Core. La interfaz permite usar un *fake* en memoria en las pruebas. |
| D4 | Migraciones **SQL versionadas** (`V001__esquema.sql`, `V002__seed_ficticio.sql`) | Son revisables de forma estática. No dependen de una herramienta de migración en runtime. |
| D5 | Contrato REST: `GET /api/v1/pagos?desde&hasta&estado&page&size` y `GET /api/v1/pagos/{id}` | La paginación obligatoria (`size` ≤ 100) y un rango de fechas de 90 días como máximo acotan la carga. |
| D6 | Montos con `decimal` / `numeric(18,2)` y moneda ISO 4217 | Evita errores de redondeo de punto flotante. |
| D7 | Frontend **Angular standalone** organizado por **Atomic Design** | Cumple el patrón pedido. Un `PagosApiService` usa `HttpClient`, con `apiBaseUrl` definido en `environment`. |
| D8 | Configuración por variables de entorno (`PAGOS_DB_CONNECTION`, `API_BASE_URL`) | Ningún secreto queda en el repositorio. |

## Estructura de módulos

```
backend/
  Pagos.sln
  src/Pagos.Api/            Program.cs, Endpoints/PagosEndpoints.cs
  src/Pagos.Application/    Queries/ConsultarPagos*.cs, Dtos/, Validators/
  src/Pagos.Domain/         Pago.cs, EstadoPago.cs
  src/Pagos.Infrastructure/ PagoRepository.cs (Dapper), SqlConnectionFactory.cs
  tests/Pagos.UnitTests/    xUnit: handlers, validadores, mapeo
db/migrations/              V001__esquema.sql, V002__seed_ficticio.sql
frontend/src/app/
  atoms/      estado-badge, monto
  molecules/  filtro-fechas, fila-pago
  organisms/  tabla-pagos, panel-filtros
  templates/  consulta-layout
  pages/      consulta-pagos
  core/       pagos-api.service.ts, pago.model.ts
  *.spec.ts   pruebas unitarias de componentes y servicio (HttpTestingController)
README.md
```

## Modelo de datos (PostgreSQL)

Tabla `pagos` con estas columnas:
- `id uuid PK`
- `cuenta_id`
- `referencia`
- `beneficiario`
- `monto numeric(18,2)`
- `moneda char(3)`
- `estado`, con `CHECK` sobre los valores válidos
- `fecha_pago timestamptz`
- `canal`

Índices:
- `(cuenta_id, fecha_pago DESC)`
- `(estado)`

El seed contiene únicamente datos ficticios.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Falta la toolchain (`dotnet`, `npm`) en el entorno | Lo que no se pueda compilar ni probar se marca como **no verificado** en el handoff. |
| El SQL de PostgreSQL solo admite revisión estática | Se usa sintaxis estándar y se evitan extensiones. |
| Exposición de datos de otro cliente | El `cuenta_id` debería salir del token, no del query string. Ver hipótesis H3. |
| Zona horaria en los filtros de fecha | Se almacena en UTC (`timestamptz`) y se convierte solo en la UI. |
| Integración sin definir | Queda aislada tras `IPagoRepository`. No hay llamadas a sistemas reales. |

## Hipótesis

- **H1:** Versiones .NET 8 LTS y Angular 17 o superior.
- **H2:** La autenticación la resuelve el canal de Banca por Internet (gateway o BFF existente). Aquí se simula con un `ICurrentCustomer` *stub*.
- **H3:** Un cliente solo consulta los pagos de sus propias cuentas.
- **H4:** Los estados de pago son `PENDIENTE`, `PROCESADO`, `RECHAZADO` y `ANULADO`.
- **H5:** Los números de cuenta se muestran enmascarados en la UI (últimos 4 dígitos).
- **H6:** SGC no está configurado (modo fallback), por lo que no se aplican lineamientos corporativos adicionales.

## Aceptación complementaria

Estos criterios son compatibles con los de la plantilla y no los sustituyen:

- Existe al menos una prueba unitaria para el handler de consulta, el validador de rango de fechas, `PagosApiService` y `tabla-pagos`.
- Todo el SQL de acceso usa parámetros; no hay concatenación de entradas.
- El README documenta las variables de entorno, los comandos `dotnet test` y `npm test`, y el orden de aplicación de las migraciones.
