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

# DESIGN — Refinamiento

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `/backend` (Spring Boot 3, Java 17, Maven) y `/frontend` (Angular, componentes standalone) | Permite build y pruebas independientes; Maven es la opción más común en banca (H2) |
| D2 | Capacidad solo lectura: `GET /api/v1/cards` y `GET /api/v1/cards/{cardId}` | El tipo de capacidad es "Consulta" y no requiere escrituras |
| D3 | Errores con `ProblemDetail` (RFC 7807): 404 si la tarjeta no existe o no pertenece al cliente | Es nativo en Spring Boot 3. Responder 404 también en el caso ajeno evita revelar tarjetas de otros clientes |
| D4 | Persistencia con `NamedParameterJdbcTemplate` detrás de `CardRepository` | El acceso parametrizado queda explícito, hay menos dependencias que con JPA y es suficiente para lectura |
| D5 | Migraciones Flyway: `V1__schema.sql` y `V2__seed_ficticio.sql` | Cumple T04-db con un esquema versionado y reproducible |
| D6 | Solo se almacenan `pan_last4` y el número enmascarado. Nunca el PAN completo, el CVV ni la fecha completa | Minimiza el alcance PCI-DSS y aplica el principio de mínimo dato |
| D7 | Interfaz `CurrentCustomerProvider` con implementación stub configurable | La integración está sin definir. Así se aísla la futura autenticación sin acoplar el código |
| D8 | Importes en `BigDecimal` / `NUMERIC(15,2)` con moneda ISO 4217 | Evita errores de redondeo |
| D9 | Configuración por variables de entorno (`DB_URL`, `DB_USER`, `DB_PASSWORD`) sin valores por defecto sensibles | No se versionan secretos |

## Estructura de módulos
```
backend/src/main/java/.../cards/
  api/        CardController, CardSummaryDto, CardDetailDto, ApiExceptionHandler
  domain/     Card, CardStatus, CardNotFoundException
  service/    CardQueryService
  persistence/CardRepository, JdbcCardRepository
  security/   CurrentCustomerProvider, StubCustomerProvider
backend/src/main/resources/db/migration/ V1__schema.sql, V2__seed_ficticio.sql
backend/src/test/java/...  CardQueryServiceTest (Mockito), CardControllerTest (@WebMvcTest)

frontend/src/app/cards/
  atoms/      status-badge, masked-pan, amount, brand-icon
  molecules/  card-summary-item, balance-row
  organisms/  card-list, card-detail-panel
  templates/  cards-layout
  pages/      cards-page, card-detail-page
  data/       card.model.ts, cards-api.service.ts (+ .spec con HttpTestingController)
```

## Modelo de datos
- Tabla `card` con estas columnas:
  - Identificación: `id UUID PK`, `customer_id VARCHAR NOT NULL`, `pan_last4 CHAR(4)`, `masked_pan`.
  - Clasificación: `brand`, `card_type` (CHECK CREDIT/DEBIT), `status` (CHECK ACTIVE/BLOCKED/CANCELLED).
  - Importes: `credit_limit`, `available_balance`, `currency CHAR(3)`.
  - Auditoría: `created_at`.
- Índice `idx_card_customer (customer_id)`.

## Hipótesis
- H1: "Consulta" cubre el listado y el detalle de las tarjetas del cliente. Movimientos y extractos quedan fuera de alcance.
- H2: Se usan Maven, Java 17 y Angular 17 o superior con el runner de pruebas por defecto del CLI (Jasmine/Karma).
- H3: La autenticación real de Banca por Internet se integra más adelante. El stub devuelve un cliente ficticio fijo.
- H4: El SGC está en modo fallback. No hay restricciones corporativas confirmadas sobre nombres, versiones ni librerías UI.
- H5: El esquema PostgreSQL solo recibe revisión estática, sin ejecución.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| IDOR: un cliente consulta tarjetas ajenas | Filtrar siempre por `customer_id` en el SQL y aplicar D3 |
| Exposición de datos de tarjeta | Aplicar D6 y no registrar en logs los DTO completos |
| Toolchain ausente (mvn/npm) | Marcar el código como "no verificado" en el handoff (T06) |
| SQL específico de PostgreSQL no ejecutado | Usar SQL estándar con CHECK simples y documentarlo en el README |
| Desfase de versión de Angular | Fijar versiones en `package.json` e indicar en el README cómo comprobarlas |
| CORS entre front y back en local | Configurar un proxy de Angular (`proxy.conf.json`) en lugar de abrir CORS |

## Aceptación complementaria (sin modificar la base)
- El SQL de repositorio no contiene concatenación de strings; todo va por parámetros nombrados.
- Hay al menos una prueba unitaria por cada capa backend (service y controller) y para un átomo, un organismo y el servicio API del frontend.
- Ningún archivo contiene PAN completo, CVV ni credenciales.
- El README incluye build, ejecución, variables de entorno, migraciones y lo que queda no verificado.
