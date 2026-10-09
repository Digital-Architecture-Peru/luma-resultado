# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + Java + Quarkus (capa Full Stack) para "Transacción" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + Java + Quarkus y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| AD1 | Dos carpetas, `frontend/` (Angular) y `backend/` (Quarkus), cada una con su manifiesto (`package.json` y `pom.xml`) | Cada una compila, se prueba y se valida con su propia toolchain |
| AD2 | Backend por capas: `api` (JAX-RS) → `domain` (servicio y reglas) → `persistence` (interfaz de repositorio + implementación PostgreSQL) | Persistencia detrás de interfaces, como pide el diseño base; las pruebas unitarias usan fakes sin BD |
| AD3 | Montos con `BigDecimal` / `NUMERIC(19,2)`; en el JSON viajan como string decimal | Evita errores de punto flotante en dinero |
| AD4 | Cabecera `Idempotency-Key` con restricción `UNIQUE` | Evita el doble débito cuando el cliente reintenta |
| AD5 | Débito y crédito en una sola `@Transactional`; las cuentas se bloquean con `SELECT … FOR UPDATE`, ordenadas por id | Garantiza atomicidad y reduce el riesgo de deadlock |
| AD6 | Flyway: `V1__schema.sql` y `V2__seed_ficticio.sql`; consultas parametrizadas (Panache/PreparedStatement) | Migraciones versionadas y sin inyección SQL |
| AD7 | Componentes standalone de Angular organizados con Atomic Design; formularios con Reactive Forms | Cumple el patrón pedido; la validación se puede probar de forma unitaria |
| AD8 | Configuración por variables de entorno (`QUARKUS_DATASOURCE_*`, `API_BASE_URL`) | Sin secretos en el repositorio |

## Contrato API (candidate)
- `GET /api/v1/accounts` devuelve las cuentas propias (número enmascarado, moneda, saldo).
- `POST /api/v1/transfers` recibe `{sourceAccountId, targetAccountId, amount, currency, description}`. Responde `201 {transferId, status, createdAt}`.
  - `400`: validación.
  - `404`: cuenta inexistente.
  - `409`: clave de idempotencia reutilizada con otro payload.
  - `422`: saldo insuficiente, misma cuenta o moneda distinta.
- `GET /api/v1/accounts/{id}/movements` devuelve movimientos paginados.

## Modelo de datos
- `account(id, number_masked, owner_id, currency, balance, version)`
- `transfer(id, idempotency_key UNIQUE, source_id, target_id, amount, currency, status, created_at)`
- `movement(id, account_id, transfer_id, type DEBIT|CREDIT, amount, created_at)`
- Índices: `movement(account_id, created_at DESC)` y `account(owner_id)`.
- `CHECK (amount > 0)` y `CHECK (balance >= 0)`.

## Estructura de módulos
```
backend/src/main/java/.../cuentas/
  api/ (AccountResource, TransferResource, dto/, ErrorMapper)
  domain/ (TransferService, Account, Transfer, DomainException)
  persistence/ (AccountRepository, TransferRepository, pg/)
backend/src/main/resources/ (application.properties, db/migration/)
backend/src/test/java/... (TransferServiceTest, fakes/)
frontend/src/app/
  atoms/ (amount-input, app-button, field-error)
  molecules/ (account-selector, amount-field)
  organisms/ (transfer-form, movements-table)
  templates/ (transaction-layout)
  pages/ (transfer-page)
  core/ (accounts.service, transfers.service, models)
```

## Pruebas unitarias previstas
- **Backend (JUnit 5 + Mockito):** monto ≤ 0, misma cuenta, saldo insuficiente, moneda distinta, idempotencia y caso exitoso.
- **Frontend (Jasmine/Karma):**
  - validaciones de `transfer-form`;
  - `amount-input`;
  - servicios probados con `HttpTestingController`.

## Hipótesis
- **H1.** "Transacción" significa transferencia entre cuentas propias del mismo titular. No incluye terceros ni otros bancos.
- **H2.** Cada transferencia usa una sola moneda, sin conversión FX.
- **H3.** La autenticación está fuera de alcance: se usa un `owner_id` ficticio fijo, configurable por entorno.
- **H4.** Versiones: Angular 17+ (standalone), Java 17+ y Quarkus 3.x.
- **H5.** La integración está sin definir: no se conecta a core bancario y el adaptador queda como stub documentado.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sin toolchain local, la compilación no queda verificada | Marcarlo como no verificado en el handoff |
| PostgreSQL solo admite revisión estática | SQL estándar y migraciones simples |
| Las pruebas unitarias no prueban la concurrencia (AD5) | Documentar que faltan pruebas de integración (Testcontainers) |
| CORS y proxy entre el front y el back | `proxy.conf.json` y CORS restringido por variable de entorno |
| Interpretación de "Transacción" (H1) | Validarla con el negocio antes de pasar de candidate |
