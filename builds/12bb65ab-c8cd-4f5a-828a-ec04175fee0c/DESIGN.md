# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + .NET (capa Full Stack) para "Notificación" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + .NET y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN (refinamiento)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Backend .NET 8 Web API en capas: `Domain`, `Application`, `Infrastructure`, `Api` | Aísla reglas de negocio y permite pruebas unitarias sin BD ni HTTP |
| D2 | Persistencia con Npgsql + Dapper, solo con consultas parametrizadas | SQL explícito, revisable de forma estática y sin concatenación de cadenas. No se usa EF Core para evitar migraciones generadas que no se pueden verificar aquí |
| D3 | Migraciones SQL versionadas (`V001__init.sql`, `V002__seed_ficticio.sql`) | Son legibles y se pueden aplicar con cualquier runner. El runner concreto queda fuera de alcance |
| D4 | `INotificationRepository` con implementación Postgres e implementación InMemory | Las pruebas no dependen de PostgreSQL y la demo funciona sin BD |
| D5 | `INotificationDispatcher` con implementación `FakeDispatcher` | La integración está sin definir. El contrato queda listo para conectar email, SMS o push |
| D6 | Nunca se almacena el PAN. Solo se guardan `card_ref` (token ficticio) y `card_last4` | Minimiza el alcance PCI y la exposición de datos sensibles |
| D7 | Angular con standalone components, signals y `HttpClient`. Atomic Design en `atoms/molecules/organisms/templates/pages` | Es el patrón pedido y da componentes pequeños y fáciles de probar |
| D8 | API REST `v1`: `GET /api/v1/notifications?unreadOnly&page`, `PATCH /api/v1/notifications/{id}/read`, `GET`/`PUT /api/v1/notification-preferences` | Contrato mínimo para bandeja y preferencias, con versionado explícito |
| D9 | Identidad del cliente mediante la abstracción `ICurrentCustomer`, con un fake en la demo | La autenticación de la Banca por Internet no está documentada |
| D10 | Pruebas con xUnit (.NET) y Jasmine/TestBed (Angular, `*.spec.ts`) | Son los runners por defecto de cada stack y no añaden dependencias extra |

## Estructura de módulos
```
backend/
  Tarjetas.Notificaciones.sln
  src/Domain/            Notification, NotificationType, Preference
  src/Application/       NotificationService, interfaces (Repository, Dispatcher, ICurrentCustomer)
  src/Infrastructure/    PostgresNotificationRepository (Dapper), InMemoryRepository, FakeDispatcher
  src/Api/               Controllers, Program.cs, appsettings.json (sin secretos; ConnectionStrings__Default por env)
  tests/Application.Tests/   xUnit
db/migrations/           V001__init.sql, V002__seed_ficticio.sql
frontend/
  package.json, angular.json
  src/app/notifications/
    atoms/      badge, icon-button
    molecules/  notification-item
    organisms/  notification-list, preferences-form
    templates/  notifications-layout
    pages/      notifications-page
    data/       notifications.api.ts, models.ts
  src/environments/  apiBaseUrl
README.md
```

## Modelo de datos (PostgreSQL)
- **`notification`**:
  - Columnas: `id uuid PK`, `customer_id`, `card_ref`, `card_last4 char(4)`, `type` (CHECK: `COMPRA`, `BLOQUEO`, `VENCIMIENTO`, `PAGO_MINIMO`), `title`, `body`, `event_id`, `created_at timestamptz`, `read_at null`.
  - Restricción `UNIQUE(event_id)` para tener idempotencia.
  - Índice parcial `(customer_id, created_at DESC) WHERE read_at IS NULL`.
- **`notification_preference`**: `PK(customer_id, type, channel)`, `enabled bool`.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| No hay .NET SDK ni Node disponibles, así que no se compila ni se ejecutan pruebas | Se marca como no verificado en el handoff |
| El SQL de PostgreSQL solo se revisa de forma estática | Usar sintaxis estándar y documentarlo en el README |
| SGC en fallback, sin estándares corporativos | Las decisiones quedan como hipótesis revisables |
| Exposición de datos de tarjeta | Aplicar D6, enmascarar en la UI y no registrar el cuerpo de la notificación en logs |
| No hay `package-lock` porque no se ejecuta `npm install` | Fijar versiones en `package.json` |

## Hipótesis
- H1. La notificación es in-app (bandeja más preferencias), no un envío real por canal.
- H2. Los tipos de evento se limitan a los cuatro listados.
- H3. Se usan .NET 8 LTS y Angular 17 o superior.
- H4. La autenticación y la fuente de eventos (core de tarjetas) están fuera de alcance.
- H5. Todos los datos son ficticios.

## Aceptación (complemento, sin alterar la base)
- Cada to-do (T01–T06) tiene trazabilidad a sus artefactos.
- El handoff es candidate, sin afirmar compilación ni producción.
