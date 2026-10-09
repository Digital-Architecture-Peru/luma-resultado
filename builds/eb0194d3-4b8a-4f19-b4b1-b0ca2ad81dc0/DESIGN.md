# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + .NET (capa Full Stack) para "Consulta" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + .NET y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN: refinamiento

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Backend .NET 8 Web API en capas `Api / Application / Domain / Infrastructure` | Separa la consulta (casos de uso) del acceso a datos y permite probar la lógica sin base de datos. |
| D2 | Puerto `ICardRepository` con dos adaptadores: `PostgresCardRepository` (Npgsql + Dapper) e `InMemoryCardRepository` | Las consultas SQL quedan explícitas y parametrizadas. Las pruebas unitarias y la demo no requieren PostgreSQL. |
| D3 | Solo lectura (`GET`). No se almacena el PAN completo ni el CVV: solo `last4` y `masked_pan` | Reduce la exposición de datos de tarjeta, aunque se trate de datos ficticios. |
| D4 | Migraciones SQL versionadas (`V001__schema.sql`, `V002__seed.sql`) | Son trazables y se pueden revisar de forma estática. |
| D5 | Front con React + TS (Vite) organizado según Atomic Design: `atoms/molecules/organisms/templates/pages` | Cumple el patrón pedido y permite probar cada componente de forma aislada. |
| D6 | Cliente HTTP aislado en `services/cardsApi.ts`, con la URL en `VITE_API_BASE_URL` | Desacopla la UI del backend y evita valores fijos en el código. |
| D7 | Pruebas con xUnit en el backend y Vitest + Testing Library en el front | Son herramientas idiomáticas de cada stack para pruebas unitarias. |

**Contrato API (v1)**
- `GET /api/v1/customers/{customerId}/cards` devuelve `CardSummary[]`.
- `GET /api/v1/cards/{cardId}` devuelve `CardDetail`, o `404` si no existe.
- `CardSummary` contiene `id, productName, brand, maskedPan, status, currency, availableBalance`.
- `CardDetail` añade `creditLimit` y `expiry`.

**Tabla `cards`**
- Columnas: `id uuid PK`, `customer_id varchar(36) NOT NULL`, `product_name`, `brand`, `masked_pan`, `last4 char(4)`, `status`, `credit_limit numeric(14,2)`, `available_balance numeric(14,2)`, `currency char(3)`, `expiry char(5)`, `created_at timestamptz`.
- Restricciones: `CHECK` sobre `status` (`ACTIVE`, `BLOCKED`, `CANCELLED`).
- Índices: `ix_cards_customer_id` e `ix_cards_customer_status`.

## Estructura de módulos
```
backend/
  Cards.sln
  src/Cards.Api/ (Program.cs, Endpoints/, appsettings.json sin secretos)
  src/Cards.Application/ (GetCustomerCards, GetCardDetail, DTOs)
  src/Cards.Domain/ (Card, CardStatus, PanMasker)
  src/Cards.Infrastructure/ (PostgresCardRepository, InMemoryCardRepository)
  tests/Cards.UnitTests/ (servicios, PanMasker)
db/migrations/ (V001__schema.sql, V002__seed.sql)
frontend/
  package.json, tsconfig.json, vite.config.ts
  src/components/{atoms,molecules,organisms,templates}/
  src/pages/CardsPage.tsx
  src/services/cardsApi.ts
  src/types/card.ts
  src/__tests__/
README.md
```

## Riesgos
- **R1:** puede que no haya toolchain (`dotnet`, `npm`) disponible. Lo que no se ejecute queda **no verificado**.
- **R2:** el esquema PostgreSQL solo se revisa de forma estática y puede haber errores que se detecten recién en ejecución.
- **R3:** la conversión entre `numeric` y `decimal` y la serialización de moneda. Se usa `decimal` y no `double`.
- **R4:** CORS y autenticación no están definidos. Exponer la API sin autenticación solo es aceptable en local.
- **R5:** las versiones de las dependencias son una propuesta. Hay que confirmar que estén permitidas en el entorno del banco.

## Hipótesis
- **H1:** .NET 8 LTS y Node ≥ 18.
- **H2:** el `customerId` llega por ruta. La autenticación y la integración real con core de tarjetas o con un BFF de Banca por Internet quedan **sin definir**.
- **H3:** la cadena de conexión se toma de `ConnectionStrings__Cards` (variable de entorno). Si falta, la API usa `InMemoryCardRepository`.
- **H4:** todos los datos son ficticios (`last4` del tipo `0000`–`9999`, clientes `demo-*`).
- **H5:** no hay requisitos de paginación porque se asume un volumen bajo de tarjetas por cliente.
- **H6:** el SGC está en modo fallback, así que no se aplican convenciones corporativas confirmadas.

## Trazabilidad
| Tarea | Entregables |
|---|---|
| T02 | Proyectos `backend/` y `frontend/` |
| T03 | Validador local sobre los archivos verificables |
| T04-tests | `tests/` y `__tests__/` |
| T04-db | `db/migrations/` |
| T05-docs | README con build, ejecución, integración y persistencia |
| T06-handoff | Resumen *candidate* con R1–R5 y lo no verificado |
