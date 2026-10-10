# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + .NET (capa Full Stack) para "Notificación" sobre Pagos en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + .NET y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Backend .NET 8 Web API en capas: `Domain` → `Application` → `Infrastructure` → `Api` | Permite probar la lógica con unitarias sin BD; la persistencia queda detrás de interfaces |
| D2 | Persistencia con Npgsql + SQL explícito (Dapper) y migraciones `V00N__*.sql` | Esquema versionado y revisable de forma estática; consultas con parámetros, sin concatenar SQL |
| D3 | Abstracción `INotificationChannel`; solo se implementa `InAppChannel` | La integración está sin definir; email, SMS y push quedan como extensión |
| D4 | Idempotencia con `UNIQUE(customer_id, payment_event_id)` | Un evento de pago no genera notificaciones duplicadas |
| D5 | Angular standalone con signals y Atomic Design (atoms/molecules/organisms/templates/pages) | Cumple el patrón pedido y facilita reutilizar y probar componentes aislados |
| D6 | Refresco por polling con intervalo configurable | Más simple que SignalR o SSE para una candidate |
| D7 | Configuración por variables de entorno (`ConnectionStrings__Notifications`, `API_BASE_URL`) | Sin secretos en el repositorio |

## Contrato API (v1)
- `GET /api/v1/notifications?status=UNREAD|READ&page=&size=`
- `GET /api/v1/notifications/unread-count`
- `PATCH /api/v1/notifications/{id}/read`
- `POST /api/v1/payment-events`: ingesta simulada (tipos `PAYMENT_COMPLETED`, `PAYMENT_REJECTED`, `PAYMENT_SCHEDULED`)

## Modelo de datos (PostgreSQL)
Tabla `notification`:
- Columnas: `id uuid PK`, `customer_id`, `payment_event_id`, `type`, `status`, `title`, `message`, `amount numeric(18,2)`, `currency char(3)`, `masked_account`, `created_at`, `read_at`.
- Restricciones: `CHECK` sobre `type` y `status`.
- Índice `(customer_id, status, created_at DESC)`.
- Seed `V002__seed.sql` con datos ficticios (cuentas enmascaradas `****1234`).

## Estructura de módulos
```
backend/
  Notifications.sln
  src/Notifications.Domain/            # Notification, NotificationType, reglas
  src/Notifications.Application/       # NotificationService, INotificationRepository, INotificationChannel
  src/Notifications.Infrastructure/    # PgNotificationRepository, InAppChannel
  src/Notifications.Api/               # Controllers, Program.cs, appsettings sin secretos
  db/migrations/V001__init.sql, V002__seed.sql
  tests/Notifications.UnitTests/       # xUnit + fakes
frontend/
  package.json, angular.json
  src/app/notifications/
    atoms/ (badge, icon, button)
    molecules/ (notification-item)
    organisms/ (notification-panel)
    templates/ (notifications-layout)
    pages/ (notifications-page)
    data/ (notification.service.ts, models.ts)
  *.spec.ts junto a cada componente y servicio
README.md
```

## Hipótesis
- **H1**: la autenticación está fuera de alcance. `customer_id` llega por la cabecera `X-Customer-Id` (marcador ficticio) y debe sustituirse por un claim del token.
- **H2**: las notificaciones son solo in-app. No se cubren canales externos ni preferencias de usuario.
- **H3**: se usan .NET 8 LTS y Angular 17+. Si la toolchain no existe localmente, el build queda marcado como no verificado.
- **H4**: la revisión del SQL PostgreSQL es solo estática; no hay motor en memoria.
- **H5**: no hay requisitos de retención. Se propone 90 días como referencia, sin job de purga implementado.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| H1 en producción expone datos de otros clientes | Documentarlo en README como bloqueante de producción |
| Exposición de PII financiera | Enmascarar cuentas y no registrar en logs montos con identificador |
| Carga por polling | Intervalo configurable y endpoint ligero `unread-count` |
| Accesibilidad de alertas | `aria-live="polite"` en el panel y contraste AA en el badge |
| Compilación no verificada | Resumen final como candidate con lista de lo no verificado |

## Trazabilidad con la aceptación
- **T02**: fuentes de backend y frontend del árbol anterior.
- **T04-tests**: proyectos xUnit y archivos `*.spec.ts`.
- **T04-db**: migraciones e índice.
- **T05**: README con build, variables de entorno, integración sin definir y persistencia PostgreSQL.
