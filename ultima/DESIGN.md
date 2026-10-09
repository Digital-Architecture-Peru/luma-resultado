# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Spring Boot
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Spring Boot (capa Full Stack) para "Transacción" sobre Pagos en Banca por Internet, patrón Component-based (Atomic Design).
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
| D1 | Repositorio con `frontend/` (React + TS, Vite) y `backend/` (Spring Boot, Maven) | Cada parte se compila y prueba con su propia toolchain. |
| D2 | Backend en capas: `api` → `application` → `domain` ← `infrastructure` | El dominio no depende de Spring ni de la BD, así que se prueba con unitarias puras. |
| D3 | Puerto `PaymentGateway` con un adaptador `FakePaymentGateway` | La integración está sin definir; el contrato queda listo para un adaptador real. |
| D4 | Importes con `BigDecimal` en Java, `NUMERIC(19,2)` en SQL y `string` en el JSON | Evita los errores de redondeo de punto flotante. |
| D5 | Encabezado `Idempotency-Key` obligatorio en `POST`, con índice único en BD | Evita pagos duplicados por reintentos o doble clic. |
| D6 | Estados `PENDING`, `COMPLETED` y `REJECTED`, con transiciones validadas en el dominio | Da trazabilidad y prepara para una futura confirmación asíncrona. |
| D7 | Flyway con migraciones `V1__schema.sql` y `V2__seed_ficticio.sql`; acceso con `JdbcTemplate` y parámetros `?` | Esquema versionado y sin concatenar SQL. |
| D8 | Frontend con Atomic Design: `atoms/` (Button, Input, Amount) → `molecules/` (FormField, AccountSelect) → `organisms/` (PaymentForm, PaymentReceipt) → `templates/` → `pages/` | Es el patrón pedido y permite reutilizar en Banca por Internet. |
| D9 | Configuración por variables de entorno (`DB_URL`, `DB_USER`, `DB_PASSWORD`) sin valores por defecto sensibles | No se versionan secretos. |

## Contrato API (v1)
- `POST /api/v1/payments` recibe `{sourceAccount, beneficiary, amount, currency, reference}`. Responde `201` con `{id, status, createdAt}`, `400` si la validación falla y `409` si la idempotencia está en conflicto.
- `GET /api/v1/payments/{id}` responde `200` o `404`.
- `GET /api/v1/payments?account=...` lista paginada.
- Los errores siguen el formato `application/problem+json`.

## Estructura de módulos
```
backend/src/main/java/com/example/payments/
  api/            PaymentController, dto/, ErrorHandler
  application/    CreatePaymentService, PaymentQueryService
  domain/         Payment, PaymentStatus, Money, PaymentRepository (puerto), PaymentGateway (puerto)
  infrastructure/ JdbcPaymentRepository, FakePaymentGateway
backend/src/main/resources/db/migration/  V1__schema.sql, V2__seed_ficticio.sql
backend/src/test/java/...   CreatePaymentServiceTest, MoneyTest, PaymentTest (JUnit 5 + Mockito)
frontend/src/components/{atoms,molecules,organisms,templates}/  pages/PaymentPage.tsx
frontend/src/services/paymentsApi.ts   frontend/src/**/*.test.tsx (Vitest + Testing Library)
```

## Modelo de datos (PostgreSQL)
- Tabla `payment` con estas columnas:
  - `id UUID PK`
  - `idempotency_key VARCHAR(64) UNIQUE`
  - `source_account VARCHAR(34)`
  - `beneficiary VARCHAR(34)`
  - `amount NUMERIC(19,2) CHECK (amount > 0)`
  - `currency CHAR(3)`
  - `status VARCHAR(12)`
  - `reference VARCHAR(140)`
  - `created_at TIMESTAMPTZ`
- Índice `(source_account, created_at DESC)` para el listado.
- Los datos de semilla son ficticios, por ejemplo cuentas `ES00-FAKE-...`.

## Hipótesis
- H1. "Transacción de Pagos" significa un pago desde una cuenta propia del cliente a un beneficiario. No incluye programados, recurrentes ni multimoneda.
- H2. Autenticación, autorización y la sesión de Banca por Internet quedan fuera de alcance. El `sourceAccount` llega en la petición y se asume ya validado aguas arriba.
- H3. No se valida saldo real. `FakePaymentGateway` rechaza los importes mayores que un umbral ficticio para poder probar `REJECTED`.
- H4. Las versiones objetivo son Java 17+ / Spring Boot 3.x y Node 18+.
- H5. No hay estándares corporativos disponibles porque el SGC está en fallback. Se aplican convenciones idiomáticas.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| No se compila ni se ejecuta si falta JDK, Maven o npm | Marcarlo como no verificado en el resumen candidate. |
| El SQL de PostgreSQL solo recibe revisión estática | Usar SQL estándar compatible y declararlo en el README. |
| Falta de seguridad (sin auth ni CSRF) | Documentarlo como prerequisito antes de producción. |
| Concurrencia y doble envío | Usar D5 y deshabilitar el botón mientras se envía. |
| El contrato de integración real es desconocido | Aislarlo tras el puerto de D3. |

## Trazabilidad con la aceptación
- La sintaxis se verifica con la toolchain disponible.
- Las pruebas unitarias en los dos stacks cubren Money, transiciones de estado, servicio con mocks y PaymentForm.
- El README cubre build, ejecución, variables de entorno y persistencia.
- Se mantiene la publicación con commit, sin afirmar compilación ni producción.
