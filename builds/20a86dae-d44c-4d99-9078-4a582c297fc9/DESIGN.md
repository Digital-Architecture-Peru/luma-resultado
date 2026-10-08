# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + Java + Spring Boot
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + Java + Spring Boot (capa Full Stack) para "Consulta" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + Java + Spring Boot y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN — Refinamiento (Consulta de Tarjetas · Banca por Internet)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (Angular) y `backend/` (Spring Boot) | Cubre la capa Full Stack con un build independiente por capa |
| D2 | API REST de solo lectura: `GET /api/v1/cards` y `GET /api/v1/cards/{cardId}` | La capacidad es Consulta; sin escrituras no hay riesgo de mutación |
| D3 | El cliente se toma de `CustomerContextProvider`, no de la URL | Evita IDOR; el stub de desarrollo lee `X-Customer-Id` (ficticio) |
| D4 | Solo se persiste el PAN enmascarado (`pan_last4`); nunca PAN completo ni CVV | Minimización de datos sensibles (criterio PCI) |
| D5 | Flyway (`V1__schema.sql`, `V2__seed.sql`) + Spring Data JPA con consultas parametrizadas | Migraciones versionadas y sin SQL concatenado |
| D6 | DTO (`CardSummaryDto`, `CardDetailDto`) separado de la entidad | El contrato no expone el modelo interno |
| D7 | Errores en `ProblemDetail` (RFC 7807): 404 si no existe o es ajena, 400 si el id no es válido | Contrato uniforme; un 404 no revela tarjetas de otros clientes |
| D8 | Angular con standalone components y Atomic Design | Sigue el patrón pedido y permite probar cada componente de forma aislada |

## Estructura de módulos
```
backend/  pom.xml
  src/main/java/.../cards/
    api/        CardController, dto/, GlobalExceptionHandler
    domain/     Card, CardStatus, CardType
    service/    CardQueryService
    persistence/CardRepository (JPA)
    security/   CustomerContextProvider, HeaderCustomerContextProvider
  src/main/resources/ application.yml (con ${DB_URL} y ${DB_USER}), db/migration/
  src/test/java/... CardQueryServiceTest, CardControllerTest
frontend/ package.json, angular.json
  src/app/cards/
    atoms/      masked-pan, status-badge, amount
    molecules/  card-summary-item
    organisms/  card-list, card-detail-panel
    templates/  cards-layout
    pages/      cards-page
    data/       cards-api.service.ts, card.model.ts
  src/environments/ apiBaseUrl
README.md
```

## Modelo de datos (PostgreSQL)
Tabla `card` con estas columnas:
- `id` UUID, clave primaria.
- `customer_id` VARCHAR, con índice.
- `pan_last4` CHAR(4).
- `type`, con CHECK `CREDIT`/`DEBIT`.
- `status`, con CHECK `ACTIVE`/`BLOCKED`/`EXPIRED`.
- `credit_limit` y `available_balance` NUMERIC(15,2).
- `currency` CHAR(3).
- `expiry_month` y `expiry_year`.
- `created_at` TIMESTAMPTZ.

Índice compuesto `(customer_id, status)`. La semilla usa solo datos ficticios.

## Pruebas unitarias
- **Backend:** JUnit 5 + Mockito para `CardQueryService`. MockMvc *standalone* para `CardController`, que cubre 200, 404 y que el PAN sale enmascarado.
- **Frontend:** Jasmine (por defecto en Angular CLI) para atoms, molecules y `CardsApiService` con `HttpTestingController`.

## Hipótesis
- H1: Java 17, Spring Boot 3.x y Angular 17+.
- H2: La autenticación real (OAuth2/JWT del canal) no está definida. El header stub solo vale para desarrollo.
- H3: Un cliente tiene pocas tarjetas, así que no se pagina en v1.
- H4: No hay integración con core de tarjetas. PostgreSQL es la fuente de la consulta.
- H5: Sin SGC configurado (fallback), no se aplican estándares corporativos específicos.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| El SQL de PostgreSQL no se puede ejecutar en SQLite | Solo revisión estática, declarada en el handoff |
| Falta la toolchain (Maven o npm) | Se marca como no verificado y no se afirma la compilación |
| El stub de identidad llega a producción | Perfil `dev` obligatorio y advertencia en el README |
| CORS entre front y back | Origen configurable por variable de entorno |
| Se filtran datos sensibles en logs | No se registran DTO completos ni `customer_id` en claro |

## Trazabilidad con los todos
- T02 → D1–D8.
- T04-tests → sección de pruebas unitarias.
- T04-db → D5 y el modelo de datos.
- T05 → README documenta las variables de entorno, la integración sin definir y Flyway.
- T06 → se informa lo verificado y lo no verificado, sin afirmar compilación ni producción.
