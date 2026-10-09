# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + .NET (capa Full Stack) para "Consulta" sobre Pagos en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + .NET y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN — Refinamiento

## Decisiones de arquitectura
| ID | Decisión | Justificación |
|---|---|---|
| D1 | Repositorio con `web/` (React + TS + Vite) y `api/` (.NET 8, ASP.NET Core) | Builds independientes, verificables con npm y dotnet |
| D2 | API en capas Domain → Application → Infrastructure → Api | La persistencia queda detrás de `IPagoRepository` y la lógica se prueba sin BD |
| D3 | Solo endpoints GET | La capacidad es Consulta; reduce la superficie de riesgo |
| D4 | Npgsql + Dapper con SQL parametrizado; migraciones SQL versionadas | Control explícito de consultas e índices; menos dependencias que EF Core |
| D5 | Paginación `page/pageSize` (máx. 50) y filtros por fecha y estado | Acota el volumen y el costo de cada consulta |
| D6 | Front con Atomic Design; datos vía hook `usePagos` y cliente `fetch` tipado | Evita una librería de estado adicional |
| D7 | `NUMERIC(18,2)`/`decimal`, fechas UTC ISO-8601, moneda ISO-4217 | Evita errores de redondeo y de zona horaria |
| D8 | Cuenta destino enmascarada (`****1234`) desde la API | Minimiza la exposición de datos |
| D9 | Configuración por env (`ConnectionStrings__Pagos`, `VITE_API_URL`); se usa `InMemoryPagoRepository` si no hay cadena de conexión | Permite ejecutar sin BD y sin secretos |

## Estructura de módulos
```
api/Pagos.sln
  src/Pagos.Domain/          Pago, EstadoPago
  src/Pagos.Application/     IPagoRepository, ConsultaPagosService, DTOs, validación de filtros
  src/Pagos.Infrastructure/  PgPagoRepository, InMemoryPagoRepository
  src/Pagos.Api/             Program.cs, /api/v1/pagos, ProblemDetails
  tests/Pagos.Application.Tests/  xUnit
db/migrations/V001__esquema_pagos.sql, V002__seed_ficticio.sql
web/ package.json, tsconfig.json, vite.config.ts
  src/components/atoms/      Monto, Fecha, BadgeEstado
  src/components/molecules/  FiltroFechas, FilaPago
  src/components/organisms/  TablaPagos, DetallePago
  src/components/templates/  ConsultaLayout
  src/pages/                 ConsultaPagosPage
  src/services/pagosApi.ts, src/hooks/usePagos.ts, src/types/pago.ts
  *.test.tsx                 Vitest + Testing Library
README.md
```

## Contrato
- `GET /api/v1/pagos?desde&hasta&estado&page&pageSize` devuelve `{ items, page, pageSize, total }`.
- `GET /api/v1/pagos/{id}` devuelve el detalle, o 404 si no existe o pertenece a otro cliente.
- Devuelve 400 (ProblemDetails) si `desde > hasta`, si el rango supera 90 días o si `pageSize` está fuera de 1–50.

## Modelo de datos
`pagos(id UUID PK, cliente_id UUID NOT NULL, referencia VARCHAR(30), beneficiario VARCHAR(120), cuenta_destino_mask VARCHAR(20), monto NUMERIC(18,2) CHECK (monto > 0), moneda CHAR(3), estado VARCHAR(15) CHECK (estado IN (...)), fecha_pago TIMESTAMPTZ NOT NULL)`
- Índice `ix_pagos_cliente_fecha (cliente_id, fecha_pago DESC)`.
- Seed con unos 10 registros ficticios y UUID literales (sin extensiones).

## Pruebas unitarias
- **Application:** validación de filtros, límite de paginación, enmascarado y filtrado obligatorio por cliente.
- **Web:** formato de `Monto`, `TablaPagos` con lista vacía y con datos, y `usePagos` con `fetch` simulado.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| dotnet o npm no instalados | Se marca como no verificado en el handoff |
| SQL de PostgreSQL sin ejecución real | Revisión estática; sintaxis estándar sin extensiones |
| Autenticación no definida, con riesgo de acceso a pagos de otro cliente | `cliente_id` obligatorio en todo `WHERE` |
| Integración sin definir | Solo se documenta el contrato; no hay llamadas reales |
| Versiones de paquetes no verificadas | Versiones fijadas y declaradas en el README |
| CORS entre web y api | Origen permitido configurable por env |

## Hipótesis
- **H1:** .NET 8 LTS y Node 20+.
- **H2:** La autenticación de Banca por Internet queda fuera de alcance; el cliente llega por el header stub `X-Cliente-Id`.
- **H3:** Solo se consultan pagos del propio cliente, con rango máximo de 90 días.
- **H4:** Estados posibles: PENDIENTE, PROCESADO, RECHAZADO y REVERSADO.
- **H5:** No hay conversión de moneda; el locale de formato es configurable (por defecto `es`).
- **H6:** Solo hay pruebas unitarias; no hay pruebas de integración ni e2e contra PostgreSQL.
