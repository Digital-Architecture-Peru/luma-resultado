# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + .NET (capa Full Stack) para "Notificación" sobre Pagos en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + .NET y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN (refinamiento)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (React + TS + Vite) y `backend/` (.NET Web API) | Build y pruebas independientes por capa, con un único README |
| D2 | Backend por capas: `Api` → `Application` → `Domain`, más `Infrastructure` detrás de interfaces | La integración no está definida, así que se aísla tras `INotificationSource` y `INotificationRepository` |
| D3 | Acceso a datos con Npgsql + Dapper y SQL parametrizado | Usa SQL explícito y revisable de forma estática, sin depender de migraciones generadas por un ORM |
| D4 | Migraciones SQL versionadas en `db/migrations/V001__*.sql` | Coincide con el criterio de T04-db; PostgreSQL solo admite revisión estática |
| D5 | Canal único: bandeja in-app (no leídas, marcar como leída) | Email y SMS requieren integraciones no definidas |
| D6 | UI con Atomic Design: atoms → molecules → organisms → templates → pages | Patrón elegido en el guion; los componentes se prueban de forma aislada |
| D7 | Pruebas unitarias: xUnit (Domain/Application) y Vitest + Testing Library (componentes) | Corresponde a "Unitarias" en ambas capas |

## Contrato API (v1)
- `GET /api/v1/notifications?status=unread|all&page=&size=`
- `GET /api/v1/notifications/unread-count`
- `PATCH /api/v1/notifications/{id}/read`
- Errores en formato `ProblemDetails`. Los montos son decimales y van con `currency` ISO-4217.

## Modelo de datos
- Tabla `payment_notifications`:
  - `id uuid PK`
  - `customer_id`
  - `payment_ref`, enmascarada (`****1234`)
  - `type`, con CHECK: `PAYMENT_DONE | PAYMENT_REJECTED | PAYMENT_DUE`
  - `title`, `body`
  - `amount numeric(18,2)`, `currency char(3)`
  - `created_at timestamptz`, `read_at timestamptz NULL`
- Índices:
  - `(customer_id, created_at DESC)`
  - Índice parcial `(customer_id) WHERE read_at IS NULL`
- Seed con clientes y pagos ficticios.

## Estructura de módulos
```
backend/
  src/Payments.Notifications.Api/            Controllers, Program.cs
  src/Payments.Notifications.Application/    casos de uso, DTOs
  src/Payments.Notifications.Domain/         entidad, enum tipo, reglas
  src/Payments.Notifications.Infrastructure/  repositorio Dapper, fuente fake
  tests/Payments.Notifications.UnitTests/
db/migrations/  V001__schema.sql  V002__seed.sql
frontend/src/
  components/atoms/ (Badge, Icon, Button)
  components/molecules/ (NotificationItem, AmountText)
  components/organisms/ (NotificationList, NotificationBell)
  components/templates/ (NotificationsTemplate)
  pages/NotificationsPage.tsx
  services/notificationsApi.ts (+ mock)
  types/notification.ts
README.md
```

## Hipótesis
- H1: Se usan .NET 8 y Node 20 LTS. No están confirmadas.
- H2: La autenticación queda fuera de alcance. En desarrollo, el cliente se identifica con el header ficticio `X-Customer-Id`. En producción debe derivarse del token.
- H3: Los eventos de pago llegan por una integración por definir. Mientras tanto, se simulan con `FakeNotificationSource`.
- H4: Las fechas se guardan en UTC y se muestran en la zona del navegador.
- H5: La configuración, incluida la cadena de conexión, se lee de variables de entorno. No hay secretos en el repositorio.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| No se puede ejecutar PostgreSQL en la verificación | Revisión estática del SQL; resultado marcado como no verificado |
| Puede faltar la toolchain .NET o npm | Se reporta como no verificado en el handoff |
| Exposición de datos de pago | Referencia enmascarada, sin PAN ni datos personales reales |
| Contrato de integración desconocido | Interfaz estable y adaptador reemplazable |
| Accesibilidad de la bandeja | Roles ARIA, `aria-live` en el contador y foco visible |

## Trazabilidad con la aceptación
- La sintaxis se verifica sobre `.ts/.tsx/.cs/.sql` con validadores locales.
- Las pruebas residen en `backend/tests` y en `frontend/src/**/*.test.tsx`.
- El README documenta build, ejecución, la integración pendiente y PostgreSQL.
- La publicación se hace con commit y estado candidate.
