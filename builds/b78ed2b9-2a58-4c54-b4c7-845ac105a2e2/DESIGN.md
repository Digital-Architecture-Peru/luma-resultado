# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + .NET (capa Full Stack) para "Transacción" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + .NET y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN (refinamiento)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Caso de uso: **pago de tarjeta de crédito** y consulta de movimientos (hipótesis H1) | Es la transacción más común sobre Tarjetas en Banca por Internet y se acota bien |
| D2 | Backend .NET 8 Web API en capas Api / Application / Domain / Infrastructure | Separa reglas de negocio del transporte y de la persistencia; facilita las pruebas unitarias |
| D3 | Persistencia con Npgsql + Dapper y SQL **parametrizado**, detrás de `ICardTransactionRepository` | Las consultas son explícitas y revisables de forma estática; evita SQL injection |
| D4 | Migraciones versionadas en `db/migrations/V001__init.sql` y `V002__seed.sql` | Cumple T04-db sin depender de un runner de EF |
| D5 | Montos `decimal` / `NUMERIC(18,2)` con `CHECK (amount > 0)` y moneda ISO `CHAR(3)` | Evita errores de redondeo en operaciones monetarias |
| D6 | Cabecera `Idempotency-Key` con índice UNIQUE | Evita el doble cargo si el cliente reintenta |
| D7 | Solo se guarda el PAN enmascarado (`**** 1234`) | Minimiza el alcance PCI; los datos son ficticios |
| D8 | Integración (sin definir) como `ICardProcessorGateway` con `FakeCardProcessorGateway` | No se hacen llamadas a sistemas reales y el contrato queda listo para reemplazo |
| D9 | Angular standalone con carpetas Atomic Design, Reactive Forms y `CardsApiService` | Cumple el patrón pedido y reutiliza componentes de UI |
| D10 | Configuración por variables de entorno (`ConnectionStrings__Cards`, `ApiBaseUrl`) | No hay secretos en el repositorio |

## Contrato API (v1)
- `GET  /api/v1/cards` → tarjetas con saldo disponible.
- `GET  /api/v1/cards/{id}/transactions?page=` → movimientos.
- `POST /api/v1/cards/{id}/payments` con `{amount, currency, sourceAccountAlias}` y la cabecera `Idempotency-Key`. Respuestas: 201, 400 (validación), 404 o 409 (clave duplicada con otro cuerpo).

## Modelo de datos (PostgreSQL)
- `cards(id uuid PK, masked_pan, alias, credit_limit, available_balance, currency)`
- `card_transactions(id uuid PK, card_id FK, type, amount, currency, status, idempotency_key UNIQUE, created_at)`
- Índice `(card_id, created_at DESC)`.

## Estructura de módulos
```
backend/
  Cards.sln
  src/Cards.Api/            Controllers, Program.cs, appsettings.json (sin secretos)
  src/Cards.Application/    PayCardHandler, DTOs, validaciones
  src/Cards.Domain/         Card, CardTransaction, Money, reglas
  src/Cards.Infrastructure/ NpgsqlCardTransactionRepository, FakeCardProcessorGateway
  tests/Cards.UnitTests/    xUnit: dominio, handler, repo en memoria
db/migrations/              V001__init.sql, V002__seed.sql
frontend/src/app/
  atoms/      amount-input, button, masked-pan
  molecules/  card-summary, form-field
  organisms/  payment-form, transactions-table
  templates/  cards-layout
  pages/      card-payment.page
  core/       cards-api.service, models
  *.spec.ts   (Jasmine/Karma)
README.md
```

## Hipótesis
- H1: la "Transacción" es el pago de una tarjeta propia; la autenticación y el canal ya existen y quedan fuera de alcance.
- H2: se usan .NET 8 y Angular 17+. Si no hay toolchain (`dotnet`, `npm`), el build y las pruebas quedan **no verificados**.
- H3: el SQL de PostgreSQL solo recibe revisión estática; no se ejecuta.
- H4: el contrato del procesador externo es ficticio hasta que SGC o el negocio lo definan.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| SGC en modo fallback: puede faltar contexto corporativo | Las hipótesis quedan explícitas y deben revisarse con SGC |
| Doble débito o concurrencia | Idempotencia y actualización condicional del saldo (`WHERE available_balance >= @amount`) |
| Exposición de datos sensibles | PAN enmascarado, logs sin montos ni identificadores completos |
| Integración real indefinida | Interfaz y fake documentados en el README |
| Sin pruebas de integración ni E2E (solo unitarias) | Se declara como brecha en el handoff |
