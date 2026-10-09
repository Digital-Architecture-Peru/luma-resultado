# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + Java + Spring Boot
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + Java + Spring Boot (capa Full Stack) para "Transacción" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + Java + Spring Boot y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN: refinamiento

## Alcance interpretado (H1)
La capacidad es una **transferencia entre cuentas propias** del cliente en Banca por Internet. Incluye tres funciones: listar cuentas, registrar la transferencia y consultar movimientos. Ambas cuentas deben tener la misma moneda; no hay conversión cambiaria.

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | `frontend/` con Angular y `backend/` con Spring Boot y Maven | Cada capa se compila por separado; un solo README |
| D2 | Capas api → application → domain ← infrastructure, con el puerto `AccountRepository` | El dominio se prueba sin BD; la persistencia queda detrás de una interfaz |
| D3 | Montos `BigDecimal` / `NUMERIC(19,2)` | Evita errores de coma flotante |
| D4 | Transferencia en una sola `@Transactional`, con bloqueo pesimista ordenado por id | Débito y crédito atómicos; evita interbloqueos y doble gasto |
| D5 | Cabecera `Idempotency-Key` con índice único | Los reintentos no duplican cargos |
| D6 | Libro de movimientos: un débito y un crédito por transferencia | Trazabilidad y saldo conciliable |
| D7 | Flyway: `V1__schema.sql`, `V2__seed_ficticio.sql` | Migraciones versionadas |
| D8 | Spring Data JPA con parámetros enlazados | Ningún SQL concatenado |
| D9 | Angular standalone con Atomic Design; estado en un servicio con signals | UI reutilizable; NgRx sería una dependencia injustificada |
| D10 | Configuración por variables de entorno `DB_URL`, `DB_USER`, `DB_PASSWORD` | Sin secretos en el repositorio |

## Estructura de módulos
```
backend/src/main/java/com/example/cuentas/
  api/            TransferController, AccountController, dto/, GlobalExceptionHandler
  application/    TransferService
  domain/         Account, Transfer, Movement, excepciones de negocio
  infrastructure/ adaptadores JPA del puerto
backend/src/main/resources/db/migration/
backend/src/test/java/...   JUnit 5 + Mockito
frontend/src/app/
  atoms/      amount-input, button, badge
  molecules/  account-select, form-field
  organisms/  transfer-form, movement-list
  templates/  transaction-layout
  pages/      transfer-page
  core/       account.service, transfer.service, models
```

## Contrato API v1
- `GET /api/v1/accounts`: devuelve las cuentas del cliente ficticio.
- `POST /api/v1/transfers`: recibe `{sourceAccountId, targetAccountId, amount, currency, description}` con la cabecera `Idempotency-Key`. Responde 201 (creada), 409 (clave repetida con otro cuerpo) o 422 (regla de negocio).
- `GET /api/v1/accounts/{id}/movements`: devuelve los movimientos paginados.
- Los errores usan `ProblemDetail` (RFC 7807).

## Modelo de datos
- `account(id, number UNIQUE, holder, currency, balance NUMERIC(19,2) CHECK >= 0)`
- `transfer(id, idempotency_key UNIQUE, source_id FK, target_id FK, amount CHECK > 0, status, created_at)`
- `movement(id, account_id FK, transfer_id FK, type CHECK IN ('D','C'), amount, created_at)`
- Índice `movement(account_id, created_at DESC)`.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| No hay autenticación real | Cliente simulado (H2), documentado; la integración con un IdP queda fuera de alcance |
| Las pruebas unitarias no cubren SQL ni concurrencia | Revisión estática del esquema; proponer Testcontainers en otra iteración |
| El esquema PostgreSQL no se ejecuta | Se declara "no verificado" en el handoff |
| Maven o Node pueden no estar instalados | Resumen *candidate* sin afirmar compilación |
| Interpretación de "Transacción" | H1 es explícita; debe validarla negocio |

## Hipótesis
- **H2:** el cliente se identifica con un `X-Customer-Id` ficticio.
- **H3:** no hay límites diarios, OTP ni comisiones.
- **H4:** las versiones son Java 17+, Spring Boot 3.x y Angular 17+.
- **H5:** la integración externa no está definida, así que no se hacen llamadas externas.
- **H6:** SGC está en fallback, así que no se aplican estándares corporativos.

## Pruebas unitarias mínimas
- **`TransferService`:** casos de éxito, saldo insuficiente, misma cuenta, monedas distintas y clave de idempotencia repetida.
- **Controller (MockMvc `standaloneSetup`):** códigos HTTP 201, 409 y 422.
- **Angular:** validador de `amount-input`, emisión de evento de `transfer-form` y `transfer.service` con `HttpTestingController`.
