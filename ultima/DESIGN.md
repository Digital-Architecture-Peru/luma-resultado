# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Quarkus (capa Full Stack) para "Notificación" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + Java + Quarkus y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN — Refinamiento

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (React+TS, Vite) y `backend/` (Quarkus, Maven) | Un solo entregable Full Stack; cada parte se construye con su toolchain |
| D2 | Backend en hexagonal ligero: `domain` → `application` → `infrastructure` | Permite pruebas unitarias sin BD y deja la integración sin definir tras un puerto |
| D3 | Puerto `NotificationChannel` con un adaptador `InAppChannel` (persistido) y un stub para canales externos | La integración no está definida; no se hacen llamadas reales |
| D4 | Persistencia con Flyway (`V1__schema.sql`, `V2__seed_ficticio.sql`) y repositorio con consultas parametrizadas (Panache o `PreparedStatement`) | Esquema versionado y sin concatenación de SQL |
| D5 | Frontend con Atomic Design estricto; los átomos no acceden a datos | El usuario eligió ese patrón; facilita reutilizar componentes en Banca por Internet |
| D6 | API REST versionada `/api/v1` con DTOs separados de las entidades | Contrato estable entre front y back |
| D7 | Configuración por `application.properties` con `${ENV}` y `.env.example` sin valores reales | Sin secretos |

**Contrato propuesto**
- `GET /api/v1/accounts/{accountId}/notifications?status=UNREAD&page=0&size=20`
- `PATCH /api/v1/notifications/{id}/read`
- `GET|PUT /api/v1/accounts/{accountId}/notification-preferences`

**Modelo de datos (PostgreSQL)**
- `notification(id uuid PK, account_id, type, title, message, status, created_at, read_at)`, con índice `(account_id, status, created_at DESC)`.
- `notification_preference(account_id, type, channel, enabled, threshold_amount numeric(15,2))`, con PK compuesta `(account_id, type, channel)`.
- `type` acepta los valores CREDIT, DEBIT y LOW_BALANCE mediante `CHECK`.

## Estructura de módulos
```
backend/src/main/java/.../notifications/
  domain/        Notification, NotificationType, Preference
  application/   ListNotifications, MarkAsRead, UpdatePreferences, ports/
  infrastructure/rest/ persistence/ channel/
backend/src/main/resources/db/migration/
backend/src/test/java/...   JUnit 5 + Mockito
frontend/src/
  components/atoms/      Badge, Button, Toggle, Icon
  components/molecules/  NotificationItem, PreferenceRow
  components/organisms/  NotificationList, PreferencesForm
  components/templates/  NotificationsLayout
  pages/                 NotificationsPage
  services/ hooks/ types/
frontend/src/**/*.test.tsx  Vitest + Testing Library
```

## Hipótesis (no confirmadas)
- H1: "Notificación" se entiende como alertas in-app de movimientos y saldo bajo, más preferencias por cuenta.
- H2: La autenticación la resuelve el gateway de Banca por Internet. Aquí se simula con un `customerId` en una cabecera stub.
- H3: Los canales externos (SMS, email, push) quedan fuera de alcance; solo existe su interfaz.
- H4: Las pruebas unitarias no levantan PostgreSQL. Los repositorios se prueban con mocks y el SQL se revisa solo de forma estática.
- H5: Se usa Quarkus 3.x con Java 17+, React 18 y Node 18+.
- H6: Los números de cuenta se muestran enmascarados (`****1234`) y todos los datos son ficticios.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| IDOR: leer notificaciones de otra cuenta | Validar la propiedad de `accountId` en el caso de uso, con una prueba que lo cubra |
| Datos sensibles en el texto de la notificación | Enmascarar los datos y no registrar montos ni cuentas en los logs |
| Maven o npm ausentes en el entorno | Marcar la compilación como no verificada en el handoff |
| Divergencia entre el dialecto SQL y la revisión estática | Usar SQL estándar de PostgreSQL y documentarlo en el README |
| Volumen de notificaciones | Paginación obligatoria e índice compuesto |
| Accesibilidad | `aria-live` en la lista y controles etiquetados |

## Aceptación complementaria
Estos criterios no sustituyen los de la plantilla base.
- Existe al menos una prueba por caso de uso y por organismo.
- `MarkAsRead` sobre una notificación ajena lanza un error de dominio.
- El README describe cómo construir el front y el back, las variables de entorno, las migraciones y la sección "No verificado".
