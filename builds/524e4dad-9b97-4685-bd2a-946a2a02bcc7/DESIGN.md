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

# DESIGN · Refinamiento

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (React+TS, Vite) y `backend/` (.NET, ASP.NET Core Web API) | Un solo workspace con build independiente por capa; cada toolchain se verifica por separado |
| D2 | Solo endpoints `GET` de lectura | La capacidad es **Consulta**; sin mutaciones se reduce la superficie de riesgo en Pagos |
| D3 | Backend en capas: Api → Application → Domain ← Infrastructure | El dominio no depende de PostgreSQL; la persistencia queda detrás de `IPaymentQueryRepository` |
| D4 | Npgsql + Dapper con SQL parametrizado (`@param`) | SQL explícito y revisable, sin concatenación; más ligero que EF Core para lectura |
| D5 | Migraciones SQL versionadas (`V001__create_payments.sql`, `V002__seed_fake.sql`) | Son legibles y se revisan de forma estática, ya que no se ejecutan sobre PostgreSQL real |
| D6 | Repositorio `InMemory` por defecto (`PAYMENTS_STORE=memory\|postgres`) | Permite ejecutar y probar sin base de datos ni secretos |
| D7 | Importes como `decimal` en .NET y como string decimal en el JSON | Evita la pérdida de precisión de `number` en JS |
| D8 | Atomic Design: atoms → molecules → organisms → templates → pages | Es el patrón pedido; permite probar los componentes de forma aislada |
| D9 | Pruebas: xUnit (backend) y Vitest + React Testing Library (frontend) | Herramientas estándar para pruebas unitarias en cada stack |

## Estructura de módulos
```
backend/
  src/Payments.Api/            Program.cs, Endpoints/PaymentsEndpoints.cs
  src/Payments.Application/    GetPaymentsQuery, PaymentDto, PagedResult
  src/Payments.Domain/         Payment, PaymentStatus, IPaymentQueryRepository
  src/Payments.Infrastructure/ PostgresPaymentQueryRepository, InMemoryPaymentQueryRepository
  tests/Payments.Tests/        xUnit
  db/migrations/               V001__create_payments.sql, V002__seed_fake.sql
  Payments.sln
frontend/
  src/components/{atoms,molecules,organisms,templates}/
  src/pages/PaymentsPage.tsx
  src/api/paymentsClient.ts    (lee VITE_API_BASE_URL)
  src/**/*.test.tsx
  package.json, vite.config.ts, tsconfig.json
README.md
```

## Contrato API (candidate)
- `GET /api/payments?from=&to=&status=&page=1&pageSize=20`: devuelve `{ items, page, pageSize, total }`. `pageSize` admite como máximo 100.
- `GET /api/payments/{id}`: devuelve 200 o 404.
- Los errores siguen el formato `ProblemDetails` (RFC 7807).
- El número de cuenta se devuelve enmascarado (`****1234`).

## Modelo de datos
- Tabla `payments`:
  - `id uuid PK`, `customer_id uuid`, `beneficiary varchar(120)`, `account_masked varchar(20)`.
  - `amount numeric(18,2)`, `currency char(3)`, `status varchar(20) CHECK`, `paid_at timestamptz`, `reference varchar(40)`.
- Índice `ix_payments_customer_paid_at (customer_id, paid_at DESC)` y índice sobre `status`.

## Hipótesis
- **H1**: la autenticación la provee la Banca por Internet anfitriona. Aquí se simula con el header `X-Customer-Id`, que no es seguro y debe reemplazarse.
- **H2**: "Consulta" significa listar pagos con filtros más ver el detalle. No incluye exportación ni comprobantes.
- **H3**: el target es .NET 8 LTS y Node 20.
- **H4**: la moneda es un código ISO ficticio. No se asume ningún país.
- **H5**: la integración con el core de pagos está sin definir; solo existe la interfaz.
- **H6**: la paginación es por offset, suficiente para volúmenes de demo.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sin toolchain .NET/npm, el código no se puede verificar | Marcarlo como no verificado en el handoff (T06) |
| El SQL de PostgreSQL no se ejecuta, solo se revisa | Usar SQL estándar sin extensiones y documentar en el README cómo ejecutarlo |
| Fuga de datos de otros clientes | Toda consulta filtra por `customer_id`; incluir una prueba unitaria que lo verifique |
| Exposición de PII | Solo datos ficticios, cuentas enmascaradas y sin logs de payload |
| Bloqueos de CORS en desarrollo | Origen configurable mediante la variable de entorno `ALLOWED_ORIGINS` |

## Trazabilidad con la aceptación
- **T02**: D1–D8.
- **T03**: validadores locales por capa.
- **T04-tests**: D9.
- **T04-db**: D4 y D5.
- **T05**: README con build, variables de entorno, integración pendiente (H5) y persistencia PostgreSQL.
- **T06**: resumen candidate que incluye H1–H6 y lo no verificado.
