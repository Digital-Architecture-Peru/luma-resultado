# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + Java + Spring Boot
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + Java + Spring Boot (capa Full Stack) para "Notificación" sobre Pagos en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + Java + Spring Boot y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN — Refinamiento

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Repo con `frontend/` (Angular, componentes standalone) y `backend/` (Spring Boot 3, Maven) | Un solo entregable con builds independientes |
| D2 | Backend en capas `domain`/`application`/`adapters`, con el puerto `NotificationSender` y un adaptador fake (log) | La integración está sin definir; queda aislada tras una interfaz |
| D3 | REST `/api/v1/payment-notifications` (GET paginado, PATCH `/{id}/read`) y `/api/v1/notification-preferences` (GET/PUT); el front consulta por polling | Contrato simple, sin infraestructura de tiempo real |
| D4 | Eventos de pago simulados con `POST /internal/payment-events` | No hay broker definido |
| D5 | Flyway `V1__schema.sql` + `V2__seed_ficticio.sql`; Spring Data JPA con parámetros | Migraciones versionadas, sin SQL concatenado |
| D6 | Idempotencia con `UNIQUE(payment_id, event_type)` | Evita notificar dos veces el mismo evento |
| D7 | Atomic Design en el front; los componentes presentacionales no llaman HTTP y los servicios viven en `core/` | Patrón pedido y componentes testeables |
| D8 | El DTO expone la cuenta enmascarada (`****1234`) | Protege el dato bancario sensible |
| D9 | `DB_URL`, `DB_USER` y `DB_PASSWORD` por entorno, sin valores por defecto | Sin secretos en el repositorio |

## Modelo de datos (PostgreSQL)
- `payment_notification`: `id UUID PK`, `customer_id`, `payment_id`, `event_type CHECK(...)`, `amount NUMERIC(15,2)`, `currency CHAR(3)`, `masked_account`, `status CHECK('UNREAD','READ')`, `created_at TIMESTAMPTZ`, `read_at`.
- Índices: `(customer_id, created_at DESC)` y un índice parcial `(customer_id) WHERE status='UNREAD'`.
- `notification_preference`: PK `(customer_id, event_type, channel)` y `enabled BOOLEAN`.

## Estructura de módulos
```
backend/  pom.xml
  src/main/java/.../notification/
    domain/       PaymentNotification, EventType, NotificationSender
    application/  NotificationService, PreferenceService
    adapters/in/web/   controllers, DTOs, mapper
    adapters/out/      persistence (JPA), sender/LogNotificationSender
  src/main/resources/  application.yml, db/migration/V1__,V2__
  src/test/java/...    *Test.java
frontend/  package.json, angular.json
  src/app/core/        notification.service.ts, models
  src/app/ui/atoms/    badge, icon-status
  src/app/ui/molecules/ notification-item, preference-toggle
  src/app/ui/organisms/ notification-list, preference-panel
  src/app/ui/templates/ notifications-layout
  src/app/pages/       notifications.page
README.md
```

## Pruebas unitarias
- **Backend** (JUnit 5 + Mockito):
  - el servicio respeta la idempotencia;
  - una preferencia deshabilitada no invoca `NotificationSender`;
  - marcar como leída fija `read_at`;
  - el mapper enmascara la cuenta;
  - el controller se prueba con `@WebMvcTest`.
- **Frontend** (Jasmine/Karma):
  - badge;
  - notification-list;
  - servicio con `HttpTestingController`.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Node o Maven no instalados | Marcar como no verificado en el handoff |
| SQL PostgreSQL sin ejecución local | Revisión estática; SQL estándar |
| Autenticación no definida | `X-Customer-Id` ficticio; no apto para producción (README) |
| Polling con carga alta | Intervalo configurable; SSE como evolución |
| Versiones Angular/Spring desalineadas | Fijar versiones en los manifiestos |

## Hipótesis
- **H1:** "Notificación" significa avisos de eventos de pago: `PAGO_EXITOSO`, `PAGO_RECHAZADO` y `PAGO_PROGRAMADO_PROXIMO`.
- **H2:** El canal principal es la bandeja in-app; email y SMS solo se simulan.
- **H3:** La autenticación y la sesión están fuera de alcance.
- **H4:** Versiones: Angular 17+, Java 17 y Spring Boot 3.x.
- **H5:** Sin SGC no se aplican estándares corporativos; los nombres y paquetes son genéricos.
- **H6:** Todos los datos (clientes, cuentas, montos) son ficticios.

## Trazabilidad
| Tarea | Elementos del diseño |
|---|---|
| T02 | D1–D4, D7–D9 |
| T04-db | D5, D6 y el modelo de datos |
| T04-tests | Sección de pruebas |
| T05 | README con la configuración de D9 y los riesgos |
| T06 | Lo no verificado según los riesgos |

Los criterios de aceptación base se mantienen sin cambios.
