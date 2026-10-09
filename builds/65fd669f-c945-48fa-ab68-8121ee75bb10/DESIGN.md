# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + Java + Quarkus (capa Full Stack) para "Consulta" sobre Pagos en Banca por Internet, patrón Component-based (Atomic Design).
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
| # | Decisión | Justificación |
|---|---|---|
| D1 | Repositorio con `frontend/` (Angular) y `backend/` (Quarkus), cada uno con su manifiesto | Un build idiomático por stack; T03 y T04 se verifican por separado |
| D2 | Backend por capas: `resource` → `service` → `repository` (puerto) → adaptador Panache | La consulta es de solo lectura; el puerto permite probar el servicio con mocks sin base de datos |
| D3 | API REST v1: `GET /api/v1/pagos?cuentaId&desde&hasta&estado&page&size` y `GET /api/v1/pagos/{id}`. Errores en `application/problem+json` | El contrato es explícito y paginado, y los errores tienen un formato estándar |
| D4 | `monto` como `BigDecimal` (NUMERIC(18,2)), `moneda` ISO 4217 y fechas en UTC (`timestamptz`) | Evita errores de redondeo y de zona horaria |
| D5 | Migraciones versionadas con Flyway: `V1__esquema.sql`, `V2__datos_ficticios.sql`. Índices `(cuenta_id, fecha_pago DESC)` y `(estado)` | Cubre T04-db con versionado; los índices corresponden a los filtros de D3 |
| D6 | Consultas parametrizadas (parámetros nombrados de Panache), sin concatenar SQL | Previene inyección SQL |
| D7 | Frontend Atomic Design con componentes standalone y un servicio `PagosApiService` (HttpClient) | Cumple el patrón pedido y desacopla la UI del transporte |
| D8 | Configuración por variables de entorno (`QUARKUS_DATASOURCE_*`, `apiBaseUrl` en `environment`), sin valores sensibles por defecto | Cumple la regla de no incluir secretos |
| D9 | Pruebas unitarias: JUnit 5 + Mockito (servicio y mapeo de DTO); specs de Angular con `HttpTestingController` (servicio, átomos y página) | Alcance "Unitarias", ejecutable sin base de datos real |

## Estructura de módulos
```
backend/  pom.xml
  src/main/java/.../pagos/
    api/        PagoResource, PagoDto, PaginaDto, ProblemMapper
    service/    ConsultaPagosService
    domain/     Pago, EstadoPago
    repository/ PagoRepository (puerto), PagoPanacheRepository
  src/main/resources/ application.properties, db/migration/V1__,V2__
  src/test/java/.../ ConsultaPagosServiceTest, PagoMapperTest
frontend/ package.json, angular.json
  src/app/pagos/
    atoms/      estado-badge, monto, cuenta-enmascarada
    molecules/  filtro-fechas, fila-pago
    organisms/  tabla-pagos, detalle-pago
    templates/  consulta-layout
    pages/      consulta-pagos.page
    data/       pagos-api.service, pago.model
  *.spec.ts junto a cada unidad probada
README.md
```

## Hipótesis
- H1: Angular 17+ (standalone), Quarkus 3.x y Java 17+. Las versiones exactas no están confirmadas.
- H2: La capacidad es solo de consulta. No se inician, editan ni anulan pagos.
- H3: La autenticación de Banca por Internet ocurre aguas arriba (gateway o BFF), que entrega una identidad asociada a `cuentaId`. Mientras no exista, el filtro por `cuentaId` es un parámetro marcado como provisional.
- H4: La integración está sin definir, así que no hay llamadas externas. La fuente es solo PostgreSQL.
- H5: Los estados de pago son `PENDIENTE`, `PROCESADO`, `RECHAZADO` y `ANULADO`. Son ilustrativos y no están confirmados con el negocio.
- H6: Las cuentas se muestran enmascaradas (últimos 4 dígitos) y todos los datos son ficticios.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sin Maven o npm locales no se puede afirmar compilación | Marcar como no verificado en T06 |
| SQL de PostgreSQL solo con revisión estática | Usar SQL estándar y documentar en el README cómo aplicar Flyway |
| Acceso a pagos de otra cuenta (IDOR) por la autenticación indefinida (H3) | Validar la pertenencia en el servicio en cuanto exista identidad; dejar un TODO explícito |
| Volumen de datos alto | Paginación obligatoria (`size` ≤ 100) e índices de D5 |
| Diferencias de zona horaria al mostrar fechas | Guardar en UTC y formatear en el cliente |

## Trazabilidad con aceptación
- T02 / T04-db → D2–D6 y la estructura de módulos.
- T04-tests → D9.
- T05 → README con build, variables de entorno, migraciones e integración sin definir.
- T06 → resumen candidate que lista los riesgos no verificados.
