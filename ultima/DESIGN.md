# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Quarkus (capa Full Stack) para "Transacción" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + Java + Quarkus y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN (refinamiento)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (Vite + React + TS) y `backend/` (Quarkus, Maven) | Cada capa tiene su build independiente y el README los une |
| D2 | Backend por capas: `api` → `service` → `repository` (puerto) → adaptador JDBC | La lógica de la transacción se prueba de forma unitaria sin BD |
| D3 | Montos como `BigDecimal` / `NUMERIC(19,2)`; en el front, `string` | Evita errores de punto flotante en dinero |
| D4 | `@Transactional` con `SELECT … FOR UPDATE`, bloqueando cuentas en orden de id ascendente | Garantiza atomicidad y evita deadlocks entre transferencias cruzadas |
| D5 | Movimientos de doble partida (débito + crédito) en una tabla `movement` | Trazabilidad y saldo reconstruible |
| D6 | Cabecera `Idempotency-Key` con restricción `UNIQUE` | Evita el doble cargo por reintento o doble clic |
| D7 | Migraciones Flyway versionadas (`V1__schema.sql`, `V2__seed_ficticio.sql`) | Esquema versionado; SQL solo con parámetros |
| D8 | Errores en `application/problem+json` (RFC 7807) | Contrato de error uniforme para el front |
| D9 | Integración externa como puerto `CoreBankingGateway` con adaptador stub | La integración no está definida y no se llama a sistemas reales |
| D10 | Configuración por variables de entorno (`DB_URL`, `DB_USER`, `DB_PASSWORD`) sin valores por defecto sensibles | No se incluyen secretos en el código |

**Contrato API (candidate):**
- `GET /api/v1/accounts`
- `GET /api/v1/accounts/{id}/movements`
- `POST /api/v1/transfers` con cuerpo `{sourceAccountId, targetAccountId, amount, currency, description}`.
  - Respuesta `201` con el comprobante.
  - Errores: `409` saldo insuficiente, `422` validación, `409` idempotencia en conflicto.

## Estructura de módulos
```
frontend/src/
  components/atoms/       Button, Input, AmountInput, Label
  components/molecules/   FormField, AccountSelector
  components/organisms/   TransferForm, TransferReceipt, MovementList
  components/templates/   TransactionLayout
  pages/                  TransferPage
  services/               accountsApi.ts (fetch tipado)
  domain/                 types.ts, validation.ts
  __tests__/              Vitest + Testing Library
backend/src/main/java/.../cuentas/
  api/          TransferResource, AccountResource, dto/, ProblemMapper
  service/      TransferService, TransferValidator
  domain/       Account, Movement, Transfer, exceptions
  repository/   AccountRepository (puerto), JdbcAccountRepository
  integration/  CoreBankingGateway, StubCoreBankingGateway
backend/src/main/resources/db/migration/   V1__schema.sql, V2__seed_ficticio.sql
backend/src/test/java/...                  JUnit 5 + Mockito
```

**Esquema:**
- `account(id, number UNIQUE, holder_alias, currency, balance NUMERIC(19,2) CHECK >= 0, version)`
- `transfer(id UUID, idempotency_key UNIQUE, source_id, target_id, amount CHECK > 0, created_at)`
- `movement(id, account_id, transfer_id, type, amount, created_at)`
- Índices: `movement(account_id, created_at DESC)` y `transfer(source_id)`.

## Hipótesis
- **H1:** "Transacción" significa transferencia entre cuentas propias en la misma moneda. Pagos a terceros y cambio de divisas quedan fuera.
- **H2:** La autenticación no está en el alcance. El cliente se simula con un id fijo ficticio.
- **H3:** Versiones asumidas: Quarkus 3.x, Java 17+, Node 18+.
- **H4:** Las pruebas unitarias cubren `TransferService` (saldo, misma cuenta, monto ≤ 0, idempotencia), `validation.ts` y los organismos. No se incluyen pruebas de integración contra PostgreSQL.
- **H5:** El front llama al backend con un proxy de Vite en desarrollo, sin CORS abierto en producción.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sin JDK, Maven o Node local, la compilación no se verifica | Se declara como no verificado en el handoff |
| El SQL de PostgreSQL solo recibe revisión estática (no SQLite) | Usar sintaxis estándar y anotar lo no ejecutado |
| Concurrencia mal resuelta provoca saldo negativo | D4 + `CHECK` en la BD + prueba unitaria del validador |
| Ausencia de autenticación (H2) | Marcar como bloqueante antes de producción |
| SGC en estado fallback | Las reglas corporativas no se validan; quedan como pendiente |
