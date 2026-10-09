# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + .NET (capa Full Stack) para "Transacción" sobre Pagos en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + .NET y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento: Transacción de Pagos (Angular + .NET + PostgreSQL)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Backend .NET 8 Web API en capas `Domain / Application / Infrastructure / Api` | Aísla las reglas de pago y permite pruebas unitarias sin base de datos. |
| D2 | Persistencia detrás de `IPaymentRepository`: Npgsql + Dapper en Infrastructure y `InMemoryPaymentRepository` para pruebas | El SQL queda explícito y todo el acceso es parametrizado (`@param`), sin concatenación. |
| D3 | Migraciones SQL versionadas (`db/migrations/V001__init.sql`, `V002__seed.sql`) | Son legibles y se revisan de forma estática sin depender de herramientas de EF. |
| D4 | Montos en `decimal` (.NET) y `NUMERIC(18,2)` (SQL); moneda ISO 4217 | Evita errores de redondeo con punto flotante. |
| D5 | Clave de idempotencia (`Idempotency-Key`) con índice único | Impide pagos duplicados por reintentos o doble clic. |
| D6 | Estados del pago: `PENDING → COMPLETED \| REJECTED`, con transiciones validadas en el dominio | El ciclo de vida es explícito y verificable. |
| D7 | Integración sin definir: `IPaymentProcessor` con `FakePaymentProcessor` | No hay llamadas a sistemas reales. El contrato se sustituye después. |
| D8 | Angular con componentes standalone y Reactive Forms, organizados por Atomic Design | Componentes reutilizables y validaciones declarativas. |
| D9 | Configuración por variables de entorno (`PAYMENTS_DB_CONNECTION`, `apiBaseUrl`) | Ningún secreto queda en el repositorio. |

**Contrato API (v1):**
- `POST /api/v1/payments` responde 201, 400 (validación) o 409 (idempotencia).
- `GET /api/v1/payments/{id}`
- `GET /api/v1/payments?accountId=`

## Estructura de módulos
```
backend/
  Payments.sln
  src/Payments.Domain/        Payment, PaymentStatus, Money, reglas
  src/Payments.Application/   CreatePaymentHandler, DTOs, validación, interfaces
  src/Payments.Infrastructure/ PgPaymentRepository (Dapper), FakePaymentProcessor
  src/Payments.Api/           Program.cs, PaymentsController, ProblemDetails
  tests/Payments.UnitTests/   xUnit: dominio, handler, idempotencia
db/migrations/                V001__init.sql, V002__seed.sql (datos ficticios)
frontend/src/app/
  atoms/      button, input, amount-display
  molecules/  form-field, account-selector
  organisms/  payment-form, payment-confirm, payment-receipt
  templates/  payment-layout
  pages/      payment-page (flujo captura → confirmación → comprobante)
  core/       payment-api.service, models
  *.spec.ts   pruebas unitarias (Jasmine/Karma)
README.md
```

## Riesgos
- **R1:** el SQL de PostgreSQL solo recibe revisión estática, así que la sintaxis específica del motor (por ejemplo `gen_random_uuid()`) no se ejecuta.
- **R2:** si no hay .NET SDK, Node/npm o un navegador headless instalados, la compilación y las pruebas quedan sin verificar.
- **R3:** las validaciones del front y del back pueden divergir. Mitigación: el back es la fuente de verdad y se responde con ProblemDetails.
- **R4:** sin autenticación real, la API no debe exponerse fuera de un entorno local.
- **R5:** la concurrencia sobre el saldo no está modelada, porque no hay débito real.

## Hipótesis
- **H1:** la "Transacción" es un pago de servicio o a un tercero desde una cuenta propia del cliente.
- **H2:** la autenticación y la autorización las resuelve un gateway o BFF externo. Aquí el cliente se simula con `X-Customer-Id` ficticio.
- **H3:** las versiones objetivo son .NET 8 LTS y Angular 17+.
- **H4:** el límite por operación es configurable (valor de ejemplo: 10 000.00) y la moneda por defecto es ficticia (`PEN`).
- **H5:** no hay SGC disponible (fallback), por lo que no se aplican estándares corporativos específicos.

## Aceptación complementaria (no reemplaza la base)
- Las pruebas unitarias cubren cuatro casos: monto ≤ 0 rechazado, transición de estado inválida, idempotencia (409) y validadores del formulario Angular.
- La migración V001 define:
  - clave primaria;
  - índice único sobre `idempotency_key`;
  - índice en `(account_id, created_at)`;
  - `CHECK (amount > 0)`.
- El README documenta las variables de entorno, el orden de las migraciones y lo que queda sin verificar.
- El resultado se entrega como candidate: no se afirma compilación ni preparación para producción.
