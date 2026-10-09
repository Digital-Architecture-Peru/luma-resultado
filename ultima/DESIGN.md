# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + Java + Spring Boot
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + Java + Spring Boot (capa Full Stack) para "Consulta" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + Java + Spring Boot y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `backend/` (Spring Boot 3, Java 17, Maven) y `frontend/` (Angular 17+, componentes standalone). | Cada capa compila y se prueba por separado, y se identifica fácilmente en el handoff. |
| D2 | Backend por capas con puerto: `controller → service → repository`. Solo lectura, con `@Transactional(readOnly=true)`. | La capacidad es de consulta. Separar las capas permite probar el servicio sin BD. |
| D3 | API REST v1: `GET /api/v1/cuentas` (paginado) y `GET /api/v1/cuentas/{id}`. Errores con `ProblemDetail` (RFC 7807). | Es un contrato mínimo y versionado, con errores uniformes para el front. |
| D4 | DTO de salida con número enmascarado (`****1234`), `saldo` como `BigDecimal` y `moneda` en ISO 4217. Nunca se expone la entidad JPA. | Evita fugas de datos sensibles y errores de redondeo. |
| D5 | Persistencia con Flyway: `V1__crear_cuenta.sql` y `V2__datos_ficticios.sql`. Spring Data JPA con consultas parametrizadas. | Esquema versionado y sin riesgo de inyección SQL. |
| D6 | Configuración por entorno: `DB_URL`, `DB_USER`, `DB_PASSWORD` y `apiBaseUrl` en `environment.ts`, sin valores reales. | Cumple "sin secretos". |
| D7 | Front en Atomic Design: atoms (`monto`, `badge-estado`), molecules (`tarjeta-cuenta`), organisms (`lista-cuentas`, `detalle-cuenta`), templates (`layout-consulta`), pages (`cuentas-page`). Acceso HTTP aislado en `CuentasApiService`. | Es el patrón solicitado. La lógica de datos queda fuera de la presentación. |
| D8 | Pruebas unitarias con JUnit 5 + Mockito (servicio) y `@WebMvcTest` (controller) en el back, y Jasmine (`*.spec.ts`) para atoms, servicio y page en el front. | Cubre el tipo de prueba pedido sin depender de una BD real. |

## Estructura de módulos
```
backend/  pom.xml
  src/main/java/.../cuentas/{api,service,repository,domain,dto,config}
  src/main/resources/{application.yml, db/migration/V1__,V2__}
  src/test/java/.../cuentas/{CuentaServiceTest,CuentaControllerTest}
frontend/ package.json, angular.json
  src/app/cuentas/{atoms,molecules,organisms,templates,pages,services,models}
  src/environments/environment.ts
README.md
```

## Modelo de datos (PostgreSQL)
Tabla `cuenta`:
- `id` UUID PK
- `cliente_id` VARCHAR NOT NULL
- `numero` VARCHAR UNIQUE
- `tipo` (AHORRO/CORRIENTE)
- `moneda` CHAR(3)
- `saldo` NUMERIC(18,2)
- `estado`
- `fecha_apertura`

Índice en `(cliente_id)`. Los datos de ejemplo son ficticios.

## Riesgos
- **R1:** puede que no haya Maven, npm o Angular CLI en el entorno. En ese caso la build queda como **no verificada** y solo se revisa la sintaxis.
- **R2:** PostgreSQL no se ejecuta en el sandbox. El esquema solo recibe revisión estática.
- **R3 (IDOR):** sin autenticación real, un cliente podría consultar cuentas ajenas. Se mitiga filtrando siempre por `clienteId`, pero el riesgo persiste hasta integrar la identidad real.
- **R4:** CORS y versiones de Angular o Spring pueden diferir del estándar corporativo, que se desconoce porque no hay SGC.

## Hipótesis
- **H1:** el `clienteId` llega en la cabecera `X-Cliente-Id` como stub. La autenticación y la integración real quedan sin definir y fuera de alcance.
- **H2:** "Consulta de cuentas" significa listado y detalle. Movimientos y transferencias quedan fuera.
- **H3:** las versiones objetivo son Java 17, Spring Boot 3.x y Angular 17+, porque no hay lineamiento SGC.
- **H4:** las respuestas son en español y los montos se formatean con `CurrencyPipe` según la moneda de la cuenta.
- **H5:** la solución es un candidate y no se afirma compilación ni preparación para producción.

## Aceptación (complemento, sin alterar la base)
- Los endpoints D3 devuelven el número enmascarado (D4).
- Existen archivos de prueba en `backend/src/test` y `frontend/**/*.spec.ts`.
- El README documenta la build, las variables de entorno, las migraciones y lo no verificado.
