# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Spring Boot
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Spring Boot (capa Full Stack) para "Notificación" sobre Pagos en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + Java + Spring Boot y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento: Notificación de Pagos (Full Stack)

## Decisiones de arquitectura
| ID | Decisión | Justificación |
|---|---|---|
| AD1 | Repositorio con `backend/` (Maven, `pom.xml`) y `frontend/` (Vite, `package.json`) | Cada capa tiene su propio build y sus pruebas, sin acoplar toolchains |
| AD2 | Backend en capas con puertos: `domain`, `application`, `port`, `adapter` | La integración está sin definir. `NotificationChannel` es un puerto con un adaptador fake (log) que se reemplaza sin tocar el dominio |
| AD3 | Persistencia con `NamedParameterJdbcTemplate` y migraciones Flyway versionadas | Las consultas son parametrizadas y el SQL es explícito, lo que facilita la revisión estática |
| AD4 | API REST `/api/v1/notifications`: `GET` (filtro `status`), `PATCH /{id}/read`, `POST` (simula evento de pago) | Es el contrato mínimo para listar, marcar como leída y generar la notificación |
| AD5 | Frontend en Atomic Design: atoms, molecules, organisms, templates, pages | Patrón pedido en el guion; las piezas se reutilizan y se prueban de forma aislada |
| AD6 | Importes en `BigDecimal` / `NUMERIC(15,2)` + `currency CHAR(3)`; cuenta enmascarada (últimos 4 dígitos) | Evita errores de precisión y no expone datos sensibles |
| AD7 | Configuración por entorno (`DB_URL`, `DB_USER`, `DB_PASSWORD`, `VITE_API_BASE_URL`) sin valores por defecto sensibles | Sin secretos en el repositorio |
| AD8 | Idempotencia con `UNIQUE (payment_reference, type)` | Evita notificaciones duplicadas si el evento se recibe dos veces |

## Estructura de módulos
```
backend/src/main/java/com/example/notifications/
  domain/        Notification, NotificationType, NotificationStatus
  application/   NotificationService
  port/          NotificationRepository, NotificationChannel
  adapter/       JdbcNotificationRepository, LogNotificationChannel, NotificationController
backend/src/main/resources/db/migration/
  V1__schema.sql
  V2__seed_ficticio.sql
backend/src/test/java/...  NotificationServiceTest (JUnit 5 + Mockito)
frontend/src/
  components/
    atoms/      Badge, Icon, Button
    molecules/  NotificationItem
    organisms/  NotificationList, NotificationBell
    templates/  NotificationsPanelTemplate
  pages/        NotificationsPage
  services/     notificationsApi.ts
  hooks/        useNotifications.ts
  types/
frontend/src/**/*.test.tsx  (Vitest + Testing Library)
README.md
```

## Modelo de datos (PostgreSQL)
Tabla `payment_notification` con las columnas:
- `id`, `customer_id`, `payment_reference`
- `type` (`PAYMENT_SUCCESS` | `PAYMENT_FAILED` | `PAYMENT_SCHEDULED`)
- `amount`, `currency`, `masked_account`
- `status` (`UNREAD` | `READ`)
- `created_at`, `read_at`

Índices:
- `(customer_id, created_at DESC)`
- Índice parcial sobre `customer_id` con `WHERE status = 'UNREAD'`

## Hipótesis
- **H1:** el canal es solo in-app. Email, SMS y push quedan fuera y se cubren con el puerto `NotificationChannel`.
- **H2:** el `customerId` llega por header simulado. La autenticación real queda fuera de alcance y se documenta como pendiente.
- **H3:** el frontend actualiza por polling configurable. WebSocket o SSE se pospone.
- **H4:** versiones: Java 17, Spring Boot 3.x, Node 18+, React 18.
- **H5:** textos en español y datos 100 % ficticios. No se asume país ni moneda real.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| El esquema PostgreSQL no se ejecuta, solo se revisa de forma estática | SQL estándar sin extensiones; queda marcado como no verificado |
| Puede faltar Maven o npm en el entorno | Lo que no tenga toolchain se reporta como no verificado en el handoff |
| No hay pruebas de integración con BD (solo unitarias) | Repositorio detrás de un puerto, mockeado en los tests; Testcontainers como siguiente paso |
| SGC en fallback: estándares corporativos no validados | Se declara en el README y en el resumen |
| Seguridad y autorización sin definir | Anotar en el README; no exponer el endpoint `POST` fuera de entornos de prueba |

## Trazabilidad con la aceptación
- Sintaxis: T03.
- Pruebas: `NotificationServiceTest` y tests de los componentes `.tsx` (T04).
- Esquema y datos ficticios: V1 y V2 (T04-db).
- README con build, ejecución, integración y persistencia (T05).
- Resumen candidate con lo no verificado (T06).
