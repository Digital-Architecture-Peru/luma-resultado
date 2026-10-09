# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + .NET (capa Full Stack) para "Transacción" sobre Pagos en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + .NET y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento (Pagos · Transacción)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Repositorio con `frontend/`, `backend/` y `db/` | Cada parte compila con su propia toolchain y se verifica por separado |
| D2 | React + TS + Vite con Atomic Design (`atoms/molecules/organisms/templates/pages`); llamadas HTTP en `services/` y estado en `usePayment` | Componentes puros y fáciles de probar; la lógica queda fuera de la vista |
| D3 | ASP.NET Core en capas Domain / Application / Infrastructure / Api | El dominio no depende de nada y se prueba con xUnit sin base de datos |
| D4 | Npgsql + Dapper con SQL parametrizado detrás de `IPaymentRepository`; migraciones `V001__`, `V002__` | Evita la inyección SQL; las migraciones son revisables sin generar código EF |
| D5 | Montos como `decimal` / `NUMERIC(18,2)`; en el front, string validado | Evita errores de redondeo de punto flotante |
| D6 | Header `Idempotency-Key` + índice único | Evita el doble cargo por reintento o doble clic |
| D7 | Integración sin definir: `IPaymentGateway` + `FakePaymentGateway` determinista | No hay llamadas a sistemas reales |
| D8 | Configuración por variables de entorno (`ConnectionStrings__Payments`, `VITE_API_BASE_URL`) y `.env.example` sin valores reales | Sin secretos en el código |

## Contrato API (candidate)
- `GET /api/accounts`: devuelve las cuentas ficticias del cliente.
- `POST /api/payments` (requiere `Idempotency-Key`). Body: `{sourceAccountId, beneficiaryAccount, amount, currency, reference}`.
  - `201 {id, status}`: pago registrado.
  - `400`: error de validación (ProblemDetails).
  - `409`: clave repetida con un payload distinto.
  - Clave repetida con el mismo payload: devuelve la respuesta original.
- `GET /api/payments/{id}`: consulta un pago.

## Modelo de datos (PostgreSQL)
- `accounts(id uuid PK, number varchar(20) UNIQUE, holder, currency char(3), balance numeric(18,2))`
- `payments(id uuid PK, idempotency_key varchar(64) UNIQUE, source_account_id FK, beneficiary_account, amount numeric(18,2) CHECK (amount>0), currency char(3), status CHECK IN ('PENDING','COMPLETED','REJECTED'), reference varchar(140), created_at timestamptz)`
- Índice: `payments(source_account_id, created_at DESC)`.
- `V002__seed.sql`: datos ficticios.

## Reglas de dominio
- Monto mayor que 0 y menor o igual a un límite configurable.
- Cuenta origen distinta de la cuenta beneficiaria.
- Saldo suficiente en la cuenta origen.
- La moneda del pago coincide con la de la cuenta origen.

## Estructura de módulos
```
frontend/src/
  components/atoms/       Button, TextInput, AmountInput
  components/molecules/   FormField, AccountSelector
  components/organisms/   PaymentForm, PaymentSummary
  components/templates/   PaymentTemplate
  pages/                  PaymentPage
  services/paymentsApi.ts
  hooks/usePayment.ts
  __tests__/
backend/
  src/Payments.Domain/          Payment, Money, reglas
  src/Payments.Application/     PaymentService, puertos
  src/Payments.Infrastructure/  Repositorio Dapper, FakeGateway
  src/Payments.Api/             Endpoints, ProblemDetails
  tests/Payments.UnitTests/
db/migrations/                  V001__schema.sql, V002__seed.sql
```

## Pruebas unitarias
- **Front (Vitest + React Testing Library):**
  - `AmountInput` rechaza formatos inválidos.
  - `PaymentForm` bloquea el envío mientras está pendiente.
  - `usePayment` con fetch simulado.
- **Back (xUnit):**
  - Reglas de `Payment.Create`.
  - Idempotencia de `PaymentService` con un repositorio fake.

## Hipótesis
- **H1:** "Transacción" significa un pago o transferencia de una cuenta propia a un beneficiario identificado por número de cuenta.
- **H2:** La autenticación la resuelve el host de Banca por Internet y queda fuera de alcance. El cliente se simula con un id ficticio.
- **H3:** Versiones .NET 8 LTS y React 18.
- **H4:** Una moneda ISO 4217 por pago, sin conversión de divisas.
- **H5:** El pago es síncrono con el gateway fake, sin colas ni flujo de estados asíncrono.
- **H6:** El límite por transacción es un valor de configuración ficticio.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sin contexto SGC (fallback): pueden faltar estándares corporativos | Marcar como pendiente de alinear |
| Integración real sin definir | El puerto `IPaymentGateway` aísla el cambio |
| El SQL de PostgreSQL solo se revisa de forma estática | Usar SQL estándar y marcarlo como no verificado |
| Toolchain .NET o Node ausente | Reportar la compilación como no verificada |
| Concurrencia sobre el saldo | Prever `SELECT … FOR UPDATE` en la transacción; queda como candidate |
| Solo hay pruebas unitarias; no se cubre la integración con la BD | Documentarlo en el README |
