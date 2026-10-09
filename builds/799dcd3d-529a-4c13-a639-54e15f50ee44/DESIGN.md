# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + Java + Quarkus (capa Full Stack) para "Notificación" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
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
| AD1 | Repositorio con dos módulos independientes: `frontend/` (Angular) y `backend/` (Quarkus con Maven) | El alcance es Full Stack. Cada capa se compila y prueba por separado. |
| AD2 | Backend en capas: `resource` (REST), luego `service` y luego el puerto `NotificacionRepository`, con una implementación JDBC/Panache que usa parámetros enlazados | Mantiene la persistencia detrás de interfaces. El servicio se prueba de forma unitaria con un mock del puerto, sin base de datos. |
| AD3 | Contrato REST versionado: `GET /api/v1/tarjetas/{tarjetaId}/notificaciones?leida=&page=&size=` y `PATCH /api/v1/notificaciones/{id}/leida` | Es la superficie mínima para listar notificaciones y marcarlas como leídas. La paginación evita respuestas sin límite. |
| AD4 | Migraciones Flyway: `V1__esquema.sql` y `V2__datos_ficticios.sql`. Índices en `(tarjeta_id, creada_en DESC)` y un índice parcial `WHERE leida = false` | El esquema queda versionado y reproducible. Los índices cubren las consultas del listado y de las no leídas. |
| AD5 | Front con componentes standalone organizados según Atomic Design: `atoms/`, `molecules/`, `organisms/`, `templates/`, `pages/`. Acceso HTTP centralizado en `core/services` | Aplica el patrón solicitado. Los componentes presentacionales no tienen dependencias y se prueban de forma aislada. |
| AD6 | Solo se guardan los últimos 4 dígitos de la tarjeta (`ultimos4`). Nunca se guarda el PAN | Reduce el alcance de cumplimiento de datos de tarjeta. |
| AD7 | Configuración por variables de entorno (`QUARKUS_DATASOURCE_JDBC_URL`, `QUARKUS_DATASOURCE_USERNAME`, `QUARKUS_DATASOURCE_PASSWORD`, `API_BASE_URL`), sin valores reales por defecto | No hay secretos en el repositorio. |
| AD8 | Pruebas unitarias: JUnit 5 + Mockito en el backend, Jasmine/Karma (`*.spec.ts`) en el front | Se limita a lo pedido (Unitarias). No se incluyen pruebas de integración contra PostgreSQL. |

## Estructura de módulos
```
backend/
  pom.xml
  src/main/java/com/example/tarjetas/notificaciones/
    api/        NotificacionResource.java, dto/
    domain/     Notificacion.java, TipoNotificacion.java
    service/    NotificacionService.java
    port/       NotificacionRepository.java
    infra/      JdbcNotificacionRepository.java
  src/main/resources/application.properties
  src/main/resources/db/migration/V1__esquema.sql, V2__datos_ficticios.sql
  src/test/java/.../service/NotificacionServiceTest.java
frontend/
  package.json, angular.json
  src/app/core/services/notificacion.service.ts (+ .spec.ts)
  src/app/ui/atoms/        badge-tipo, icono-estado
  src/app/ui/molecules/    item-notificacion
  src/app/ui/organisms/    lista-notificaciones
  src/app/ui/templates/    layout-notificaciones
  src/app/pages/           notificaciones-tarjeta.page
README.md
```

## Riesgos
- **R1:** puede que no haya JDK, Maven o Node en el entorno. En ese caso la compilación queda como no verificada y solo se revisa la sintaxis.
- **R2:** el SQL de PostgreSQL solo recibe revisión estática. Algunas sintaxis específicas (índice parcial, `TIMESTAMPTZ`) no se ejecutan.
- **R3:** la autenticación y la integración no están definidas. Los endpoints quedan sin control de acceso real, por lo que no son aptos para producción.
- **R4:** las versiones de Angular y Quarkus fijadas en los manifiestos pueden no coincidir con las del entorno corporativo.
- **R5:** sin SGC configurado (fallback) no se validan las convenciones corporativas.

## Hipótesis
- **H1:** "Notificación" significa alertas in-app que se consultan en Banca por Internet. No incluye push, SMS ni email.
- **H2:** los tipos de notificación son `CONSUMO`, `VENCIMIENTO`, `BLOQUEO` y `PAGO_RECIBIDO`.
- **H3:** las notificaciones las genera un proceso externo no definido. Esta solución solo las persiste y las expone.
- **H4:** el stack es Angular 17+, Java 17 y Quarkus 3.x.
- **H5:** el `tarjetaId` llega validado por una capa de seguridad externa (ver R3).
- **H6:** la tabla `notificacion` tiene las columnas `id`, `tarjeta_id`, `ultimos4`, `tipo`, `mensaje`, `leida` y `creada_en`.

## Trazabilidad con la aceptación
- **Sintaxis:** se verifican los archivos `.java`, `.ts`, `.json` y `.sql` con el validador local.
- **Pruebas:** `NotificacionServiceTest.java` y los `*.spec.ts` del servicio y de los átomos.
- **README:** incluye build, ejecución, variables de entorno, la integración "sin definir" y las migraciones PostgreSQL.
- **Handoff:** resumen *candidate* que lista R1–R3 como no verificados y no afirma compilación ni producción.
