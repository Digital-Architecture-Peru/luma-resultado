# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Quarkus (capa Full Stack) para "Notificación" sobre Pagos en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + Java + Quarkus y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento (Notificación de Pagos · Banca por Internet)

## Decisiones de arquitectura
| ID | Decisión | Justificación |
|---|---|---|
| AD1 | Backend Quarkus en capas: `resource → service → port (NotificationRepository) → adapter JDBC` | La integración está sin definir. La interfaz permite pruebas unitarias sin base de datos y cambiar el adaptador más adelante. |
| AD2 | Adaptador JDBC (Agroal) con `PreparedStatement` | El acceso queda parametrizado de forma explícita y no depende de ORM. |
| AD3 | Migraciones Flyway: `V1__schema.sql` y `V2__seed_ficticio.sql` | Esquema versionado y reproducible. Los datos de ejemplo quedan separados del esquema. |
| AD4 | Notificación in-app con consulta periódica (polling) cada 30 s desde el front | Es la opción más simple y verificable. SSE o WebSocket quedan como evolución. |
| AD5 | Front con Atomic Design: atoms, molecules, organisms, templates y pages, más un cliente API tipado | Sigue el patrón pedido. La UI y el acceso a datos quedan aislados para poder probarlos. |
| AD6 | Idempotencia por `UNIQUE(payment_id, type)` | Evita notificaciones duplicadas si el mismo evento de pago llega dos veces. |
| AD7 | Minimización de datos: solo los últimos 4 dígitos de la cuenta, sin datos sensibles | Reduce la exposición de datos en el contexto bancario. |

## Contrato API (v1)
- `GET /api/v1/notifications?status=unread|all&limit=20` devuelve `NotificationDto[]`.
- `GET /api/v1/notifications/unread-count` devuelve `{ count }`.
- `PATCH /api/v1/notifications/{id}/read` responde 204, o 404 si la notificación no pertenece al cliente.
- `POST /api/v1/notifications` es un endpoint interno que simula un evento de pago. Responde 201, o 409 si es duplicado.
- Cliente identificado por la cabecera `X-Customer-Id` con un valor ficticio (ver H2).

## Modelo de datos (PostgreSQL)
Tabla `notification` con estas columnas:
- `id UUID PK`
- `customer_id VARCHAR(36)`
- `payment_id VARCHAR(64)`
- `type VARCHAR(32) CHECK IN ('PAYMENT_SUCCEEDED','PAYMENT_FAILED','PAYMENT_SCHEDULED')`
- `title`, `message`
- `amount NUMERIC(15,2)`
- `currency CHAR(3)`
- `account_last4 CHAR(4)`
- `created_at TIMESTAMPTZ`
- `read_at TIMESTAMPTZ NULL`

Índices:
- `(customer_id, created_at DESC)`
- Índice parcial `WHERE read_at IS NULL`

## Estructura de módulos
```
backend/  (Maven, Quarkus)
  pom.xml
  src/main/java/.../notification/{api,service,domain,port,adapter/jdbc}
  src/main/resources/{application.properties,db/migration/V1__,V2__}
  src/test/java/.../NotificationServiceTest.java   (JUnit 5 + Mockito)
frontend/ (Vite, React, TS)
  package.json
  src/{atoms,molecules,organisms,templates,pages,api,hooks}
  src/**/*.test.tsx   (Vitest + Testing Library)
README.md
```
Componentes clave del front:
- Atoms: `Badge`, `Icon`, `Button`
- Molecules: `NotificationItem`
- Organisms: `NotificationBell`, `NotificationList`
- Hook: `useNotifications`

## Hipótesis
- **H1:** Canal solo in-app. Email, SMS y push quedan fuera de alcance.
- **H2:** La autenticación real (OIDC) está fuera de alcance. `X-Customer-Id` es un sustituto temporal.
- **H3:** El origen de los eventos de pago está sin definir. Se simula con el `POST` interno y con datos de ejemplo.
- **H4:** Idioma es-ES y moneda en formato ISO 4217. Las fechas se guardan en UTC y se muestran en hora local.
- **H5:** Configuración por variables de entorno (`QUARKUS_DATASOURCE_*`, `VITE_API_URL`), sin secretos en el repositorio.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| IDOR: marcar como leída una notificación de otro cliente | Todas las consultas filtran por `customer_id`. Hay una prueba unitaria que lo cubre. |
| Sin toolchain local (Maven/npm) | Se marca como no verificado y se entrega como candidate. |
| SQL específico de PostgreSQL (índice parcial, TIMESTAMPTZ) | Solo revisión estática, porque SQLite no es equivalente. |
| Carga por polling con muchos usuarios | Uso de `unread-count` ligero. Evolución prevista a SSE. |
| Montos con coma flotante | `BigDecimal` en Java y `NUMERIC` en la base de datos. En el front, formato con `Intl.NumberFormat`. |

## Trazabilidad con la aceptación
- **Sintaxis:** se revisan los archivos `.java`, `.ts`, `.tsx` y `.sql` con los validadores disponibles.
- **Pruebas presentes:**
  - `NotificationServiceTest`: listar, marcar como leída, rechazar el acceso de otro cliente y detectar duplicados.
  - `NotificationItem.test.tsx` y `NotificationBell.test.tsx`: render, contador y clic para marcar como leída.
- **README:** incluye build y ejecución, variables de entorno, migraciones e integración pendiente.
- **Publicación:** con commit. La compilación y la ejecución en producción no se afirman.
