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

# DESIGN (refinamiento)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Repositorio con `backend/` (Maven) y `frontend/` (Angular CLI), cada uno con su propio manifiesto | Se entrega en un solo paquete y cada capa se compila y prueba con su toolchain |
| D2 | Backend por feature `cuentas` con capas controller → service → `CuentaRepository` (interfaz) → `JdbcCuentaRepository` | La persistencia queda detrás de una interfaz y el service se prueba con mocks |
| D3 | Acceso con `NamedParameterJdbcTemplate` y parámetros nombrados | Consultas parametrizadas sin SQL concatenado y sin el peso de JPA para una consulta de solo lectura |
| D4 | Solo endpoints `GET`, sin mutaciones | La capacidad es de tipo Consulta |
| D5 | Migraciones Flyway: `V1__esquema_cuentas.sql` y `V2__datos_ficticios.sql` | Esquema versionado y reproducible |
| D6 | DTO de salida con número de cuenta enmascarado (`****1234`), montos `BigDecimal` / `NUMERIC(18,2)` y moneda ISO 4217 | Se evita exponer el dato completo y se mantiene la precisión monetaria |
| D7 | Errores con `ProblemDetail` (400 y 404) | Formato estándar que el frontend puede consumir |
| D8 | Frontend en Atomic Design con componentes standalone y `CuentasApiService` en `core/` | La presentación no depende del transporte HTTP |
| D9 | Configuración por variables de entorno (`DB_URL`, `DB_USER`, `DB_PASSWORD`, `CORS_ORIGIN`) | No hay secretos en el repositorio |

## Contrato API
- `GET /api/v1/cuentas?clienteId={id}` → `200 [CuentaResumen]`
- `GET /api/v1/cuentas/{cuentaId}` → `200 CuentaDetalle` o `404`
- Campos de `CuentaResumen`: `id`, `numeroEnmascarado`, `tipo` (AHORRO|CORRIENTE), `moneda`, `saldoDisponible`, `estado`.

## Modelo de datos (PostgreSQL)
- Tabla `cuenta`:
  - `id UUID PK`
  - `cliente_id VARCHAR(20) NOT NULL`
  - `numero VARCHAR(20) UNIQUE`
  - `tipo` con `CHECK`
  - `moneda CHAR(3)`
  - `saldo_disponible` y `saldo_contable` como `NUMERIC(18,2)`
  - `estado` con `CHECK`
  - `fecha_apertura DATE`
  - `actualizado_en TIMESTAMPTZ`
- Índice `idx_cuenta_cliente (cliente_id)`.
- Semilla: de 2 a 3 clientes ficticios con 4 a 6 cuentas.

## Estructura de módulos
```
backend/  pom.xml
  src/main/java/.../cuentas/{api,service,domain,persistence}
  src/main/resources/{application.yml, db/migration/}
  src/test/java/.../cuentas/{CuentaServiceTest, CuentaControllerTest(@WebMvcTest)}
frontend/  package.json, angular.json
  src/app/core/cuentas-api.service.ts (+ .spec)
  src/app/shared/atoms/{monto, badge-estado, numero-enmascarado}
  src/app/shared/molecules/cuenta-item
  src/app/shared/organisms/lista-cuentas
  src/app/features/cuentas/{templates/cuentas-layout, pages/cuentas-page}
db/  (referencia a las migraciones de backend)
README.md
```

## Riesgos
- **R1 – Toolchain:** puede no haber Maven, JDK o Node disponibles. En ese caso la compilación y las pruebas quedan marcadas como no verificadas.
- **R2 – Esquema PostgreSQL:** solo se revisa de forma estática. Es posible que haya errores de dialecto que no se detecten.
- **R3 – Autenticación:** no está definida. El `clienteId` por parámetro no es seguro para producción.
- **R4 – Datos sensibles:** existe riesgo de exponer el número completo de cuenta. Se mitiga con D6.
- **R5 – Integración:** al no estar definida, el contrato puede cambiar.

## Hipótesis
- **H1:** Se usa Java 17 y Spring Boot 3.x con Maven.
- **H2:** Se usa Angular 17 o superior, con pruebas Jasmine/Karma por defecto.
- **H3:** El cliente se identifica con un parámetro simulado. La autenticación real queda fuera de alcance.
- **H4:** No se pagina, porque el volumen por cliente es bajo.
- **H5:** El SGC está en modo fallback, así que no se aplican lineamientos corporativos.
- **H6:** Las pruebas unitarias cubren el service, el controller, el API service y al menos un componente por nivel atómico.

## Trazabilidad a la aceptación
- La sintaxis se verifica con el validador local disponible.
- Los archivos `*Test.java` y `*.spec.ts` están presentes.
- El README incluye build, ejecución, variables de entorno y persistencia.
- El resultado es candidate, sin afirmar que compila ni que está listo para producción.
