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

# DESIGN — Refinamiento (Consulta de Tarjetas · Banca por Internet)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/`, `backend/` y `db/` | Despliegue y build independientes; un único README orquesta. |
| D2 | Front: React + TS (Vite), Atomic Design (atoms→pages) | Patrón elegido en el guion; reutilización y pruebas unitarias por nivel. |
| D3 | Back: .NET 8 Web API con capas Api / Application / Infrastructure | Separa el contrato HTTP, la lógica de consulta y el acceso a datos; los servicios se prueban con repositorio falso. |
| D4 | Acceso a datos con Dapper + Npgsql, solo lectura | SQL explícito y parametrizado, alineado con migraciones SQL versionadas; no requiere un ORM para una consulta. |
| D5 | Migraciones SQL planas `V00n__*.sql` | Versionado legible y revisable de forma estática; es neutral respecto a la herramienta (Flyway o DbUp). |
| D6 | Nunca persistir el PAN completo ni el CVV: solo `pan_last4` | Minimiza la exposición tipo PCI; el enmascarado se genera en el backend. |
| D7 | Errores con ProblemDetails (RFC 7807); 404 si la tarjeta no pertenece al cliente | Formato estándar y no revela la existencia de recursos ajenos. |
| D8 | Configuración por variables de entorno: `CARDS_DB_CONNECTION`, `VITE_API_BASE_URL` | Sin secretos en el repositorio. |

## Contrato API (v1)
- `GET /api/v1/cards` → lista de tarjetas del cliente.
- `GET /api/v1/cards/{cardId}` → detalle de una tarjeta.
- Campos: `id`, `maskedNumber` (`**** **** **** 1234`), `brand`, `type` (CREDIT/DEBIT), `status`, `creditLimit`, `availableBalance`, `currency`, `expiry` (MM/YY).

## Modelo de datos (PostgreSQL)
- Tabla `cards`:
  - `id uuid PK`, `customer_id uuid NOT NULL`, `pan_last4 char(4)`, `brand`, `card_type`, `status`.
  - Montos: `credit_limit` y `available_balance` como `numeric(14,2)`; `currency char(3)`.
  - Vencimiento: `expiry_month` y `expiry_year`.
  - Auditoría: `created_at timestamptz`.
- Restricciones: CHECK sobre `card_type`, `status` y `pan_last4 ~ '^[0-9]{4}$'`.
- Índice: `ix_cards_customer_id`.
- Datos: el seed ficticio va en `V002__seed_fictitious.sql`.

## Estructura de módulos
```
frontend/src/
  components/{atoms,molecules,organisms,templates,pages}/
  api/cardsClient.ts   types/card.ts   utils/format.ts
  __tests__/ (Vitest + Testing Library)
backend/
  src/Cards.Api/ (Program.cs, endpoints)
  src/Cards.Application/ (CardQueryService, ICardRepository, DTOs, CardMasking)
  src/Cards.Infrastructure/ (PostgresCardRepository)
  tests/Cards.Tests/ (xUnit, repo fake)
db/migrations/V001__create_cards.sql, V002__seed_fictitious.sql
```
- Átomos: `Badge`, `Amount`.
- Moléculas: `CardSummary`.
- Organismos: `CardList`, `CardDetail`.
- Página: `CardsPage`.

## Pruebas unitarias previstas
- **Backend:** enmascarado del número; servicio de consulta (lista vacía, tarjeta no encontrada, tarjeta de otro cliente).
- **Frontend:** formato de montos y fechas; render de `CardSummary` y `CardList`, incluidos los estados vacío y de error.

## Hipótesis
- **H1:** el alcance es de solo lectura (lista y detalle); los movimientos y los bloqueos quedan fuera.
- **H2:** la autenticación no está definida. Se simula `customerId` mediante la cabecera `X-Customer-Id` (mock); en un entorno real debe venir del token.
- **H3:** la integración con el core de tarjetas no está definida. `ICardRepository` permite sustituir PostgreSQL por un adaptador más adelante.
- **H4:** las versiones de destino son .NET 8 LTS y Node ≥ 18; no están confirmadas por el SGC (fallback).
- **H5:** la moneda y los formatos usan el locale `es` y CLP/USD; son valores ilustrativos.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sin toolchain `dotnet` o `npm` local, el código no se compila | Se marca como *no verificado* en el resumen candidate. |
| PostgreSQL solo admite revisión estática | El SQL se escribe en estándar portable cuando es posible; se documenta cómo ejecutarlo en local. |
| SGC en fallback: no hay estándares corporativos confirmados | Las decisiones se registran aquí para revisarlas cuando el SGC esté disponible. |
| CORS y autenticación mal configurados al integrar | Orígenes por variable de entorno; la autenticación queda como pendiente explícito. |
| Exposición de datos sensibles en logs | No se registran payloads ni identificadores completos. |
