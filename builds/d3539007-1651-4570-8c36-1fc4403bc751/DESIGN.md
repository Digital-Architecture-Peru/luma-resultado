# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + Java + Spring Boot
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + Java + Spring Boot (capa Full Stack) para "Transacción" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + Java + Spring Boot y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (Angular 17+, standalone) y `backend/` (Spring Boot 3, Java 17, Maven) | Un solo workspace; cada capa compila por separado |
| D2 | Backend hexagonal: `domain`, `application`, `adapters` | Integración sin definir: puerto `CardNetworkPort` con adaptador stub y cambio sin tocar dominio |
| D3 | Persistencia con Spring JDBC (`NamedParameterJdbcTemplate`) y Flyway (`V1__`, `V2__`) | Acceso parametrizado explícito y migraciones versionadas (T04-db) |
| D4 | Montos en `NUMERIC(15,2)` / `BigDecimal` y moneda ISO-4217 | Evita errores de redondeo |
| D5 | Encabezado `Idempotency-Key` en POST con índice único | Una transacción no se duplica por reintento |
| D6 | Solo PAN enmascarado (`****1234`) y token ficticio; nunca PAN completo ni CVV | Minimiza alcance PCI-DSS; datos ficticios |
| D7 | Front Atomic Design: `atoms → molecules → organisms → templates → pages` y servicio HTTP tipado | Patrón pedido; componentes testeables aislados |
| D8 | Config por `application.yml` + variables de entorno (`DB_URL`, `DB_USER`, `DB_PASSWORD`) sin valores reales | Sin secretos en repo |

## Estructura de módulos
```
backend/src/main/java/com/bank/cards/
  domain/        CardTransaction, Money, TransactionStatus
  application/   CreateTransactionUseCase, port/{CardTransactionRepository,CardNetworkPort}
  adapters/in/web/      CardTransactionController, dto/, GlobalExceptionHandler
  adapters/out/persistence/ JdbcCardTransactionRepository
  adapters/out/network/     StubCardNetworkAdapter
backend/src/main/resources/db/migration/ V1__schema.sql, V2__seed_ficticio.sql
backend/src/test/java/...  (JUnit 5 + Mockito)
frontend/src/app/
  shared/ui/{atoms,molecules,organisms,templates}
  features/card-transaction/{pages,services,models}
  *.spec.ts (Jasmine/Karma)
```

## Contrato API (mínimo)
- `GET /api/v1/cards`: tarjetas del cliente (enmascaradas).
- `POST /api/v1/cards/{cardId}/transactions`: `{amount, currency, sourceAccountId, description}` → `201 {transactionId, status}`.
- `GET /api/v1/cards/{cardId}/transactions?page&size`: historial paginado.
- Errores con RFC 7807 (`ProblemDetail`): 400 validación, 404 tarjeta, 409 idempotencia, 422 regla de negocio.

## Modelo de datos
- `card(id UUID PK, customer_id, masked_pan, brand, status, credit_limit, available_balance)`
- `card_transaction(id UUID PK, card_id FK, amount NUMERIC(15,2) CHECK >0, currency CHAR(3), status, idempotency_key UNIQUE, created_at TIMESTAMPTZ)`
- Índices: `card_transaction(card_id, created_at DESC)` y `card(customer_id)`.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| "Transacción" ambigua | Hipótesis H1 documentada; dominio aislado para ajustar |
| PostgreSQL solo con revisión estática | SQL estándar sin extensiones; marcado no verificado |
| Toolchain Maven/npm ausente | Resumen indica qué no compiló |
| Concurrencia sobre saldo | `UPDATE ... WHERE available_balance >= :amount` atómico |
| Autenticación real fuera de alcance | `customerId` simulado; documentado como gap |

## Hipótesis
- **H1**: "Transacción" = pago a tarjeta de crédito desde cuenta propia. *No confirmado.*
- **H2**: autenticación/sesión la provee la Banca por Internet existente; aquí se simula.
- **H3**: moneda única por transacción, sin conversión FX.
- **H4**: la red/procesador se simula con stub que siempre aprueba montos ≤ disponible.
- **H5**: versiones Angular 17+ / Spring Boot 3.x / Java 17 sin restricción corporativa conocida (SGC en fallback).
