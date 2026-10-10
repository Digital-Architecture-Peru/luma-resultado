# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + Java + Spring Boot
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + Java + Spring Boot (capa Full Stack) para "Notificación" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
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
| ID | Decisión | Justificación |
|---|---|---|
| AD1 | Monorepo con `frontend/` (Angular) y `backend/` (Spring Boot) | Un solo entregable Full Stack con build independiente por capa |
| AD2 | Backend en capas: `api`, `application`, `domain`, `infrastructure` | Aísla las reglas de notificación de la persistencia y de la integración, que está sin definir |
| AD3 | Puerto `NotificationDispatcher` con un adaptador `LoggingDispatcher` (no-op) | La integración está sin definir. Así se evitan llamadas a sistemas reales y queda un punto de extensión |
| AD4 | Migraciones Flyway versionadas (`V1__schema.sql`, `V2__seed_ficticio.sql`) y acceso con `JdbcTemplate`/`NamedParameterJdbcTemplate` parametrizado | Cumple T04-db: esquema versionado, sin SQL concatenado y SQL revisable de forma estática |
| AD5 | Frontend con Atomic Design, componentes standalone y un servicio `NotificationApiService` (HttpClient) | Es el patrón pedido. El servicio desacopla la UI del contrato REST |
| AD6 | Configuración por variables de entorno (`DB_URL`, `DB_USER`, `DB_PASSWORD`, `API_BASE_URL`) | Evita secretos en el repositorio |
| AD7 | Pruebas unitarias: JUnit 5 + Mockito (servicios y dominio) y Jasmine/TestBed (componentes y servicio) | Cubren el tipo de prueba pedido sin depender de una base de datos real |

## Contrato API (v1)
- `GET /api/v1/accounts/{accountId}/notifications?status=UNREAD|ALL&page&size`
- `PATCH /api/v1/notifications/{id}/read`
- `GET /api/v1/accounts/{accountId}/notification-preferences`
- `PUT /api/v1/accounts/{accountId}/notification-preferences`
- Errores en formato `application/problem+json` (400 / 404).
- La cuenta se expone enmascarada (`****1234`).

## Modelo de datos (PostgreSQL)
- `account_notification(id UUID PK, account_id VARCHAR(20), type VARCHAR(30) CHECK IN ('DEPOSIT','WITHDRAWAL','LOW_BALANCE'), message VARCHAR(255), amount NUMERIC(15,2), read_at TIMESTAMPTZ NULL, created_at TIMESTAMPTZ DEFAULT now())`
- Índices: `(account_id, created_at DESC)` y un índice parcial `WHERE read_at IS NULL`.
- `notification_preference(account_id PK, low_balance_threshold NUMERIC(15,2), deposit_enabled BOOL, withdrawal_enabled BOOL, updated_at TIMESTAMPTZ)`
- Datos semilla 100 % ficticios.

## Estructura de módulos
```
backend/  pom.xml
  src/main/java/com/example/cuentas/notificaciones/
    api/ (NotificationController, dto/, ProblemHandler)
    application/ (NotificationService, PreferenceService)
    domain/ (Notification, NotificationType, Preference, ports/)
    infrastructure/ (persistence/Jdbc*Repository, dispatch/LoggingDispatcher)
  src/main/resources/ application.yml, db/migration/V1__, V2__
  src/test/java/... (*ServiceTest, domain tests)
frontend/  package.json, angular.json
  src/app/notifications/
    atoms/ (badge, toggle, icon-button)
    molecules/ (notification-item, preference-row)
    organisms/ (notification-list, preferences-panel)
    templates/ (notifications-layout)
    pages/ (notifications-page)
    services/notification-api.service.ts (+ .spec.ts)
README.md
```

## Hipótesis
- **H1.** "Notificación" significa una bandeja in-app de eventos de cuenta más preferencias del cliente. Los canales email/SMS/push quedan fuera.
- **H2.** La autenticación y la resolución de la cuenta del cliente las provee la Banca por Internet existente (gateway/sesión). La solución candidate no implementa auth.
- **H3.** Versiones: Angular 17+, Java 17, Spring Boot 3.x y build con Maven.
- **H4.** El origen de los eventos de cuenta (core bancario) está sin definir. Se simula con datos semilla.
- **H5.** El saldo bajo se evalúa en el servicio contra el umbral de preferencia. No hay jobs programados.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| No hay contexto SGC (fallback): los estándares corporativos pueden diferir | Marcarlo en el handoff y aislar convenciones en configuración |
| Auth ausente: exposición de notificaciones de otra cuenta | Marcarlo como no apto para producción y dejar un punto de validación de ownership en `application` |
| El SQL de PostgreSQL solo se revisa de forma estática | Usar sintaxis estándar y documentar los pasos de verificación en el README |
| Toolchain (Maven/npm) no disponible: no se compila ni se ejecutan pruebas | Reportarlo como no verificado y no afirmar compilación |
| Datos sensibles (PII) | Usar solo datos ficticios, enmascarar la cuenta y no registrar montos ni IDs completos en logs |
