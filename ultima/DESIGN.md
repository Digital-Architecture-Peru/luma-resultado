# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Spring Boot
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Spring Boot (capa Full Stack) para "Notificación" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + Java + Spring Boot y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN (refinamiento)

## Decisiones de arquitectura

| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (Vite + React + TS) y `backend/` (Spring Boot, Maven) | Separa toolchains (npm / Maven) y permite verificar cada capa por separado |
| D2 | Backend por capas con puertos: `api → application → domain ← infrastructure` | Mantiene la persistencia y la integración (sin definir) detrás de interfaces, según el diseño base |
| D3 | Integración externa como puerto `NotificationPublisher` con adaptador `NoOp`/en memoria | No hay contrato definido; se evita cualquier llamada a sistemas reales |
| D4 | Migraciones versionadas con Flyway (`V1__schema.sql`, `V2__seed_ficticio.sql`) | Esquema reproducible y versionado; los datos de ejemplo quedan separados del esquema |
| D5 | Acceso parametrizado con Spring Data JPA o `NamedParameterJdbcTemplate` | Evita la concatenación de SQL |
| D6 | Frontend con Atomic Design: atoms → molecules → organisms → templates → pages | Es el patrón solicitado; permite probar unitariamente cada nivel |
| D7 | Configuración por entorno (`VITE_API_BASE_URL`, `SPRING_DATASOURCE_*`) | Sin secretos en el repositorio |
| D8 | Pruebas unitarias: JUnit 5 + Mockito (servicios y controladores con `@WebMvcTest`) y Vitest + Testing Library (componentes) | Cubren el alcance "Unitarias" sin depender de una BD real |

## Contrato API (hipótesis, v1)
- `GET /api/v1/cards/{cardId}/notifications?status=UNREAD&page=0&size=20`
- `PATCH /api/v1/notifications/{id}/read`
- `GET|PUT /api/v1/cards/{cardId}/notification-preferences`
- Errores en formato `ProblemDetail` (RFC 7807). Validación con `@Valid`.

## Modelo de datos (PostgreSQL)
- `card(id uuid PK, customer_id, brand, alias, pan_last4 char(4))`: no se almacena el PAN completo.
- `notification(id uuid PK, card_id FK, type, title, message, amount numeric(15,2), currency char(3), status, created_at timestamptz, read_at)`
- `notification_preference(card_id FK, type, channel, enabled, PK(card_id,type,channel))`
- Índice: `notification(card_id, status, created_at DESC)`.
- Restricciones `CHECK` en `type` (COMPRA, PAGO, VENCIMIENTO, BLOQUEO) y en `status` (UNREAD, READ).

## Estructura de módulos
```
backend/  pom.xml
  src/main/java/.../notifications/{api,application,domain,infrastructure/{persistence,publisher}}
  src/main/resources/{application.yml, db/migration/V1__schema.sql, V2__seed_ficticio.sql}
  src/test/java/.../ (service, controller)
frontend/ package.json, vite.config.ts, tsconfig.json
  src/components/{atoms,molecules,organisms,templates}/  src/pages/
  src/services/notificationsApi.ts  src/hooks/useNotifications.ts  src/types/
  src/**/*.test.tsx
README.md
```

## Hipótesis
- H1: Las notificaciones son eventos de tarjeta (compra, pago, vencimiento, bloqueo) que se consultan y se marcan como leídas. El cliente gestiona sus preferencias por tarjeta y canal.
- H2: La autenticación queda fuera de alcance. En desarrollo, el cliente se identifica con la cabecera ficticia `X-Customer-Id`.
- H3: El canal de entrega (push, email, SMS) no está definido. Solo se persiste la preferencia.
- H4: Versiones de referencia: Java 17+, Spring Boot 3.x, Node 18+. No se verificaron contra estándares SGC (estado fallback).
- H5: El esquema PostgreSQL solo recibe revisión estática. No se ejecuta en SQLite.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Faltan npm o Maven localmente, por lo que no se compila ni se prueba | Se marca como no verificado en el handoff; no se afirma compilación |
| Exposición de datos de tarjeta (PCI/PII) | Solo `pan_last4` y datos ficticios; nada sensible en los logs |
| El contrato de integración es desconocido | Se aísla en un puerto; el adaptador real queda pendiente |
| Sin SGC, se desconocen los lineamientos corporativos | Se registran como hipótesis para validarlas después |
| Atomic Design desproporcionado para el alcance | Se limita a los componentes necesarios |
| SQL con extensiones propias de PostgreSQL | Se usa SQL estándar, salvo `uuid` y `timestamptz` |

## Trazabilidad con la aceptación
- La sintaxis se verifica con el validador local por archivo (T03).
- Las pruebas `*Test.java` y `*.test.tsx` deben estar presentes (T04).
- El README documenta build, ejecución, variables, integración y persistencia (T05).
- El handoff se entrega como candidate e incluye lo no verificado (T06).
