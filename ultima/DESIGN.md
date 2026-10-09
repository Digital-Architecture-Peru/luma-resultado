# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + Java + Spring Boot
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + Java + Spring Boot (capa Full Stack) para "Transacción" sobre Pagos en Banca por Internet, patrón Component-based (Atomic Design).
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
| ID | Decisión | Justificación |
|---|---|---|
| AD1 | Repositorio con `backend/` (Maven) y `frontend/` (Angular CLI) | Builds y pruebas independientes por capa |
| AD2 | Backend hexagonal ligero: `domain` → `application` (puertos) → `adapter` (web, persistence) | La integración no está definida. El puerto `PaymentGateway` permite un stub ficticio hoy y un adaptador real después |
| AD3 | Montos en `BigDecimal` / `NUMERIC(19,2)` y moneda `CHAR(3)` (ISO 4217) | Evita errores de redondeo en dinero |
| AD4 | Idempotencia con el header `Idempotency-Key`, respaldada por un índice `UNIQUE` | En una transacción de pago hay que impedir el doble cargo por reintento o doble clic |
| AD5 | Estados `PENDING → COMPLETED \| REJECTED` y columna `version` (bloqueo optimista) | Trazabilidad del ciclo y control de concurrencia sobre el saldo |
| AD6 | Migraciones Flyway: `V1__schema.sql`, `V2__seed_ficticio.sql`. Acceso con Spring Data JPA o `JdbcTemplate` parametrizado | Esquema versionado y sin SQL concatenado |
| AD7 | Errores con `ProblemDetail` (RFC 7807) y Bean Validation | Contrato de error uniforme que el frontend puede mapear |
| AD8 | Frontend con Atomic Design, componentes standalone y Reactive Forms | Responde al patrón pedido. Los componentes son reutilizables y se prueban por separado |
| AD9 | Configuración por variables de entorno `DB_URL`, `DB_USER`, `DB_PASSWORD`, sin valores por defecto sensibles | No incluir secretos |

## Contrato API (v1)
- `GET /api/v1/accounts`: cuentas ficticias del cliente.
- `POST /api/v1/payments` con header `Idempotency-Key` y cuerpo `{sourceAccountId, targetAccount, amount, currency, reference}`. Respuestas: 201, 400, 409 (clave repetida con otro cuerpo) y 422 (saldo insuficiente).
- `GET /api/v1/payments/{id}`: estado y comprobante.

## Modelo de datos (PostgreSQL)
- `account(id UUID PK, customer_id, number UNIQUE, currency, balance NUMERIC(19,2) CHECK ≥ 0, version)`
- `payment(id UUID PK, idempotency_key UNIQUE, source_account_id FK, target_account, amount CHECK > 0, currency, status, reference, created_at)`
- Índices: `payment(source_account_id, created_at DESC)` y `account(customer_id)`.

## Estructura de módulos
```
backend/src/main/java/.../payments/
  domain/       Payment, Account, PaymentStatus, Money
  application/  PaymentService, ports/{PaymentRepository, AccountRepository, PaymentGateway}
  adapter/web/  PaymentController, AccountController, dto/, ErrorHandler
  adapter/persistence/  entidades + repositorios
  adapter/gateway/      FakePaymentGateway
backend/src/main/resources/db/migration/  V1, V2
backend/src/test/java/...  PaymentServiceTest, PaymentControllerTest (MockMvc standalone + Mockito)
frontend/src/app/payments/
  atoms/      amount-input, app-button, status-badge
  molecules/  form-field, account-selector
  organisms/  payment-form, payment-receipt
  templates/  payment-layout
  pages/      new-payment-page
  services/   payment-api.service.ts (+ .spec con HttpTestingController)
```

## Hipótesis
- H1: "Transacción" se interpreta como una transferencia o pago desde una cuenta propia hacia una cuenta destino. Todos los datos son ficticios.
- H2: la autenticación la provee Banca por Internet y queda fuera de alcance. El `customerId` llega de forma simulada.
- H3: el procesamiento es síncrono y no hay core bancario real; `FakePaymentGateway` aprueba o rechaza de forma determinista.
- H4: las versiones son orientativas: Java 17, Spring Boot 3.x y Angular 17 o superior.
- H5: las pruebas "Unitarias" no incluyen e2e ni pruebas contra un PostgreSQL real.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sin toolchain local (Maven/npm) no se compila ni se prueba | Se marca como no verificado en el handoff |
| El SQL de PostgreSQL solo recibe revisión estática | Usar SQL estándar y evitar extensiones |
| Condición de carrera sobre el saldo | `version` optimista y operación `@Transactional` |
| La integración indefinida puede cambiar el contrato | Puerto aislado y DTO versionado `/v1` |
| SGC en fallback, sin reglas corporativas aplicadas | Registrar este hecho como pendiente de validar |

## Trazabilidad con la aceptación
Las fuentes y pruebas responden a T02/T04, las migraciones a T04-db y el README (build, variables de entorno, Flyway) a T05. El cierre es candidate, sin afirmar compilación.
