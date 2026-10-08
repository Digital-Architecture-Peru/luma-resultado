# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + .NET (capa Full Stack) para "Consulta" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + .NET y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN – Refinamiento (Consulta de Tarjetas · Angular + .NET · PostgreSQL)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | API .NET 8 de solo lectura (`GET`), separada en capas Api / Application / Domain / Infrastructure | La capacidad es una consulta. Las capas aíslan la integración "sin definir" detrás de interfaces. |
| D2 | Endpoints `GET /api/v1/cards` y `GET /api/v1/cards/{cardId}`, con movimientos opcionales en `GET /api/v1/cards/{cardId}/movements?page&size` | Cubren la lista, el detalle y los movimientos. La versión va en la ruta y la paginación evita respuestas grandes. |
| D3 | El cliente se identifica por un claim del contexto y nunca por un parámetro de la URL | Previene IDOR: un cliente no puede consultar tarjetas de otro. |
| D4 | El PAN solo se expone enmascarado (`**** 1234`) y en BD se guarda solo `last4` | Minimiza el alcance PCI. Los datos son ficticios. |
| D5 | Persistencia con Npgsql y SQL parametrizado tras `ICardQueryRepository`; migraciones SQL versionadas (`V001__`, `V002__`) | Da control explícito del SQL de lectura, evita inyección y permite usar un fake en memoria en las pruebas. |
| D6 | Montos en `numeric(18,2)` / `decimal`, fechas en UTC (`timestamptz`) y moneda ISO-4217 | Evita errores de redondeo y de zona horaria. |
| D7 | Angular con componentes standalone organizados por Atomic Design | Cumple el patrón pedido y facilita el reúso y las pruebas unitarias por nivel. |
| D8 | Configuración por variables de entorno (`ConnectionStrings__Cards`, `API_BASE_URL`) | Evita secretos en el repositorio. |

## Estructura de módulos
```
backend/
  Cards.sln
  src/Cards.Api/            Program.cs, Endpoints/CardsEndpoints.cs, CurrentCustomer.cs
  src/Cards.Application/    ICardQueryRepository.cs, CardQueryService.cs, Dtos/
  src/Cards.Domain/         Card.cs, CardMovement.cs, CardStatus.cs
  src/Cards.Infrastructure/ NpgsqlCardQueryRepository.cs
  tests/Cards.UnitTests/    CardQueryServiceTests.cs, MaskingTests.cs (xUnit + fake repo)
db/migrations/              V001__schema.sql, V002__indexes.sql, V003__seed_ficticio.sql
frontend/src/app/
  atoms/        badge-status, money, masked-pan
  molecules/    card-summary-item, movement-row
  organisms/    card-list, card-detail-panel, movement-table
  templates/    cards-layout
  pages/        cards-page, card-detail-page
  core/         cards-api.service.ts, models.ts
  *.spec.ts junto a cada componente y servicio
README.md
```

## Modelo de datos (resumen)
- **`cards`**: `id uuid PK`, `customer_id uuid`, `last4 char(4)`, `brand`, `product`, `status`, `credit_limit`, `available`, `currency char(3)`, `expiry_month`, `expiry_year`.
- **`card_movements`**: `id`, `card_id FK`, `posted_at timestamptz`, `description`, `amount`, `currency`.
- **Índices**: `cards(customer_id)` y `card_movements(card_id, posted_at DESC)`.

## Hipótesis
- H1: La autenticación ya la provee Banca por Internet. En desarrollo se usa el stub `X-Demo-Customer-Id`, que se desactiva fuera de `Development`.
- H2: Los movimientos están dentro del alcance como consulta paginada. Si no aplican, se retiran sin afectar el resto.
- H3: Las pruebas unitarias del frontend usan Jasmine/Karma (configuración por defecto de Angular). Requieren un navegador headless que puede no estar disponible localmente.
- H4: Las versiones objetivo son .NET 8 LTS y Angular 17 o superior. No hay confirmación desde SGC (estado fallback).
- H5: La integración con el core de tarjetas queda sin definir. Solo existe la interfaz y la implementación PostgreSQL de ejemplo.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sin toolchain (`dotnet`/`npm`) no se compila ni se prueba | Marcar como no verificado en el handoff y entregar solo un candidate |
| El SQL de PostgreSQL no se ejecuta (solo revisión estática) | Usar SQL estándar, revisarlo y no afirmar que fue ejecutado |
| Exposición de datos sensibles | Aplicar D3 y D4 y no registrar en logs datos de tarjeta |
| CORS o URL del API mal configuradas | Leer `API_BASE_URL` del entorno y documentarlo en el README |

## Trazabilidad con la aceptación
- La sintaxis se valida sobre los archivos verificables.
- Los `*.spec.ts` y `Cards.UnitTests` cubren la existencia de pruebas.
- El README documenta build, ejecución, integración (sin definir) y persistencia (PostgreSQL).
- No se afirma compilación ni paso a producción.
