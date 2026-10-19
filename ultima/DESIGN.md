# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- ¿Qué stack? React + TypeScript + .NET
- ¿Persistencia? PostgreSQL

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + .NET (capa Full Stack) para "Consulta" sobre Pagos en Banca por Internet, patrón sin definir.
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + .NET y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (sin definir) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN — Refinamiento

## Decisiones de arquitectura

| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (React + TS + Vite) y `backend/` (.NET 8 Web API) | Un solo entregable Full Stack. Cada parte compila de forma independiente. |
| D2 | Backend por capas: Domain, Application, Infrastructure y Api | El patrón no está definido. Esta separación aísla la persistencia detrás de `IPagosRepository` y permite probar sin base de datos. |
| D3 | Solo lectura: `GET /api/v1/pagos` (filtros `desde`, `hasta`, `estado`, `page`, `pageSize`) y `GET /api/v1/pagos/{id}` | La capacidad es de Consulta. No se exponen escrituras. |
| D4 | Npgsql + Dapper con SQL parametrizado (sin EF Core) | Consultas explícitas, revisables de forma estática y sin concatenación de cadenas. |
| D5 | Migraciones SQL versionadas en `db/migrations/V001__init.sql` y `V002__seed.sql` | Son independientes de la herramienta y se pueden revisar sin una instancia de PostgreSQL. |
| D6 | Montos como `numeric(18,2)` en la base de datos, `decimal` en .NET y `string` en JSON y en TS | Evita la pérdida de precisión de `number` en JavaScript. |
| D7 | Configuración por variables de entorno (`PAGOS_DB_CONNECTION`, `VITE_API_BASE_URL`) | Ningún secreto queda en el repositorio. Se incluye `.env.example` con valores ficticios. |
| D8 | Pruebas con xUnit (backend, repositorio falso) y Vitest + Testing Library (frontend, `fetch` mockeado) | Son las herramientas idiomáticas de cada stack y no dependen de servicios externos. |

## Estructura de módulos
```
backend/
  Pagos.sln
  src/Pagos.Domain/        Pago, EstadoPago
  src/Pagos.Application/   IPagosRepository, ConsultaPagosService, DTOs
  src/Pagos.Infrastructure/PgPagosRepository (Dapper)
  src/Pagos.Api/           Program.cs, endpoints, validación de filtros
  tests/Pagos.Tests/       servicio y validaciones
frontend/
  package.json, vite.config.ts, tsconfig.json
  src/api/pagosClient.ts   cliente tipado
  src/features/pagos/      PagosList, PagoDetalle, Filtros
  src/__tests__/
db/migrations/             V001__init.sql, V002__seed.sql
README.md, .env.example
```

## Modelo de datos (tabla `pagos`)
- Columnas: `id uuid PK`, `cliente_id`, `referencia`, `beneficiario`, `cuenta_destino_mask`, `monto numeric(18,2) CHECK > 0`, `moneda char(3)`, `estado CHECK IN ('PENDIENTE','APLICADO','RECHAZADO')`, `fecha_pago timestamptz`, `canal`.
- Índices: `(cliente_id, fecha_pago DESC)` y `(cliente_id, estado)`.
- Datos semilla: entre 10 y 20 pagos ficticios, todos con cuentas enmascaradas.

## Hipótesis
- H1: El patrón de capas (D2) es aceptable mientras no exista un estándar SGC. El SGC está en fallback.
- H2: La autenticación queda fuera de alcance. El `clienteId` se resuelve con un stub en el servidor y nunca se toma de un parámetro enviado por el cliente.
- H3: No hay integración externa. La única integración es el contrato REST/JSON entre el frontend y el backend.
- H4: Se usan .NET 8 LTS y Node 20 o superior.
- H5: La paginación es por offset y tiene un `pageSize` máximo de 50.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| `dotnet` o `npm` no están disponibles localmente | Se marca la parte como no verificada en el handoff, sin afirmar que compila. |
| El SQL de PostgreSQL no se ejecuta (solo hay revisión estática) | El SQL es estándar y queda documentado como pendiente de validar contra una instancia real. |
| Exposición de datos sensibles (PII) | Cuentas enmascaradas, sin datos reales y sin registrar montos ni cuentas en logs. |
| Rangos de fecha amplios degradan el rendimiento | Rango máximo de 12 meses validado en la Api, apoyado en el índice compuesto. |
| Zonas horarias inconsistentes | Se almacena en UTC y se formatea en el cliente. |
| CORS en desarrollo | Origen permitido configurable por variable de entorno. |

## Trazabilidad con la aceptación
- Sintaxis verificable: archivos `.cs`, `.ts`, `.tsx` y `.sql`.
- Pruebas presentes: `backend/tests` y `frontend/src/__tests__`.
- README presente: incluye build, ejecución, contrato REST y persistencia.
- Cierre: el resumen se entrega como candidate y lista lo no verificado.
