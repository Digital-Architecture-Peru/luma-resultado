# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + .NET (capa Full Stack) para "Notificación" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + .NET y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN — Refinamiento

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Backend .NET 8 Web API en capas: `Domain`, `Application`, `Infrastructure`, `Api` | Aísla las reglas de notificación para probarlas sin BD ni HTTP |
| D2 | Acceso a PostgreSQL con Npgsql + Dapper detrás de `INotificationRepository`; solo SQL parametrizado (`@param`) | Cumple el acceso parametrizado y mantiene el SQL revisable de forma estática |
| D3 | Migraciones SQL versionadas en `db/migrations/V001__*.sql` y seed ficticio aparte (`V002__seed.sql`) | Separa el esquema de los datos y permite revisar cada cambio por versión |
| D4 | API REST mínima: `GET /api/accounts/{accountId}/notifications?unreadOnly=`, `PATCH /api/notifications/{id}/read`, `GET`/`PUT /api/accounts/{accountId}/notification-preferences` | Cubre lectura, marcado y preferencias sin integraciones externas |
| D5 | Front React + TS (Vite) con Atomic Design: atoms → molecules → organisms → templates → pages | Corresponde al patrón elegido y permite probar componentes de forma aislada |
| D6 | Cliente HTTP tipado (`notificationsApi.ts`) con DTO compartidos por contrato, no por código | Mantiene independientes los stacks de front y back |
| D7 | Configuración solo por entorno: `ConnectionStrings__Notifications`, `VITE_API_BASE_URL` | No se guardan secretos en el repositorio |
| D8 | Números de cuenta enmascarados (`****1234`) en el DTO y en la UI | Minimiza la exposición de datos en el canal de Banca por Internet |

## Modelo de datos (PostgreSQL)
- `account_notification`: `id uuid PK`, `account_id varchar(20)`, `customer_id varchar(20)`, `type varchar(30)` con CHECK (`DEPOSIT`, `WITHDRAWAL`, `LOW_BALANCE`, `STATEMENT`), `title`, `message`, `created_at timestamptz`, `read_at timestamptz NULL`.
- `notification_preference`: PK (`account_id`, `type`), `enabled boolean`.
- Índices: `(account_id, created_at DESC)` y un índice parcial `WHERE read_at IS NULL`.

## Estructura de módulos
```
backend/
  src/Notifications.Domain/        entidades, enums, reglas
  src/Notifications.Application/   servicios, DTO, interfaces
  src/Notifications.Infrastructure/ repositorio Npgsql+Dapper
  src/Notifications.Api/           controllers, Program.cs
  tests/Notifications.UnitTests/   xUnit + repositorio en memoria
db/migrations/                     V001__schema.sql, V002__seed.sql
frontend/src/
  components/atoms/                Badge, Icon, Button
  components/molecules/            NotificationItem
  components/organisms/            NotificationList, NotificationBell
  components/templates/            NotificationsLayout
  pages/                           NotificationsPage
  api/                             notificationsApi.ts, types.ts
  __tests__/                       Vitest + Testing Library
README.md
```

## Hipótesis
- H1: "Notificación" significa avisos in-app sobre eventos de cuenta (movimientos, saldo bajo, estado de cuenta). No incluye envío por SMS ni por email.
- H2: La autenticación queda fuera de alcance. El `customerId` llega en una cabecera simulada (`X-Demo-Customer`) y debe reemplazarse antes de cualquier uso real.
- H3: El origen de los eventos no está definido. Las notificaciones provienen solo del seed ficticio.
- H4: Se usa PostgreSQL 13 o superior porque `gen_random_uuid()` no requiere extensión.
- H5: El stack de pruebas es xUnit para .NET y Vitest para React. Ambos son pruebas unitarias, sin integración contra la BD.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| No hay toolchain `dotnet`/`npm` disponible y nada se compila | Se marca como no verificado en el handoff |
| El SQL de PostgreSQL solo admite revisión estática | Se usa sintaxis estándar y se documenta cómo ejecutar las migraciones |
| Acceso a notificaciones de otra cuenta (IDOR) | El repositorio filtra por `account_id` y `customer_id`; se deja pendiente en H2 |
| PII en el texto del mensaje | Las plantillas usan la cuenta enmascarada y no incluyen montos completos con nombre |
| Ambigüedad de zona horaria | Se usa `timestamptz` en UTC y el formateo se hace en el front |

## Criterios complementarios
Estos criterios se suman a los de la plantilla sin contradecirlos:
- Marcar una notificación como leída actualiza `read_at` y reduce el contador del `NotificationBell`. Esto se verifica con una prueba unitaria en cada stack.
- Una notificación cuyo tipo está deshabilitado en las preferencias no aparece en el listado. Esto se verifica con una prueba unitaria del servicio.
