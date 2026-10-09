# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + .NET (capa Full Stack) para "Transacción" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + .NET y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN (refinamiento)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (React + TS + Vite) y `backend/` (.NET 8, ASP.NET Core Web API) | Estructura idiomática por stack; cada parte compila y se prueba por separado |
| D2 | Front con Atomic Design: atoms → molecules → organisms → templates → pages | Es el patrón pedido; facilita reutilizar y probar cada componente aislado |
| D3 | Back en capas: Api / Application / Domain / Infrastructure | El dominio no depende de PostgreSQL ni de la integración aún sin definir |
| D4 | Puerto `ICardTransactionGateway` con adaptador `FakeCoreGateway` | La integración no está definida; se usan datos ficticios sin llamar a sistemas reales |
| D5 | Acceso a datos con Npgsql + Dapper y SQL parametrizado | SQL explícito y revisable; cumple el acceso parametrizado de T04-db |
| D6 | Migraciones SQL versionadas en `db/migrations/V00X__*.sql` | Permiten revisión estática; no dependen de un ORM |
| D7 | Importes en `NUMERIC(18,2)` y `decimal`, código ISO de moneda | Evita errores de redondeo de punto flotante |
| D8 | Cabecera `Idempotency-Key` con índice único | Evita transacciones duplicadas por reintentos |
| D9 | Solo se guarda el PAN enmascarado (últimos 4 dígitos) y un token ficticio | Minimiza el alcance PCI; nunca se guarda el PAN completo ni el CVV |
| D10 | Estados `PENDING → APPROVED \| REJECTED` validados en el dominio | Las transiciones explícitas se pueden probar con pruebas unitarias |

## Estructura de módulos
```
frontend/src/
  components/{atoms,molecules,organisms,templates}/
  pages/CardTransactionPage.tsx
  services/cardTransactionsApi.ts   (fetch; URL base en VITE_API_URL)
  domain/types.ts
  __tests__/                        (Vitest + Testing Library)
backend/
  src/Cards.Api/            (controllers, DTOs, validación, ProblemDetails)
  src/Cards.Application/    (casos de uso, puertos)
  src/Cards.Domain/         (CardTransaction, Money, reglas)
  src/Cards.Infrastructure/ (repositorio Dapper, FakeCoreGateway)
  tests/Cards.UnitTests/    (xUnit; repositorio y gateway falsos)
db/migrations/ V001__schema.sql, V002__indexes.sql, V003__seed_ficticio.sql
README.md
```

**Modelo de datos (mínimo):**
- `cards`: id, masked_pan, token, holder_alias, status.
- `card_transactions`: id, card_id (FK), amount, currency, status, idempotency_key (UNIQUE), created_at (timestamptz).

**Índices:** `(card_id, created_at DESC)` e `idempotency_key`.

## Hipótesis
- **H1:** "Transacción sobre Tarjetas" se interpreta como **pago de tarjeta de crédito desde una cuenta propia**, con registro y consulta de movimientos. Si la operación es otra (compra, avance, bloqueo), se mantienen el dominio y las capas y se ajustan el caso de uso y las reglas.
- **H2:** La autenticación la resuelve Banca por Internet fuera de este alcance. La API recibe un identificador de cliente ficticio en una cabecera, sin validación real.
- **H3:** No hay contexto SGC (fallback). No se aplican lineamientos corporativos de nomenclatura, seguridad ni diseño visual.
- **H4:** Se usa .NET 8 LTS y Node 20 LTS. Si la toolchain local no está instalada, la compilación y las pruebas quedan **no verificadas**.
- **H5:** Límites de importe y reglas de negocio de ejemplo (monto > 0, tope ficticio) configurables por variables de entorno.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Alcance de la transacción ambiguo (H1) | Caso de uso aislado y reemplazable; se reporta en el handoff |
| No se ejecuta PostgreSQL | Solo revisión estática del SQL; queda declarado como no verificado |
| Integración real desconocida | Puerto D4; sin contrato real no se afirma compatibilidad |
| Exposición de datos de tarjeta | D9; los logs nunca incluyen token ni importes con identificación del cliente |
| Doble cargo por reintento | D8 y transición de estado atómica en una transacción de base de datos |
| Pruebas solo unitarias | Sin pruebas de integración ni E2E; queda declarado en el README |

## Notas para el tester
- Probar las reglas de `Money` y las transiciones de estado.
- Probar el rechazo de importes inválidos y la idempotencia con un repositorio falso.
- Probar el render y la validación del formulario (organism) y el estado de éxito o error (page).
