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

# DESIGN (refinamiento)

> Complementa la plantilla base sin reemplazarla. Sus criterios de aceptación no cambian: sintaxis verificable, pruebas y README presentes, publicación con commit.

## Alcance funcional (hipótesis H1)
Consulta de solo lectura de tarjetas del cliente autenticado en Banca por Internet:
- **Listado:** alias, PAN enmascarado, tipo, marca y estado.
- **Detalle:** límite, disponible, moneda, fecha de corte y vencimiento MM/AA.
- No hay operaciones de escritura, bloqueo ni movimientos.

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `backend/` (Maven) y `frontend/` (npm) | Cada capa conserva su toolchain y su verificación es independiente. |
| D2 | Quarkus en capas resource → service → port → adapter (hexagonal ligero) | La persistencia queda detrás de la interfaz `CardRepository`, como pide el diseño base. El service se prueba sin base de datos. |
| D3 | REST de solo lectura: `GET /api/v1/cards` y `GET /api/v1/cards/{cardId}` | La capacidad es una consulta. El versionado en la ruta permite evolucionar el contrato. |
| D4 | Si la tarjeta no pertenece al cliente se responde 404, no 403. Errores en `application/problem+json` | Evita enumerar tarjetas ajenas (IDOR) y da un formato de error uniforme. |
| D5 | Sin PAN completo: se persisten `pan_last4` y un `card_token` ficticio. El enmascarado se hace en el backend | Minimiza datos sensibles (alineado con PCI-DSS). El frontend nunca recibe el PAN. |
| D6 | Hibernate ORM con Panache en patrón *repository* y consultas con parámetros nombrados | Cumple el acceso parametrizado y evita entidades *active record* difíciles de simular en pruebas. |
| D7 | Migraciones Flyway: `V1__schema.sql` y `V2__seed_ficticio.sql` | Esquema versionado. Los datos de ejemplo quedan separados y son fáciles de excluir en otros entornos. |
| D8 | Montos en `NUMERIC(15,2)` / `BigDecimal` con moneda ISO-4217 | Evita errores de precisión con importes. |
| D9 | Angular con componentes *standalone* organizados en Atomic Design y `HttpClient` en un servicio de dominio | Aplica el patrón pedido. Los átomos son puros y fáciles de probar. |
| D10 | Configuración por variables de entorno (`QUARKUS_DATASOURCE_*`, `apiBaseUrl` por `environment`) | No hay secretos en el repositorio. |

## Modelo de datos (PostgreSQL)
Tabla `card`:
- `id UUID PK`
- `customer_id VARCHAR(36) NOT NULL`
- `card_token`
- `pan_last4 CHAR(4)`
- `brand`
- `type CHECK (CREDIT, DEBIT)`
- `status CHECK (ACTIVE, BLOCKED, EXPIRED)`
- `alias`
- `credit_limit`, `available_balance`
- `currency CHAR(3)`
- `expiry_month`, `expiry_year`
- `cutoff_day`
- `created_at`

Índices:
- `idx_card_customer (customer_id)`
- `uq_card_token (card_token)`

## Estructura de módulos
```
backend/  pom.xml
  src/main/java/.../cards/
    api/        CardResource, CardSummaryDto, CardDetailDto, ProblemMapper
    domain/     Card, CardStatus, CardNotFoundException
    service/    CardQueryService
    port/       CardRepository
    adapter/    PanacheCardRepository, CardEntity
  src/main/resources/application.properties, db/migration/V1__,V2__
  src/test/java/.../CardQueryServiceTest, PanMaskerTest
frontend/  package.json, angular.json
  src/app/cards/
    atoms/      masked-pan, status-badge, amount
    molecules/  card-item, balance-summary
    organisms/  card-list, card-detail-panel
    templates/  cards-layout
    pages/      cards-page, card-detail-page
    data/       card.model.ts, card-api.service.ts
  *.spec.ts junto a átomos, servicio y páginas
README.md
```

## Pruebas unitarias
- **Backend:** JUnit 5 y Mockito sobre `CardQueryService` con el puerto simulado. Casos:
  - listado del cliente;
  - 404 si la tarjeta es ajena;
  - enmascarado del PAN.
- **Frontend:** Jasmine con `TestBed` y `HttpTestingController` (hipótesis H4). Casos:
  - `masked-pan`;
  - `status-badge`;
  - `card-api.service`.

## Hipótesis
- **H1:** El alcance se limita a listado y detalle. Los movimientos y acciones sobre la tarjeta quedan fuera.
- **H2:** La autenticación la resuelve un IdP o gateway, todavía no definido. En el candidato, `customerId` se obtiene de la cabecera `X-Customer-Id`, solo para el perfil dev.
- **H3:** Versiones objetivo: Quarkus 3.x, Java 17+ y Angular 17+.
- **H4:** Se usa el runner de pruebas por defecto de Angular CLI (Karma/Jasmine).
- **H5:** La integración sin definir se representa solo con el puerto `CardRepository`. No hay clientes HTTP externos.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| IDOR por la cabecera simulada de H2 | Restringir a perfil dev, aplicar D4 y documentar en el README que debe reemplazarse por un token OIDC. |
| No se pudo compilar ni probar por falta de toolchain (Maven, JDK o Node) | Marcar como no verificado en el handoff. El SQL de PostgreSQL solo se revisa de forma estática. |
| Dev Services de Quarkus requiere Docker | Documentar la alternativa con un datasource explícito por variables de entorno. |
| CORS entre front y back | Configurar `quarkus.http.cors` solo para el origen local en dev. |
| Desfase de versiones entre dependencias | Fijar versiones en `pom.xml` y `package.json`. |
