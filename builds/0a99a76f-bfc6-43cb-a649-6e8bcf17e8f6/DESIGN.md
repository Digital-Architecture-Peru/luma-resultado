# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + .NET (capa Full Stack) para "Transacción" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
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
| D1 | Backend .NET 8 en capas: Domain, Application, Infrastructure y Api (Minimal API) | Separa reglas de negocio de la persistencia. El dominio se prueba con unitarias sin base de datos. |
| D2 | Acceso a PostgreSQL con Npgsql y SQL parametrizado detrás de `IAccountRepository` y `IUnitOfWork` | Cumple el acceso parametrizado de forma explícita y auditable. Permite usar fakes en memoria en las pruebas. |
| D3 | Migraciones SQL versionadas (`V001__schema.sql`, `V002__seed_ficticio.sql`) | Son revisables de forma estática. No dependen de una herramienta de migración no instalada. |
| D4 | Montos con `decimal` en .NET, `NUMERIC(18,2)` en la base y `string` en el JSON | Evita errores de punto flotante en valores monetarios. |
| D5 | La transferencia usa una transacción de base de datos con `SELECT … FOR UPDATE` y bloquea las cuentas en orden ascendente de id | Garantiza saldo consistente y evita deadlocks. |
| D6 | Encabezado `Idempotency-Key` con restricción `UNIQUE` | Impide débitos duplicados si el cliente reintenta. |
| D7 | Errores con `ProblemDetails` (RFC 7807) | Da al front un contrato de error uniforme. |
| D8 | Front con React, TypeScript y Vite, organizado en Atomic Design. La lógica HTTP vive en `api/`, fuera de los componentes. | Responde al patrón pedido y deja componentes puros y testeables. |
| D9 | Pruebas unitarias con xUnit en .NET, y con Vitest y Testing Library en el front | Son las herramientas idiomáticas de cada stack. |

## Estructura de módulos
```
backend/
  Cuentas.sln
  src/Cuentas.Domain/          Account, Money, Transfer, DomainError
  src/Cuentas.Application/     TransferService, TransferCommand(+validación), puertos
  src/Cuentas.Infrastructure/  NpgsqlAccountRepository, UnitOfWork
  src/Cuentas.Api/             Program.cs, endpoints, appsettings (sin secretos)
  tests/Cuentas.UnitTests/     Domain + Application con fakes
db/migrations/                 V001__schema.sql, V002__seed_ficticio.sql
frontend/
  src/components/{atoms,molecules,organisms,templates}/
  src/pages/TransferPage.tsx
  src/api/accountsClient.ts    src/domain/types.ts
  src/**/*.test.tsx
README.md
```

## Contrato de API (candidate)
- `GET /api/accounts`: lista de cuentas del cliente ficticio.
- `GET /api/accounts/{id}/transactions?limit=`: movimientos de la cuenta.
- `POST /api/transfers` con body `{sourceAccountId, targetAccountId, amount, description}`. Responde 201, o 400/404/409/422 con ProblemDetails.

## Modelo de datos
- `accounts(id, number UNIQUE, holder, currency CHAR(3), balance NUMERIC(18,2) CHECK ≥0, created_at)`
- `transactions(id, account_id FK, transfer_id, type CHECK IN('DEBIT','CREDIT'), amount NUMERIC(18,2) CHECK >0, created_at)`
- `transfers(id, idempotency_key UNIQUE, source_id, target_id, amount, status, created_at)`
- Índice `transactions(account_id, created_at DESC)`.

## Hipótesis
- H1: "Transacción" se interpreta como transferencia entre cuentas propias en la misma moneda. No incluye pagos a terceros ni conversión de divisas.
- H2: la autenticación está fuera de alcance. Se usa un cliente ficticio fijo y queda un punto de extensión documentado.
- H3: la integración está sin definir. No hay llamadas a core bancario y todo se resuelve contra PostgreSQL.
- H4: la cadena de conexión llega por variable de entorno (`CUENTAS_DB`). El repositorio no contiene credenciales.
- H5: como no hay contexto SGC (fallback), no se aplican lineamientos corporativos específicos.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sin toolchain (.NET o npm) disponible | Se marca como no verificado en el handoff y no se afirma compilación. |
| El SQL de PostgreSQL solo recibe revisión estática | Se usa SQL estándar y simple, y el riesgo queda declarado en el README. |
| Concurrencia en saldos | Se aplican D5 y D6, y una unitaria cubre la regla de saldo insuficiente. |
| Ausencia de autenticación | Se aplica H2. No es apto para producción. |
| Ambigüedad del alcance (H1) | El servicio queda aislado tras un puerto y se puede ampliar a terceros. |

## Trazabilidad con la aceptación
- Las unitarias cubren: el monto debe ser mayor que 0, origen distinto de destino, saldo insuficiente, débito y crédito balanceados, idempotencia (con fake) y render de componentes y validación del formulario.
- El README y los archivos de prueba quedan presentes. El handoff se entrega como candidate.
