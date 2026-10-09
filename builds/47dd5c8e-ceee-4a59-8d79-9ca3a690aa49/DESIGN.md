# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + Java + Spring Boot
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + Java + Spring Boot (capa Full Stack) para "Consulta" sobre Pagos en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + Java + Spring Boot y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN – Refinamiento

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (Angular) y `backend/` (Spring Boot) | Mantiene la capa Full Stack en un solo workspace y permite builds independientes. |
| D2 | Solo lectura: `GET /api/v1/pagos` paginado y `GET /api/v1/pagos/{id}` | Es una capacidad de Consulta. No se exponen escrituras. |
| D3 | Backend por capas: controller → service → `PagoRepository` (interfaz) → adaptador JDBC | Aísla PostgreSQL detrás de una interfaz y facilita las pruebas unitarias con mocks. |
| D4 | `NamedParameterJdbcTemplate` con parámetros nombrados | Acceso parametrizado explícito, sin concatenar SQL. |
| D5 | Migraciones Flyway: `V1__schema.sql` y `V2__seed_ficticio.sql` | Esquema versionado y reproducible. |
| D6 | Montos en `NUMERIC(15,2)` / `BigDecimal` y fechas en `TIMESTAMPTZ` | Precisión monetaria y zona horaria explícita. |
| D7 | Frontend con Atomic Design: atoms → molecules → organisms → templates → pages | Cumple el patrón pedido y reutiliza componentes. |
| D8 | `PagosApiService` en Angular con `HttpClient` y URL base en `environment` | Configuración sin secretos. La integración queda intercambiable. |
| D9 | Integración externa como puerto `ConsultaPagosExternaPort` con stub | La integración está "sin definir". Así se evita llamar a sistemas reales. |
| D10 | Configuración por variables de entorno (`DB_URL`, `DB_USER`, `DB_PASSWORD`) | Ningún secreto queda en el repositorio. |

## Estructura de módulos
```
backend/  pom.xml
  src/main/java/.../pagos/{api,service,domain,repository,integration,config}
  src/main/resources/{application.yml, db/migration/V1__,V2__}
  src/test/java/.../pagos/{api,service}   # JUnit 5 + Mockito
frontend/ package.json, angular.json
  src/app/shared/ui/{atoms,molecules,organisms,templates}
  src/app/features/pagos/{pages,services,models}
  *.spec.ts                               # Jasmine/Karma
README.md
```
Ejemplos de componentes: `atom-badge-estado`, `molecule-fila-pago`, `organism-tabla-pagos`, `template-consulta` y `page-consulta-pagos`.

## Modelo de datos (PostgreSQL)
- Tabla `pago`: `id UUID PK`, `cliente_id`, `cuenta_origen_mask`, `beneficiario`, `monto`, `moneda CHAR(3)`, `estado` (CHECK con PENDIENTE, PROCESADO o RECHAZADO), `fecha_pago`.
- Índice `ix_pago_cliente_fecha (cliente_id, fecha_pago DESC)` para el listado paginado.
- Seed: entre 10 y 20 filas ficticias, con cuentas ya enmascaradas.

## Hipótesis adicionales
- H1: "Consulta de Pagos" significa el historial de pagos realizados por el cliente, con filtros por fecha y estado.
- H2: La autenticación de Banca por Internet existe fuera del alcance. El `clienteId` se recibe de un contexto simulado (header `X-Cliente-Id`) y queda marcado como pendiente de integrar.
- H3: Versiones objetivo: Java 17, Spring Boot 3.x y Angular 17+. No están confirmadas por SGC, que está en fallback.
- H4: El tamaño de página por defecto es 20 y el máximo 100.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sin Maven/Node local, la compilación no se verifica | Se reporta como no verificado en el handoff (T06). |
| PostgreSQL solo se revisa de forma estática | SQL estándar sin extensiones; queda declarado en el README. |
| Exposición de datos sensibles | Solo datos enmascarados y ficticios, sin PAN ni números completos. |
| Autenticación simulada usada como real | Advertencia explícita en README y código (H2). |
| Contexto SGC ausente | Las decisiones se tratan como candidate, revisables al cargar SGC. |

## Trazabilidad a la aceptación
- Sintaxis: archivos `.java`, `.ts`, `.sql`, `.json` y `.yml` revisables con el validador local.
- Pruebas unitarias: `PagoServiceTest`, `PagoControllerTest`, `pagos-api.service.spec.ts` y `organism-tabla-pagos.spec.ts`.
- El README documenta build y ejecución, la integración sin definir y la persistencia PostgreSQL.
- El handoff es candidate y no afirma compilación ni producción.
