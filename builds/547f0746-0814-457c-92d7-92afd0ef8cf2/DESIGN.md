# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Spring Boot
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Spring Boot (capa Full Stack) para "Transacción" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + Java + Spring Boot y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN (refinamiento)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (Vite + React 18 + TS) y `backend/` (Spring Boot 3, Java 17, Maven) | Build independiente por capa y README único |
| D2 | Front en Atomic Design: atoms → molecules → organisms → templates → pages | Patrón pedido; cada nivel se prueba de forma aislada |
| D3 | Back en capas: `api` → `application` → `domain` ← `infrastructure`, con el puerto `CoreBankingPort` y un adaptador fake | Integración sin definir; se reemplaza sin tocar el dominio |
| D4 | Montos en `BigDecimal` / `NUMERIC(19,2)` y como `string` en JSON | Evita errores de coma flotante |
| D5 | `POST /transfers` con cabecera `Idempotency-Key` y restricción `UNIQUE` en BD | Evita el doble débito por reintentos |
| D6 | `@Transactional` con `SELECT … FOR UPDATE` bloqueando las cuentas en orden ascendente de id | Garantiza atomicidad y evita deadlocks |
| D7 | Migraciones Flyway `V1__schema.sql` y `V2__seed_ficticio.sql`; acceso con Spring Data JPA o `JdbcTemplate` parametrizado | Esquema versionado, sin SQL concatenado |
| D8 | Errores en formato RFC 7807 (`ProblemDetail`) y validación con Bean Validation | Contrato de error uniforme que el front puede mapear |
| D9 | Configuración por entorno (`DB_URL`, `DB_USER`, `DB_PASSWORD`) y `.env.example` solo con placeholders | Sin secretos en el repo |

## Contrato API (v1)
- `GET /api/v1/accounts`: lista las cuentas del cliente.
- `GET /api/v1/accounts/{id}/movements?page=`: devuelve los movimientos paginados.
- `POST /api/v1/transfers` con body `{sourceAccountId, targetAccountId, amount, currency, description}`:
  - `201` si la transferencia se crea.
  - `409` si la clave de idempotencia ya existe o el saldo es insuficiente.
  - `422` si la validación falla.

## Modelo de datos (PostgreSQL)
- `accounts(id, number UNIQUE, customer_id, currency, balance CHECK >= 0, version)`
- `transfers(id, idempotency_key UNIQUE, source_id FK, target_id FK, amount CHECK > 0, status, created_at)`
- `account_movements(id, account_id FK, transfer_id FK, type DEBIT|CREDIT, amount, created_at)`
- Índices: `account_movements(account_id, created_at DESC)` y `transfers(source_id)`.

## Estructura de módulos
```
frontend/src/
  components/{atoms,molecules,organisms,templates}/  # Button, AmountInput, TransferForm…
  pages/TransferPage.tsx
  api/transfersClient.ts   hooks/useTransfer.ts   types/
  __tests__/ (Vitest + Testing Library)
backend/src/main/java/com/example/accounts/
  api/ (controllers, DTOs, ExceptionHandler)
  application/TransferService.java
  domain/ (Account, Transfer, Money, exceptions)
  infrastructure/ (persistence, corebanking/FakeCoreBankingAdapter)
backend/src/main/resources/db/migration/
backend/src/test/java/… (JUnit 5 + Mockito)
```

## Hipótesis
- H1: "Transacción" significa **transferencia entre cuentas propias** en la misma moneda. No se cubren pagos a terceros ni cambio de divisa.
- H2: La autenticación queda fuera de alcance. El `customerId` llega por un stub (cabecera `X-Customer-Id`) y está documentado como no apto para producción.
- H3: No hay requisitos de autenticación reforzada (OTP/SCA) ni límites regulatorios, porque el SGC está en fallback. Se usa un límite por operación configurable con valor ficticio.
- H4: Las pruebas son solo unitarias, sin Testcontainers. El SQL de PostgreSQL se revisa solo de forma estática.
- H5: Java 17 y Node 18 o superior como mínimos.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Malinterpretar el alcance de "Transacción" (H1) | Se deja explícito en el README y se aísla en `TransferService` |
| Concurrencia y doble débito | Mitigado con D5 y D6; no se verifica con BD real |
| SQL válido solo de forma estática | Se marca como no verificado en el handoff |
| Sin toolchain Maven/npm | Se reporta "no compilado" y no se afirma que el build pase |
| Ausencia de controles SGC (seguridad, auditoría) | Se registra como pendiente y queda marcado como candidate |

## Aceptación (complemento, sin alterar la base)
- Pruebas de `TransferService`: saldo insuficiente, misma cuenta, idempotencia repetida y caso feliz.
- Pruebas del front: `AmountInput` rechaza montos inválidos y `TransferForm` deshabilita el envío mientras la operación está en curso.
