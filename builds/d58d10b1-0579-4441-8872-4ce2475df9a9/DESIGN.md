# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Quarkus (capa Full Stack) para "Consulta" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + Java + Quarkus y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento

## Alcance funcional (hipótesis H1)
La consulta es de **solo lectura**. Permite **listar las tarjetas del cliente** y **ver el detalle de una tarjeta**: marca, tipo, estado, vencimiento, límite y saldo disponible. Los movimientos y las operaciones (bloqueo, pagos) quedan fuera.

## Decisiones de arquitectura
| ID | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `backend/` (Maven) y `frontend/` (npm) | Cada capa se compila con su propia toolchain y se puede verificar por separado |
| D2 | Quarkus REST + Jackson, con capas `api → application → domain ← infrastructure` | El dominio queda aislado y la persistencia vive detrás de un puerto `TarjetaRepository`, como pide la base |
| D3 | Hibernate ORM Panache con consultas parametrizadas (`find("clienteId", id)`) | Cumple el acceso parametrizado sin concatenar SQL |
| D4 | Flyway: `V1__esquema.sql`, `V2__datos_ficticios.sql` | Migraciones versionadas y reproducibles |
| D5 | PAN nunca almacenado. Solo `ultimos4`; sin CVV ni PIN | Minimiza el riesgo PCI; los datos son ficticios |
| D6 | Montos `NUMERIC(15,2)` ↔ `BigDecimal` ↔ `string` en JSON | Evita la pérdida de precisión de `number` en JS |
| D7 | Errores con RFC 7807 (`application/problem+json`); responde 404 si la tarjeta no existe o no es del cliente | No revela qué tarjetas existen |
| D8 | Frontend con React + Vite + TS estricto, Atomic Design, `fetch` tipado y `VITE_API_BASE_URL` | Sigue el patrón pedido y no fija secretos |
| D9 | Pruebas unitarias: JUnit 5 + Mockito (servicio y recurso sin levantar la base de datos) y Vitest + Testing Library (átomos, organismos) | Cubre el alcance "Unitarias" sin dependencias externas |

## Contrato API
- `GET /api/v1/tarjetas` devuelve `200 TarjetaResumen[]`.
- `GET /api/v1/tarjetas/{id}` devuelve `200 TarjetaDetalle`, o `404` en los casos de D7.
- El cliente se identifica con la cabecera `X-Cliente-Id` (UUID ficticio). Si falta o no es válida, responde `400`. Ver H2.

## Modelo de datos
Tabla `tarjeta`:
- `id UUID PK`
- `cliente_id UUID NOT NULL`
- `ultimos4 CHAR(4) CHECK (~ '^[0-9]{4}$')`
- `marca`, `tipo CHECK IN ('CREDITO','DEBITO')`, `estado CHECK IN ('ACTIVA','BLOQUEADA','VENCIDA')`
- `moneda CHAR(3)`, `limite_credito NUMERIC(15,2) NULL`, `saldo_disponible NUMERIC(15,2) NOT NULL`
- `vencimiento DATE`, `creado_en TIMESTAMPTZ DEFAULT now()`

Índice: `idx_tarjeta_cliente (cliente_id)`.

## Estructura de módulos
```
backend/  pom.xml
  src/main/java/com/banca/tarjetas/
    api/ (TarjetaResource, dto/, ProblemMapper)
    application/ (ConsultaTarjetasService)
    domain/ (Tarjeta, TarjetaRepository)
    infrastructure/ (TarjetaEntity, PanacheTarjetaRepository)
  src/main/resources/ application.properties, db/migration/V1..V2
  src/test/java/... (ServiceTest, ResourceTest)
frontend/ package.json, vite.config.ts, tsconfig.json
  src/components/ atoms/ (Badge, Monto, PanEnmascarado)
                  molecules/ (TarjetaResumenItem)
                  organisms/ (ListaTarjetas, DetalleTarjeta)
                  templates/ (ConsultaLayout)
  src/pages/TarjetasPage.tsx  src/services/tarjetasApi.ts  src/types/
  src/**/*.test.tsx
README.md
```

## Hipótesis
- **H1**: el alcance es solo listado y detalle (ver arriba).
- **H2**: la autenticación está sin definir. `X-Cliente-Id` es un sustituto temporal y en producción debe derivarse del token de sesión.
- **H3**: la moneda es configurable por tarjeta (ISO 4217). No se asume país.
- **H4**: la conexión a la base de datos va por `QUARKUS_DATASOURCE_*` desde el entorno. El README solo trae valores de ejemplo, sin credenciales.
- **H5**: versiones objetivo Java 17+ y Quarkus 3.x. No se han verificado contra la toolchain local.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Maven o npm no instalados | Marcar compilación y pruebas como **no verificadas** en el handoff |
| SQL PostgreSQL validado solo de forma estática | Usar SQL estándar, evitar extensiones y documentarlo |
| Usar la cabecera como identidad (H2) | Advertencia explícita en el README; no apto para producción |
| CORS entre Vite y Quarkus | `quarkus.http.cors` restringido a origen local configurable |

## Trazabilidad con la aceptación
- T02 se cumple con las fuentes listadas arriba.
- T03 se cumple con la sintaxis TS/Java/SQL verificable.
- T04 se cumple con las pruebas de D9 y las migraciones de D4.
- T05 se cumple con el README: build, ejecución, variables, integración sin definir y PostgreSQL.
- T06 cierra como *candidate*, sin afirmar compilación ni despliegue.
