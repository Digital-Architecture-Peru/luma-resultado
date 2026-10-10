# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Spring Boot
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Spring Boot (capa Full Stack) para "Notificación" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + Java + Spring Boot y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN — Refinamiento

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Backend en capas *hexagonal-lite*: `api` → `application` → `domain`, con puertos hacia `infrastructure` | Aísla la integración (sin definir) y la persistencia detrás de interfaces. Permite pruebas unitarias con mocks y sin BD. |
| D2 | Acceso a datos con `NamedParameterJdbcTemplate` y SQL explícito | Acceso parametrizado verificable a simple vista y sin la "magia" de JPA. |
| D3 | Migraciones versionadas con Flyway (`V1__esquema.sql`, `V2__datos_ficticios.sql`) | Cumple T04-db y permite revisar el esquema de forma estática. |
| D4 | Entrega por canal mediante el puerto `CanalNotificacionPort`, implementado por `CanalLogFake` | No hay integración definida. El adaptador ficticio solo registra la notificación enmascarada. |
| D5 | API REST versionada `/api/v1` con errores `ProblemDetail` (RFC 7807) | Ofrece un contrato estable y errores uniformes para el front. |
| D6 | Front con Vite, React, TS y Atomic Design. La lógica vive en hooks y servicios, nunca en átomos | Los componentes quedan puros y testeables con Vitest y Testing Library. |
| D7 | Montos con `BigDecimal` y `NUMERIC(18,2)`. Fechas en `TIMESTAMPTZ` | Evita errores de precisión y de zona horaria. |

## Contrato API (candidate)
- `GET /api/v1/cuentas/{cuentaId}/notificaciones?leida=&page=&size=` devuelve una lista paginada.
- `PATCH /api/v1/notificaciones/{id}/lectura` marca la notificación como leída.
- `GET|PUT /api/v1/cuentas/{cuentaId}/preferencias-notificacion` consulta o actualiza tipo, canal, estado activo y umbral.

## Modelo de datos (PostgreSQL)
- **`notificacion`**: `id UUID PK`, `cuenta_id`, `tipo CHECK IN ('ABONO','CARGO','SALDO_BAJO')`, `mensaje`, `monto`, `leida`, `creada_en`.
  - Índice `(cuenta_id, leida, creada_en DESC)`.
- **`preferencia_notificacion`**: PK `(cuenta_id, tipo, canal)`, `canal CHECK IN ('EMAIL','SMS','APP')`, `activo`, `umbral_monto`.
- Los datos son ficticios y las cuentas aparecen enmascaradas (`****1234`).

## Estructura de módulos
```
backend/  pom.xml
  src/main/java/com/example/cuentas/notificaciones/
    api/ (NotificacionController, dto/, ManejadorErrores)
    application/ (NotificacionService, PreferenciaService)
    domain/ (Notificacion, Preferencia, TipoEvento, Canal)
    port/ (NotificacionRepository, CanalNotificacionPort)
    infrastructure/ (JdbcNotificacionRepository, CanalLogFake)
  src/main/resources/ (application.yml con ${DB_URL}..., db/migration/)
  src/test/java/... (ServiceTest con Mockito, ControllerTest con MockMvc standalone)
frontend/  package.json, vite.config.ts
  src/components/{atoms,molecules,organisms,templates}/
  src/pages/NotificacionesPage.tsx
  src/hooks/useNotificaciones.ts
  src/services/notificacionesApi.ts   (VITE_API_BASE_URL)
  src/types/
  src/**/*.test.tsx
README.md
```

## Hipótesis
- **H1.** "Notificación" se interpreta como alertas de movimientos y saldo bajo de cuentas, con un centro de notificaciones y preferencias por canal.
- **H2.** El `cuentaId` llega por la ruta. La autenticación y la autorización (token o sesión) quedan fuera de alcance.
- **H3.** La generación de eventos se simula con datos semilla. No se consume ningún bus ni core bancario.
- **H4.** Versiones asumidas: Java 17, Spring Boot 3.x y Node 20.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| IDOR por `cuentaId` sin auth (H2) | Se documenta como pendiente. El servicio valida la pertenencia mediante un puerto `TitularidadPort` (stub). |
| Toolchain ausente (Maven o npm) | Los artefactos sin compilar se marcan como **no verificados** en el handoff. |
| SQL de PostgreSQL solo con revisión estática | Se usa SQL estándar y se evitan extensiones (`gen_random_uuid` es nativo desde la versión 13). |
| Fuga de PII en logs o mensajes | Se enmascara la cuenta y no se registran montos junto a identificadores completos. |
| Canal real indefinido | Basta con el adaptador fake. Integrar un canal real solo requiere un nuevo adaptador del puerto. |

## Trazabilidad
- **T02:** D1, D4, D5 y D6.
- **T04-tests:** las pruebas unitarias del backend y del front.
- **T04-db:** D2, D3 y D7.
- **T05:** el README documenta las variables de entorno, Flyway y el estado de la integración (sin definir).
- **T06:** el resumen se entrega como candidate y no afirma compilación ni preparación para producción.
