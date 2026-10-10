# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + .NET (capa Full Stack) para "Notificación" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
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
| D1 | La capacidad es un centro de notificaciones *in-app* de Cuentas: listar, contar no leídas y marcar como leída | Es el alcance mínimo verificable con integración sin definir. No requiere canales externos. |
| D2 | Backend .NET 8 Web API en capas: Domain, Application, Infrastructure y Api | Aísla la lógica de negocio para probarla de forma unitaria sin base de datos. |
| D3 | Acceso a datos con Npgsql y Dapper detrás de `INotificationRepository`, solo con SQL parametrizado (`@param`) | El SQL queda explícito y se puede revisar de forma estática. Evita inyección SQL. Permite un repositorio *fake* en las pruebas. |
| D4 | Migraciones versionadas en archivos `.sql` (`V001__`, `V002__seed`) | Permiten la revisión estática del esquema PostgreSQL sin motor disponible. |
| D5 | Frontend Angular con componentes *standalone* y Atomic Design (atoms, molecules, organisms, templates, pages) | Cumple el patrón pedido y favorece la reutilización y las pruebas aisladas. |
| D6 | `apiBaseUrl` en `environment.ts` y cadena de conexión por variable de entorno (`NOTIF_DB_CONNECTION`) | Ningún secreto queda en el repositorio. |
| D7 | Contrato REST versionado `/api/v1` | Facilita la evolución sin romper a los consumidores. |

## Contrato API
- `GET /api/v1/accounts/{accountId}/notifications?status=unread|all&page=1&pageSize=20` devuelve `200 {items, total}`.
- `GET /api/v1/accounts/{accountId}/notifications/unread-count` devuelve `200 {count}`.
- `PATCH /api/v1/notifications/{id}/read` devuelve `204`. Responde `404` si la notificación no existe o no pertenece al cliente.

## Modelo de datos
Tabla `account_notification`:
- `id uuid PK`
- `customer_id`
- `account_id`
- `type` (`DEPOSIT`, `WITHDRAWAL`, `LOW_BALANCE`)
- `title`
- `message`
- `created_at timestamptz`
- `read_at timestamptz NULL`

Índices:
- `(customer_id, account_id, created_at DESC)`
- Índice parcial `WHERE read_at IS NULL`

El *seed* usa datos ficticios con cuentas enmascaradas (`****1234`).

## Estructura de módulos
```
backend/
  Notifications.sln
  src/Notifications.Domain/          (Notification, NotificationType)
  src/Notifications.Application/     (INotificationRepository, NotificationService, DTOs)
  src/Notifications.Infrastructure/  (PgNotificationRepository)
  src/Notifications.Api/             (Program.cs, NotificationsController)
  tests/Notifications.UnitTests/     (xUnit, FakeRepository)
db/migrations/
  V001__create_account_notification.sql
  V002__seed_fictitious.sql
frontend/
  src/app/notifications/
    atoms/      (badge, icon-type)
    molecules/  (notification-item)
    organisms/  (notification-list)
    templates/
    pages/      (notifications-page)
    data/       (notification.service.ts, models)
    *.spec.ts
README.md
```

## Pruebas unitarias
- **.NET:** marcar como leída, idempotencia, rechazo por pertenencia, paginación y conteo.
- **Angular:** `notification.service` con `HttpTestingController`, `badge` y `notification-item`.

## Hipótesis
- H1: .NET 8 y Angular 17 o superior. No se confirmaron versiones.
- H2: la identidad del cliente viene de un *claim* simulado (`X-Customer-Id` en desarrollo). La autenticación real queda fuera de alcance.
- H3: no hay *push* en tiempo real (SignalR). La UI refresca de forma manual o al cargar la página.
- H4: la generación de notificaciones desde el core bancario no está definida. Solo existe el *seed*.
- H5: las fechas se guardan en UTC y se muestran en hora local en la UI.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| IDOR: acceso a notificaciones de otro cliente | Filtrar siempre por `customer_id` en el SQL. Cubierto con una prueba. |
| Exposición de PII en los mensajes | Enmascarar los números de cuenta. No mostrar saldos completos en el texto. |
| Toolchain `dotnet` o `npm` ausente | La compilación y las pruebas quedan marcadas como **no verificadas**. |
| PostgreSQL disponible solo en revisión estática | Usar SQL estándar. El README documenta cómo ejecutar las migraciones. |
| Crecimiento de la tabla | Paginación obligatoria e índices compuestos. La retención se define en el futuro. |
