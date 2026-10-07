# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Spring Boot
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Spring Boot (capa Full Stack) para "Consulta" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + Java + Spring Boot y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN (refinamiento)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (Vite + React + TS) y `backend/` (Spring Boot 3, Java 17, Maven) | Builds independientes y validación por toolchain |
| D2 | API REST de solo lectura: `GET /api/v1/cards` (lista del cliente) y `GET /api/v1/cards/{cardId}` (detalle) | La capacidad es "Consulta", así que no expone escritura |
| D3 | Backend en capas `controller → service → port (CardRepository) → adapter JDBC` | Deja la persistencia detrás de una interfaz y aísla la integración no definida |
| D4 | Acceso a datos con `NamedParameterJdbcTemplate` y SQL parametrizado | Evita inyección SQL y no requiere un ORM para lecturas simples |
| D5 | Migraciones Flyway: `V1__schema.sql` (tablas e índices) y `V2__seed.sql` (datos ficticios) | Esquema versionado y reproducible |
| D6 | No se persiste el PAN, solo `last4` y un alias. El DTO devuelve `**** **** **** 1234` | Minimiza la exposición de datos sensibles (enfoque PCI) |
| D7 | Front en Atomic Design con un hook `useCards` y un cliente `cardsApi.ts` basado en `fetch` | Separa la UI de los datos y facilita probar cada parte |
| D8 | Configuración por variables de entorno (`DB_URL`, `DB_USER`, `DB_PASSWORD`, `VITE_API_BASE_URL`) | No incluye secretos en el repositorio |
| D9 | Errores con formato `ProblemDetail` (RFC 7807): 404 si la tarjeta no existe o no pertenece al cliente | Contrato de error estándar que no filtra existencia de recursos |

## Estructura de módulos
```
backend/  pom.xml
  src/main/java/com/bank/cards/
    api/        CardController, dto/CardSummaryDto, CardDetailDto
    service/    CardQueryService
    domain/     Card, CardStatus, CardType
    port/       CardRepository
    adapter/    JdbcCardRepository
  src/main/resources/application.yml, db/migration/V1__,V2__
  src/test/java/.../CardQueryServiceTest, CardControllerTest
frontend/ package.json, vite.config.ts
  src/components/atoms/     MaskedPan, StatusBadge, Amount
  src/components/molecules/ CardSummaryItem
  src/components/organisms/ CardList, CardDetailPanel
  src/components/templates/ CardsLayout
  src/pages/                CardsPage
  src/api/cardsApi.ts  src/hooks/useCards.ts  src/types/card.ts
  src/**/*.test.tsx (Vitest + Testing Library)
README.md
```

## Modelo de datos (PostgreSQL)
- `card`:
  - `id UUID PK`, `customer_id VARCHAR(36) NOT NULL`, `alias`, `last4 CHAR(4)`.
  - `type` ∈ {CREDIT, DEBIT}, `status` ∈ {ACTIVE, BLOCKED, EXPIRED}, con `CHECK`.
  - `credit_limit NUMERIC(15,2)`, `available_balance NUMERIC(15,2)`, `currency CHAR(3)`, `expiry_date DATE`, `created_at TIMESTAMPTZ`.
- Índice: `idx_card_customer_id (customer_id)`.

## Hipótesis
- H1: no hay autenticación definida. El cliente se identifica con el header ficticio `X-Customer-Id`. En producción se reemplazaría por el token de sesión de Banca por Internet.
- H2: la integración con el core de tarjetas está sin definir. Se usa PostgreSQL local como fuente y el puerto `CardRepository` permite cambiar el adaptador después.
- H3: los montos en front se formatean con `Intl.NumberFormat`. La moneda viene en el DTO.
- H4: no se pagina la lista porque se asume que cada cliente tiene menos de 20 tarjetas.
- H5: las pruebas unitarias son las siguientes:
  - Backend: servicio con Mockito y controlador con `@WebMvcTest`.
  - Frontend: átomos, organismos y hook.
  - No hay pruebas de integración contra la base de datos.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| El esquema PostgreSQL solo se revisa de forma estática | Usar SQL ANSI y evitar extensiones; queda marcado como no verificado |
| Sin JDK/Maven o Node locales no se compila | El resumen indica qué toolchain faltó |
| `X-Customer-Id` es falsificable | Queda documentado como hipótesis H1, fuera de alcance |
| Exposición de datos de tarjeta | Enmascarar en el backend; el front nunca recibe el PAN |
| CORS entre front y back | Configurar `allowedOrigins` por variable de entorno |

## Aceptación (complemento, sin cambiar la base)
- Los endpoints devuelven solo tarjetas del `X-Customer-Id`. Una tarjeta ajena responde 404.
- Ninguna respuesta contiene más de 4 dígitos del número de tarjeta.
- Cada nivel de Atomic Design tiene al menos un archivo de prueba.
