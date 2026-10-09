# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + .NET (capa Full Stack) para "Notificación" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
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
| D1 | Monorepo con `frontend/`, `backend/`, `db/` y un README raíz | Una sola entrega Full Stack, fácil de revisar y de construir por partes |
| D2 | Backend .NET 8 Web API en capas Domain → Application → Infrastructure → Api | Aísla las reglas de notificación de PostgreSQL y de la integración, que no está definida |
| D3 | Acceso a datos con Npgsql + Dapper y SQL parametrizado (`@param`) | Cumple el acceso parametrizado de T04-db y mantiene el SQL explícito y revisable |
| D4 | Migraciones en archivos SQL versionados (`V001__`, `V002__`) | Permiten revisión estática del esquema, ya que PostgreSQL no se ejecuta en la validación |
| D5 | Integración detrás de `ICardEventSource` e `IChannelDispatcher`, con implementaciones *fake* | La integración no está definida. Así no hay llamadas a sistemas reales |
| D6 | Frontend con Vite + React + TS en Atomic Design y un cliente API tipado en `src/api` | Sigue el patrón pedido. Los componentes de presentación quedan sin lógica de red |
| D7 | Pruebas unitarias con xUnit (backend) y Vitest + Testing Library (frontend) | Herramientas estándar de cada stack y sin infraestructura externa |
| D8 | Nunca se persiste ni se muestra el PAN; solo `card_last4` y un `card_ref` opaco | Minimiza la exposición de datos de tarjeta (orientación PCI) |

## Estructura de módulos
```
backend/CardNotifications.sln
  src/CardNotifications.Domain/          Notification, NotificationType, Preference
  src/CardNotifications.Application/     INotificationRepository, ICardEventSource,
                                         IChannelDispatcher, NotificationService
  src/CardNotifications.Infrastructure/  PgNotificationRepository (Dapper), Fake*
  src/CardNotifications.Api/             Controllers, Program.cs, appsettings (sin secretos)
  tests/CardNotifications.UnitTests/     NotificationServiceTests, PreferenceRulesTests
frontend/
  src/components/atoms/      Badge, Icon, Toggle, Button
  src/components/molecules/  NotificationItem, PreferenceRow
  src/components/organisms/  NotificationList, PreferencesPanel
  src/components/templates/  NotificationCenterTemplate
  src/pages/                 NotificationsPage
  src/api/ src/hooks/        cardNotificationsClient, useNotifications
  src/**/*.test.tsx
db/migrations/  V001__schema.sql, V002__seed_ficticio.sql
```

## Contrato API (v1)
- `GET /api/v1/cards/notifications?status=unread|all&page=&size=`
- `PATCH /api/v1/cards/notifications/{id}/read`
- `POST /api/v1/cards/notifications/read-all`
- `GET /api/v1/cards/notification-preferences`
- `PUT /api/v1/cards/notification-preferences`

## Modelo de datos
- `card_notification`: `id uuid PK`, `customer_id`, `card_ref`, `card_last4 char(4)`, `type`, `title`, `body`, `severity`, `created_at timestamptz`, `read_at timestamptz NULL`.
- `notification_preference`: PK (`customer_id`, `event_type`, `channel`), `enabled bool`.
- Índices:
  - (`customer_id`, `created_at DESC`)
  - índice parcial de no leídas `WHERE read_at IS NULL`
- La conexión se configura con la variable de entorno `ConnectionStrings__Notifications`.

## Hipótesis
- **H1.** Los eventos de tarjeta cubiertos son: compra aprobada, compra rechazada, bloqueo/desbloqueo, cambio de límite y vencimiento próximo.
- **H2.** El canal real es *in-app*. Email, SMS y push solo existen como preferencia y se envían a un dispatcher fake.
- **H3.** El `customer_id` sale de los claims del token. En la versión candidate se usa un stub de autenticación de desarrollo, marcado y desactivado fuera de `Development`.
- **H4.** Versiones asumidas: .NET 8 y Node 20 LTS.
- **H5.** Las fechas se guardan en UTC y se muestran en hora local del navegador.
- **H6.** La paginación es por offset, suficiente para el volumen de demostración.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| El esquema PostgreSQL no se ejecuta, solo se revisa de forma estática | SQL estándar sin extensiones y migraciones pequeñas |
| La toolchain `dotnet` o `npm` puede no estar disponible | Se reporta como "no verificado" en el handoff |
| El stub de autenticación puede llegar a producción | Guardado por entorno y señalado en el README |
| Fuga de datos de tarjeta | D8 y datos ficticios sin formato de PAN real |
| La integración real no está definida | Contratos por interfaz, documentados en el README |
| Accesibilidad de la lista de notificaciones | Roles ARIA y contador de no leídas con `aria-live` |

## Trazabilidad con la aceptación
- Fuentes y manifiestos (`.csproj`, `package.json`) cubren T02.
- `*Tests.cs` y `*.test.tsx` cubren T04-tests.
- `db/migrations` cubre T04-db.
- `README.md` cubre T05.
- El handoff final (T06) se cierra como *candidate*, sin afirmar compilación ni despliegue.
