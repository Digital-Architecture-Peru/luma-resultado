# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Quarkus (capa Full Stack) para "Transacción" sobre Pagos en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + Java + Quarkus y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN (refinamiento)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (React + TS + Vite) y `backend/` (Quarkus + Maven) | Separa toolchains y permite compilar y probar cada capa por separado. |
| D2 | Backend en capas: `api` → `application` → `domain` ← `infrastructure` | El dominio queda sin dependencias de framework y se prueba con unitarias puras. |
| D3 | Puerto `PaymentRepository` (interfaz) con implementación JDBC/Panache sobre PostgreSQL | Cumple "persistencia detrás de interfaces" y permite usar mocks en las unitarias. |
| D4 | Migraciones versionadas con Flyway (`V1__schema.sql`, `V2__seed.sql`) | Esquema reproducible y auditable. Los datos semilla son ficticios. |
| D5 | Importes en `BigDecimal` / `NUMERIC(19,2)` y moneda ISO 4217 | Evita errores de redondeo de punto flotante en dinero. |
| D6 | Cabecera `Idempotency-Key` en `POST` con índice único | Evita pagos duplicados por doble envío. |
| D7 | Estados `PENDIENTE → CONFIRMADO / RECHAZADO` validados en el dominio | Las transiciones explícitas se pueden comprobar con unitarias. |
| D8 | Frontend con Atomic Design y un hook `usePayment` que aísla la llamada HTTP | Los componentes se prueban sin red. La URL base se toma de `VITE_API_URL`. |
| D9 | Configuración solo por variables de entorno (`DB_URL`, `DB_USER`, `DB_PASSWORD`) | No hay secretos en el repositorio. Se incluye `.env.example` con valores ficticios. |

## Contrato API (candidate)
- `POST /api/v1/payments`: recibe `{originAccount, beneficiary, amount, currency, concept}` y responde `201` con `{id, status}`. Errores posibles: `400` (validación) y `409` (idempotencia).
- `GET /api/v1/payments/{id}`: responde `200` o `404`.

## Estructura de módulos
```
frontend/
  src/components/{atoms,molecules,organisms,templates}/
  src/pages/PaymentPage.tsx
  src/hooks/usePayment.ts   src/api/paymentsClient.ts
  src/**/*.test.tsx         (Vitest + Testing Library)
  package.json  vite.config.ts  tsconfig.json
backend/
  src/main/java/.../payments/{api,application,domain,infrastructure}/
  src/main/resources/application.properties
  src/main/resources/db/migration/V1__schema.sql, V2__seed.sql
  src/test/java/.../ (JUnit 5 + Mockito, dominio y servicio)
  pom.xml
README.md
```

## Hipótesis
- H1: "Transacción" significa un pago desde una cuenta del cliente a un beneficiario o servicio. No incluye transferencias interbancarias reales.
- H2: La autenticación y la autorización quedan fuera de alcance. El cliente se simula con datos ficticios.
- H3: No hay integración definida. La confirmación del pago la simula un adaptador local (stub).
- H4: Las pruebas son solo unitarias. No se incluyen pruebas de integración ni e2e, ni Testcontainers.
- H5: Se usan Quarkus 3.x y Java 17+, y Node 18+. Las versiones exactas no están verificadas.
- H6: La validación de importe (> 0 y con límite máximo) y de moneda (lista cerrada, por ejemplo PEN/USD) es regla de dominio supuesta.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| No hay JDK, Maven o Node locales, así que no se compila | Se marca como no verificado en el handoff. Solo se revisa la sintaxis. |
| El SQL de PostgreSQL no se ejecuta en SQLite | Solo revisión estática, declarada como tal. |
| SGC en estado fallback: puede haber reglas corporativas ausentes | Las hipótesis quedan explícitas para validarlas con el negocio. |
| Doble envío o reintentos | D6 (idempotencia) y botón deshabilitado mientras la petición está en curso. |
| Se filtran datos sensibles en los logs | No se registran números de cuenta completos; se enmascaran. |

## Trazabilidad con la aceptación
- La sintaxis verificable corresponde a los archivos `.ts`, `.tsx`, `.java` y `.sql` de la estructura anterior.
- Las pruebas presentes son `*.test.tsx` y `*Test.java`.
- El README.md documenta build, ejecución, variables de entorno, integración pendiente y PostgreSQL con Flyway.
