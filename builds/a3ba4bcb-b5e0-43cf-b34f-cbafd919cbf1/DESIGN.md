# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + Java + Quarkus (capa Full Stack) para "Consulta" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + Java + Quarkus y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento: consulta de Tarjetas (Banca por Internet)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Repo con `frontend/` (Angular) y `backend/` (Quarkus) independientes | Cada uno tiene su propio build (npm / Maven) y se puede verificar por separado |
| D2 | API REST de solo lectura: `GET /api/v1/cards` y `GET /api/v1/cards/{cardId}` | La capacidad es Consulta, así que no hay mutaciones |
| D3 | Puerto `CardRepository` con adaptador PostgreSQL y SQL parametrizado (JDBC/Agroal o Panache) | Cumple "persistencia detrás de interfaces" y aísla la integración (sin definir) |
| D4 | Nunca se persiste ni se expone el PAN completo, solo `last4` y `maskedNumber` (`**** **** **** 1234`). Sin CVV | Minimiza la exposición a PCI DSS |
| D5 | `cardId` es un UUID opaco | Evita identificadores derivados del PAN |
| D6 | Filtro obligatorio por `customer_id` en cada consulta, obtenido de `CustomerContext` | Mitiga IDOR (acceso a tarjetas de otro cliente) |
| D7 | Errores en formato `application/problem+json` (404 si no existe o no pertenece al cliente) | Contrato uniforme que no filtra existencia |
| D8 | Migraciones Flyway: `V1__schema.sql` y `V2__seed_ficticio.sql` | Esquema versionado; los datos ficticios quedan separados |
| D9 | Angular con standalone components organizados por Atomic Design y `CardService` vía `HttpClient` | Sigue el patrón pedido y facilita las pruebas unitarias |
| D10 | Pruebas unitarias: JUnit 5 + Mockito (recurso y servicio) y specs de Angular (componentes y servicio) | Sin Testcontainers, porque las pruebas son solo unitarias |

## Estructura de módulos
```
backend/  pom.xml
  src/main/java/.../cards/
    api/            CardResource, CardDto, ProblemMapper
    application/    CardQueryService
    domain/         Card, CardType, CardStatus, CardRepository (puerto)
    infrastructure/ PgCardRepository, CustomerContext (stub)
  src/main/resources/ application.properties (vars de entorno)
    db/migration/   V1__schema.sql, V2__seed_ficticio.sql
  src/test/java/... CardQueryServiceTest, CardResourceTest
frontend/ package.json, angular.json
  src/app/cards/
    atoms/      badge-status, masked-number, amount
    molecules/  card-summary
    organisms/  card-list, card-detail
    templates/  cards-layout
    pages/      cards-page
    data/       card.service.ts, card.model.ts (+ *.spec.ts)
README.md
```

## Modelo de datos (PostgreSQL)
Tabla `card`:
- `id uuid PK`
- `customer_id uuid NOT NULL`
- `last4 char(4)`
- `brand`
- `card_type` (CHECK CREDIT/DEBIT)
- `status` (CHECK ACTIVE/BLOCKED/CANCELLED)
- `holder_name`
- `credit_limit numeric(15,2)`
- `available_balance numeric(15,2)`
- `currency char(3)`
- `created_at timestamptz`

Índices: `idx_card_customer(customer_id)` e `idx_card_customer_status(customer_id, status)`.

## Hipótesis
- H1: la autenticación es externa. `CustomerContext` es un stub configurable por variable de entorno y no implementa OIDC/JWT real.
- H2: las versiones objetivo son Angular 17+ y Quarkus 3.x con Java 17+. Si la toolchain no está, se marca como no verificado.
- H3: el saldo y el límite vienen de la propia tabla. No hay integración con un core de tarjetas (integración sin definir).
- H4: la moneda y los montos son ficticios y no hay paginación. Se asume que cada cliente tiene menos de 20 tarjetas.
- H5: el SQL PostgreSQL solo se revisa de forma estática y no se ejecuta en esta entrega.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Exposición de datos de tarjeta | D4 + logs sin PAN ni datos del cliente |
| IDOR | D6 + pruebas unitarias del caso "tarjeta ajena → 404" |
| Toolchain ausente (Maven/Node) | Validar sintaxis por archivo y declarar "no verificado" en el handoff |
| Diferencias de versión Angular/Quarkus | Fijar versiones en `package.json` y `pom.xml` y documentarlas en el README |
| Dev Services de Quarkus requieren Docker | Pruebas unitarias con mocks; datasource por variables de entorno |

## Aceptación (complemento, sin contradecir la base)
- Las pruebas cubren: listado filtrado por cliente, detalle inexistente o ajeno → 404, y enmascarado en DTO y UI.
- El README documenta build y ejecución, variables de entorno, la integración pendiente y las migraciones, y lista lo no verificado.
