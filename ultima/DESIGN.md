# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + Java + Quarkus (capa Full Stack) para "Notificación" sobre Pagos en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + Java + Quarkus y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN: refinamiento

> Complementa la plantilla base sin reemplazarla. Mantiene sus criterios de aceptación: sintaxis válida en lo verificable, pruebas y README presentes, y publicación con commit.

## Alcance funcional (hipótesis H1)
Notificaciones **in-app** sobre eventos de pago del cliente en Banca por Internet:
- `PAGO_EXITOSO`, `PAGO_RECHAZADO` y `PAGO_PROGRAMADO_PROXIMO`.
- Operaciones: listar, filtrar por no leídas y marcar como leída.
- Email y SMS quedan fuera. Se dejan detrás del puerto `NotificationChannel` con una implementación fake.

## Decisiones de arquitectura
| ID | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo `frontend/` + `backend/` + `README.md` | Un solo handoff, con build independiente por capa |
| D2 | Backend hexagonal-lite: `resource → service → port → adapter` | La integración está sin definir; los puertos permiten sustituirla sin tocar el dominio |
| D3 | Persistencia con Hibernate ORM Panache, solo con parámetros nombrados | Acceso parametrizado, sin concatenar SQL |
| D4 | Migraciones Flyway `V1__schema.sql` y `V2__seed_ficticio.sql` | Esquema versionado, revisable de forma estática |
| D5 | Importes en `NUMERIC(15,2)` / `BigDecimal` y moneda en ISO-4217 | Evita errores de redondeo en el dominio de pagos |
| D6 | Idempotencia con `UNIQUE(payment_reference, type)` | Evita notificaciones duplicadas si el evento se reintenta |
| D7 | Polling cada 30 s desde Angular, con SSE como evolución | Menor complejidad; no requiere infraestructura adicional |
| D8 | Enmascarado de cuenta (`****1234`) al construir el mensaje | Minimiza datos personales en la tabla y en la UI |
| D9 | Configuración por variables de entorno (`QUARKUS_DATASOURCE_*`, `API_BASE_URL`) | Sin secretos en el repositorio |

## Contrato API (v1)
- `GET /api/v1/payment-notifications?status=UNREAD&page=0&size=20` devuelve `200 {items[], total}`.
- `PATCH /api/v1/payment-notifications/{id}/read` devuelve `204`, o `404` si el id no existe.
- `POST /api/v1/payment-notifications` es interno y simula el evento de pago. Devuelve `201`, o `409` si es un duplicado.
- El cliente se identifica con la cabecera `X-Customer-Id` (ficticia, ver H3). Los errores siguen el formato `{code, message}`.

## Modelo de datos (PostgreSQL)
Tabla `payment_notification` con estos campos:
- `id UUID PK`
- `customer_id VARCHAR(36)`
- `payment_reference VARCHAR(40)`
- `type` y `status`, ambos con `CHECK`
- `title`, `message`
- `amount NUMERIC(15,2)`, `currency CHAR(3)`
- `created_at TIMESTAMPTZ`, `read_at TIMESTAMPTZ NULL`

Índices:
- `idx_pn_customer_status_created (customer_id, status, created_at DESC)`
- `uq_pn_ref_type`

## Estructura de módulos
```
frontend/src/app/
  atoms/       badge, icon, amount-text
  molecules/   notification-item
  organisms/   notification-list, notification-bell
  templates/   notifications-layout
  pages/       notifications-page
  core/        models/, services/payment-notification.service.ts
backend/src/main/java/.../notification/
  api/         PaymentNotificationResource, dto/
  domain/      PaymentNotification, NotificationType, NotificationStatus
  service/     PaymentNotificationService
  port/        NotificationRepository, NotificationChannel
  adapter/     PanacheNotificationRepository, FakeChannel
backend/src/main/resources/db/migration/   V1__, V2__
backend/src/test/java/...                  ServiceTest, MaskingTest
frontend/src/**/*.spec.ts                  átomos, organismos, servicio
```

## Pruebas unitarias
- **Backend:** JUnit 5 y Mockito sobre el servicio (marcar como leída, duplicado, enmascarado). No usa la base de datos real.
- **Frontend:** specs de Jasmine sobre `notification-item` y sobre el servicio con `HttpTestingController`.
- Las pruebas de integración y de Testcontainers quedan fuera de alcance.

## Hipótesis
- **H1.** El alcance se limita a notificaciones in-app sobre los tres tipos de evento listados.
- **H2.** Versiones supuestas: Angular 17+ con componentes standalone, Java 17 y Quarkus 3.x. El SGC está en fallback, así que no hay estándar corporativo confirmado.
- **H3.** La autenticación queda fuera de alcance. `X-Customer-Id` sustituye al token real.
- **H4.** El origen de los eventos de pago está sin definir y se simula con `POST`.
- **H5.** Los textos están solo en español.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sin Maven o npm locales, el código no se compila | Se marca como **no verificado** en el handoff |
| El SQL de PostgreSQL no se ejecuta, solo se revisa de forma estática | Usar sintaxis estándar y migraciones pequeñas |
| Exposición de datos personales en los mensajes | Enmascarado en el servicio, cubierto por una prueba unitaria |
| Atomic Design sobredimensionado para la capacidad | Limitarlo a 3–4 átomos, sin componentes vacíos |
| Carga por polling | Paginación, índice compuesto y evolución a SSE |
| CORS entre front y back | Configurar `quarkus.http.cors` por variable de entorno |

## Trazabilidad
| Tarea | Cobertura en este diseño |
|---|---|
| T02 | Estructura de módulos |
| T04-tests | Pruebas unitarias |
| T04-db | Modelo de datos y D3/D4 |
| T05 | README: build, ejecución, variables, integración sin definir y PostgreSQL |
| T06 | Lista de lo no verificado: compilación, ejecución del SQL y contrato real de integración |
