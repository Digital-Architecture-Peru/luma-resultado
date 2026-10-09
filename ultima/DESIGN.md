# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Spring Boot
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Spring Boot (capa Full Stack) para "Transacción" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + Java + Spring Boot y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento

## Alcance propuesto (hipótesis H1)
"Transacción sobre Tarjetas" se interpreta como **pago de tarjeta de crédito desde una cuenta propia** y **consulta de los movimientos de la tarjeta**. El alcance usa solo datos ficticios.

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (Vite + React + TS) y `backend/` (Spring Boot 3, Java 17, Maven) | Cada capa se compila con su toolchain nativa y se verifica por separado. |
| D2 | El frontend sigue Atomic Design: atoms → molecules → organisms → templates → pages | Es el patrón pedido y permite probar componentes aislados. |
| D3 | El backend usa capas controller → service → port (interfaz) → adapter | La integración está sin definir: un `CoreBankingPort` con adaptador fake permite cambiarla sin tocar el dominio. |
| D4 | Persistencia con Flyway (`V1__schema.sql`, `V2__seed.sql`) y `NamedParameterJdbcTemplate` | Las migraciones quedan versionadas y todo acceso es parametrizado, sin concatenar SQL. |
| D5 | Montos en `NUMERIC(15,2)` y `BigDecimal`; en JSON viajan como string `"150.00"` | Evita errores de punto flotante en dinero. |
| D6 | Header `Idempotency-Key` con restricción UNIQUE en BD | Impide pagos duplicados si el usuario reintenta. |
| D7 | Solo se guarda el PAN enmascarado (`last4`) | Minimiza el alcance PCI. Nunca se almacena el PAN completo. |
| D8 | Errores en formato RFC 7807 (`ProblemDetail`) y validación con Bean Validation | Son contratos de error uniformes que el front puede consumir. |
| D9 | Configuración por variables de entorno: `DB_URL`, `DB_USER`, `DB_PASSWORD`, `VITE_API_BASE_URL` | No hay secretos en el repositorio ni valores por defecto sensibles. |

## Contrato API (v1)
- `GET /api/v1/cards` devuelve las tarjetas del cliente enmascaradas.
- `GET /api/v1/cards/{cardId}/transactions?page=&size=` devuelve los movimientos paginados.
- `POST /api/v1/cards/{cardId}/payments` recibe `{sourceAccountId, amount}` y el header `Idempotency-Key`.
  - Responde `201` en el caso normal.
  - Responde `409` si la clave está duplicada.
  - Responde `422` si el saldo es insuficiente o el monto es inválido.

## Modelo de datos
- `card(id, customer_id, last4, brand, credit_limit, balance, version)`
- `account(id, customer_id, alias, balance, version)`
- `card_transaction(id, card_id, type, amount, status, idempotency_key UNIQUE, created_at)`
- Índices:
  - `idx_tx_card_created(card_id, created_at DESC)`
  - `idx_card_customer(customer_id)`
- La columna `version` soporta bloqueo optimista en el débito y el abono.

## Estructura de módulos
```
backend/src/main/java/com/example/cards/
  api/        CardController, dto/, ErrorHandler
  domain/     Card, Payment, PaymentService
  port/       CardRepository, CoreBankingPort
  adapter/    JdbcCardRepository, FakeCoreBankingAdapter
backend/src/main/resources/db/migration/  V1__schema.sql, V2__seed.sql
backend/src/test/java/...                 PaymentServiceTest, CardControllerTest
frontend/src/components/{atoms,molecules,organisms,templates}/
frontend/src/pages/CardPaymentPage.tsx
frontend/src/services/cardsApi.ts
frontend/src/**/*.test.tsx                Vitest + Testing Library
```

## Pruebas unitarias
- **Backend:** JUnit 5 + Mockito sobre `PaymentService` (idempotencia, saldo insuficiente, monto ≤ 0) y `@WebMvcTest` del controlador.
- **Frontend:** atoms y molecules (Input de monto, Button), validación del formulario y servicio API con `fetch` mockeado.

## Hipótesis
- **H1:** el alcance es pago de tarjeta y consulta de movimientos. Debe confirmarse con negocio.
- **H2:** la autenticación la resuelve Banca por Internet. Aquí `customerId` llega por header ficticio `X-Customer-Id`.
- **H3:** las versiones son Java 17 y Node 20. Si no hay toolchain local, la compilación queda como no verificada.
- **H4:** el SQL de PostgreSQL solo recibe revisión estática, porque no se ejecuta en SQLite.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Alcance ambiguo (H1) | Diseño por puertos; ampliar sin romper el contrato v1. |
| Concurrencia en saldo | Bloqueo optimista (`version`) + reintento controlado. |
| Pagos duplicados | D6. |
| Fuga de datos de tarjeta | D7; los logs no incluyen montos ni identificadores completos. |
| Sin contexto SGC (fallback) | Las restricciones corporativas no se han validado; revisar antes de pasar a producción. |
| Sin pruebas de integración ni E2E | Se declara explícitamente en el resumen final. |

## Criterios complementarios (no reemplazan la Aceptación base)
- Las migraciones V1 y V2 existen y todas las consultas usan parámetros con nombre.
- Existe al menos una prueba unitaria por capa (service, controller, componente React).
- El README documenta las variables de entorno y los comandos `mvn test` y `npm test`.
