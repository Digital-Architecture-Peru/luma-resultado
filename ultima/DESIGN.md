# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + Java + Quarkus (capa Full Stack) para "Notificación" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + Java + Quarkus y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN (refinamiento)

## Decisiones de arquitectura
| ID | Decisión | Justificación |
|---|---|---|
| AD1 | Repositorio con `frontend/` (Angular) y `backend/` (Quarkus), cada uno con su build | Se entrega como una sola solución y cada capa compila y se prueba por separado |
| AD2 | El backend usa capas `resource → service → repository (puerto) → adaptador Panache` | Las pruebas unitarias del servicio usan mocks y no necesitan BD |
| AD3 | Migraciones Flyway versionadas: `V1__schema.sql` y `V2__seed_ficticio.sql` | Esquema reproducible y revisable de forma estática |
| AD4 | Interfaz `NotificationChannel` con una única implementación in-app | La integración está sin definir; email, SMS y push quedan como extensión |
| AD5 | Angular con componentes standalone en carpetas Atomic Design y estado con signals | Es el patrón pedido; los átomos son reutilizables |
| AD6 | Configuración en `application.properties` mediante `${ENV}` y `environment.ts` con `apiBaseUrl` | No incluye secretos ni credenciales en el código |
| AD7 | Montos en `BigDecimal` / `NUMERIC(18,2)` y fechas en `timestamptz` UTC | Evita errores de precisión y de zona horaria |

## Contrato API (v1)
- `GET /api/v1/accounts/{accountId}/notifications?unread&page&size`
- `PATCH /api/v1/notifications/{id}/read`
- `GET|PUT /api/v1/accounts/{accountId}/notification-preferences`
- Errores en JSON `{code, message}` con códigos 400, 404 y 409.

## Modelo de datos
- `notification(id uuid PK, account_id, type CHECK IN ('DEPOSIT','WITHDRAWAL','LOW_BALANCE'), title, body, amount, currency char(3), created_at, read_at NULL)`
- `notification_preference(account_id, type, enabled, threshold, PK(account_id,type))`
- Índices:
  - `(account_id, created_at DESC)`
  - Índice parcial `WHERE read_at IS NULL`
- Todo el acceso usa parámetros de Panache o JDBC, sin concatenar SQL.

## Estructura de módulos
```
backend/  pom.xml
  src/main/java/.../notification/{resource,service,domain,repository,channel}
  src/main/resources/{application.properties, db/migration/V1__,V2__}
  src/test/java/.../NotificationServiceTest.java
frontend/ package.json, angular.json
  src/app/ui/{atoms(badge,icon),molecules(notification-item),
              organisms(notification-list,preferences-form),
              templates,pages(notifications-page)}
  src/app/core/notification.service.ts (+ *.spec.ts)
README.md
```

## Hipótesis
- **H1.** Las notificaciones son in-app y muestran movimientos y alertas de cuenta. El origen real (core bancario o eventos) se simula con datos semilla ficticios.
- **H2.** La autenticación y la verificación de que la cuenta pertenece al cliente quedan fuera de alcance. Se deja un punto de extensión marcado en el código.
- **H3.** Versiones supuestas: Java 21, Quarkus 3.x y Angular 17 o superior (standalone). El runner de `*.spec.ts` será el que traiga el CLI instalado.
- **H4.** Los números de cuenta se guardan y muestran enmascarados (`****1234`). Los clientes y montos son ficticios.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| IDOR: un cliente consulta una `accountId` ajena | Verificación de propiedad pendiente y documentada en el README como no implementada |
| Datos personales en `body` | Sin datos reales; enmascarado obligatorio |
| Falta Maven o Node en el entorno | Se marca como **no verificado** y no se afirma compilación |
| El esquema PostgreSQL no se ejecuta (solo SQLite corre en memoria) | Solo revisión estática; SQL estándar y sintaxis específica mínima |
| Diferencias de versión entre Angular y Quarkus | Versiones fijadas en los manifiestos e indicadas en el README |

## Trazabilidad con la aceptación
- **Fuentes (T02):** AD1, AD2 y AD5.
- **Sintaxis (T03):** archivos `.java`, `.ts` y `.sql` revisables.
- **Pruebas (T04):** `NotificationServiceTest` (marcar como leída, filtrar no leídas, cuenta inexistente → 404) y `notification.service.spec.ts`.
- **BD (T04-db):** V1 y V2 con índices.
- **Docs (T05):** el README cubre:
  - build y ejecución;
  - variables de entorno;
  - integración sin definir;
  - PostgreSQL.
- **Cierre (T06):** el resumen se marca como candidate y enumera lo no verificado.
