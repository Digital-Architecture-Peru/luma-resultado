# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Quarkus (capa Full Stack) para "Notificación" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + Java + Quarkus y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento

> Complementa el diseño base y respeta sus criterios de aceptación. El SGC está en *fallback*, así que todo lo que no aparece en el guion se marca como hipótesis (H).

## Decisiones de arquitectura

| ID | Decisión | Justificación |
|---|---|---|
| AD1 | Monorepo con `backend/` (Quarkus 3, Maven, Java 17) y `frontend/` (React 18 + TS, Vite) | Cada parte usa su toolchain y se puede verificar por separado (Maven / npm). |
| AD2 | Backend en capas: `resource` → `service` → `port` (interfaz) → `adapter` (JDBC/Panache) | El servicio se prueba con dobles, sin necesidad de una base de datos. |
| AD3 | API REST `/api/v1`: `GET /cards/{cardId}/notifications?unread&page&size`, `PATCH /notifications/{id}/read`, `GET`/`PUT /cards/{cardId}/notification-preferences` | Contrato mínimo para un centro de notificaciones (H1). |
| AD4 | Flyway con `V1__schema.sql` (DDL e índices) y `V2__seed.sql` (datos ficticios) | Migraciones versionadas y reproducibles. |
| AD5 | Solo se guardan `card_last4` y `card_id` (UUID); nunca el PAN | Reduce la exposición a datos sensibles (PCI). |
| AD6 | Consultas con parámetros (`:cardId`, `?`), sin concatenar SQL | Previene inyección SQL. |
| AD7 | Front con Atomic Design: `atoms/molecules/organisms/templates/pages`; cliente API tipado; URL en `VITE_API_BASE_URL` | Sigue el patrón pedido y permite configurar por entorno. |
| AD8 | Configuración por variables de entorno (`QUARKUS_DATASOURCE_*`); `.env.example` sin valores reales | Sin secretos en el repositorio. |
| AD9 | Pruebas unitarias: JUnit 5 + Mockito (servicio y mapeos) y Vitest + Testing Library (átomos y moléculas). Sin `@QuarkusTest` | Las pruebas no requieren PostgreSQL ni contenedores. |

## Estructura de módulos

```
backend/
  pom.xml
  src/main/java/com/bank/cards/notifications/
    domain/      CardNotification, NotificationType, Preference
    port/        NotificationRepository, CardOwnershipPort
    service/     NotificationService
    adapter/     JdbcNotificationRepository, StubCardOwnership
    api/         NotificationResource, dto/, ErrorMapper
  src/main/resources/application.properties
  src/main/resources/db/migration/V1__schema.sql, V2__seed.sql
  src/test/java/.../NotificationServiceTest.java
frontend/
  package.json, tsconfig.json, vite.config.ts
  src/components/atoms/        Badge, Icon, Toggle
  src/components/molecules/    NotificationItem, PreferenceRow
  src/components/organisms/    NotificationList, PreferencesPanel
  src/components/templates/    CardNotificationsLayout
  src/pages/                   CardNotificationsPage
  src/api/                     notificationsClient.ts, types.ts
  src/**/*.test.tsx
README.md
```

## Modelo de datos (PostgreSQL)

**`card_notification`**
- `id` UUID, clave primaria
- `card_id` UUID
- `card_last4` CHAR(4)
- `type` VARCHAR, con CHECK sobre: `PURCHASE`, `PAYMENT_DUE`, `CARD_BLOCKED`, `LIMIT_REACHED`
- `title`
- `message`
- `amount` NUMERIC(14,2), nulo permitido
- `read_at` TIMESTAMPTZ, nulo permitido
- `created_at` TIMESTAMPTZ

Índices:
- `(card_id, created_at DESC)`
- índice parcial `WHERE read_at IS NULL`

**`notification_preference`**
- `card_id`
- `type`
- `enabled`
- Clave primaria compuesta `(card_id, type)`

## Hipótesis

- **H1:** "Notificación" significa un centro de notificaciones en la app (lista, marcar como leída, preferencias). Quedan fuera el envío por push, SMS o email.
- **H2:** La autenticación y la identidad del cliente vienen de Banca por Internet (fuera de alcance). La propiedad de la tarjeta se valida con `CardOwnershipPort`, que por ahora es un stub.
- **H3:** La integración con el core de tarjetas o el motor de eventos está sin definir. Los eventos se simulan con datos semilla.
- **H4:** Se usa paginación por offset (`page`/`size`) con un máximo de `size=50`.
- **H5:** Montos en una sola moneda (PEN) y textos en español, sin internacionalización (i18n).
- **H6:** La compilación y las pruebas solo se marcan como verificadas si Maven o npm están instalados localmente. El SQL de PostgreSQL solo recibe revisión estática.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Fuga de datos de tarjeta en logs o respuestas | Solo `last4` en DTOs; no registrar el cuerpo de las peticiones |
| Acceso a notificaciones de otra tarjeta (IDOR) | Verificar la propiedad en el servicio antes de cada consulta o cambio |
| SQL específico de PostgreSQL no ejecutado | Revisión estática; el README documenta cómo correr Flyway |
| Las versiones de Quarkus o React no coinciden con el estándar del banco (SGC ausente) | Versiones fijadas en los manifiestos y documentadas como candidate |
| Crecimiento de la tabla | Índice compuesto; retención y archivado como trabajo futuro |

## Trazabilidad a la aceptación

| Criterio | Cómo se cubre |
|---|---|
| Sintaxis | Archivos `.java`, `.ts`, `.tsx` y `.sql` verificables con el validador local |
| Pruebas | `NotificationServiceTest`, `NotificationItem.test.tsx`, `Toggle.test.tsx` |
| README | Build, ejecución, variables de entorno, migraciones e integración pendiente (H3) |

**Estado:** candidate. No se afirma que compile ni que esté listo para producción.
