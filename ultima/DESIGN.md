# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + Java + Spring Boot
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + Java + Spring Boot (capa Full Stack) para "Notificación" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + Java + Spring Boot y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN (refinamiento)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (Angular) y `backend/` (Spring Boot, Maven) | Un build independiente por capa y un README raíz |
| D2 | Backend en capas `api → application → domain ← infrastructure` | El dominio no depende de Spring. La persistencia y la integración quedan detrás de puertos |
| D3 | Puerto `NotificationDispatcher` con un adaptador no-op/log | La integración está sin definir. El contrato queda listo sin llamar a sistemas reales |
| D4 | Persistencia con `NamedParameterJdbcTemplate` y Flyway (`V1__schema.sql`, `V2__seed.sql`) | Consultas siempre parametrizadas y migraciones versionadas. El esquema es revisable sin ejecutar |
| D5 | Frontend con componentes standalone organizados por Atomic Design | Cumple el patrón pedido y permite probar cada componente de forma aislada |
| D6 | Tarjeta identificada por `card_ref` (token) y `last4`; nunca el PAN | Minimiza datos sensibles (enfoque PCI) |
| D7 | Configuración por variables de entorno (`DB_URL`, `DB_USER`, `DB_PASSWORD`) sin valores reales | Sin secretos en el repositorio |

## Contrato API (v1)
- `GET /api/v1/cards/{cardRef}/notifications?status=&page=&size=` devuelve una lista paginada.
- `GET /api/v1/notifications/unread-count` devuelve `{ count }`.
- `PATCH /api/v1/notifications/{id}/read` responde 204, o 404 si el id no existe.
- Errores en formato `ProblemDetail` (RFC 7807).

## Modelo de datos (PostgreSQL)
Tabla `card_notification`:
- `id UUID PK`
- `customer_ref VARCHAR(40)`
- `card_ref VARCHAR(40)`
- `last4 CHAR(4)`
- `type VARCHAR(30)` con CHECK: `TRANSACTION`, `PAYMENT_DUE`, `LIMIT_REACHED`, `CARD_BLOCKED`
- `title`, `message`
- `status` con CHECK: `UNREAD`, `READ`
- `created_at TIMESTAMPTZ`
- `read_at TIMESTAMPTZ NULL`

Índices:
- `(customer_ref, status, created_at DESC)`
- `(card_ref, created_at DESC)`

La semilla usa clientes y tarjetas ficticios.

## Estructura de módulos
```
backend/src/main/java/.../notifications/
  domain/          Notification, NotificationType, NotificationStatus
  application/     NotificationService, port/NotificationRepository, port/NotificationDispatcher
  infrastructure/  persistence/JdbcNotificationRepository, dispatch/LoggingDispatcher
  api/             NotificationController, dto/*, ApiExceptionHandler
backend/src/main/resources/db/migration/   V1__schema.sql, V2__seed.sql
backend/src/test/java/...                  NotificationServiceTest, NotificationMapperTest

frontend/src/app/notifications/
  atoms/      badge, icon, button
  molecules/  notification-item
  organisms/  notification-list, notification-bell
  templates/  notifications-layout
  pages/      card-notifications-page
  data/       notification-api.service.ts, notification.model.ts
  *.spec.ts   junto a cada componente y servicio
```

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sin toolchain local (JDK/Maven/Node) no hay compilación | Marcar como "no verificado" en el handoff (T06) |
| SQL de PostgreSQL no ejecutable en SQLite | Solo revisión estática y evitar sintaxis exótica |
| Exposición de datos de tarjeta | Usar únicamente `last4` y token; no registrar `message` en logs |
| Integración real desconocida | Puerto más adaptador no-op; contrato documentado en el README |
| Autenticación de Banca por Internet no definida | `customer_ref` simulado por cabecera de ejemplo, documentado como hipótesis |

## Hipótesis explícitas
- **H1.** Los tipos de notificación (D6 y modelo) son supuestos; el guion no los define.
- **H2.** La autenticación y la sesión las provee la plataforma existente. Aquí no se implementan.
- **H3.** Versiones objetivo: Java 17+, Spring Boot 3.x, Angular 17+ standalone. Pruebas con JUnit 5/Mockito y Jasmine/Karma por defecto.
- **H4.** Las notificaciones son de lectura en la web, sin push en tiempo real. WebSocket/SSE queda fuera de alcance.
- **H5.** "Unitarias" excluye las pruebas de integración contra PostgreSQL real.

## Trazabilidad con la aceptación
| Tarea | Entregables |
|---|---|
| T02 | `backend/`, `frontend/` |
| T03 | Validación de sintaxis local de `.java`, `.ts`, `.json`, `.sql` |
| T04-tests | `*Test.java`, `*.spec.ts` |
| T04-db | Migraciones Flyway con índices y semilla ficticia |
| T05 | README con build, ejecución, variables de entorno, puerto de integración y persistencia |
| T06 | Resumen *candidate* que lista lo no compilado ni ejecutado |
