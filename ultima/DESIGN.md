# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Quarkus (capa Full Stack) para "Consulta" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + Java + Quarkus y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento (Consulta de Cuentas · Banca por Internet)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/`, `backend/` y `db/` | Separa las capas Full Stack y permite builds independientes (npm / Maven). |
| D2 | API REST de solo lectura: `GET /api/v1/accounts` y `GET /api/v1/accounts/{id}` | La capacidad es de tipo Consulta. No se exponen escrituras. |
| D3 | Capas en Quarkus: Resource → QueryService → `AccountRepository` (interfaz) → impl JDBC parametrizada | La persistencia queda detrás de una interfaz. Las pruebas unitarias usan un mock y no necesitan base de datos. |
| D4 | Montos como `NUMERIC(18,2)` en la base, `BigDecimal` en Java y `string` en JSON | Evita errores de redondeo de punto flotante. |
| D5 | Número de cuenta enmascarado en el DTO (`****1234`) | Minimiza la exposición de datos sensibles en el canal. |
| D6 | Migraciones versionadas con Flyway (`V1__schema.sql`, `V2__seed.sql`) | Esquema reproducible y auditable. |
| D7 | Atomic Design en React con un cliente HTTP aislado (`api/accountsClient.ts`) | Componentes puros y testeables. Los datos se inyectan por props. |
| D8 | Configuración por variables de entorno (`QUARKUS_DATASOURCE_*`, `VITE_API_BASE_URL`) | No hay secretos en el repositorio. |

## Estructura de módulos
```
frontend/ (Vite + React + TS, Vitest + Testing Library)
  src/domain/account.ts
  src/api/accountsClient.ts
  src/components/atoms/      MoneyText, StatusBadge
  src/components/molecules/  AccountRow, AccountFilter
  src/components/organisms/  AccountList, AccountDetail
  src/components/templates/  AccountsLayout
  src/pages/AccountsPage.tsx
  src/**/*.test.tsx
backend/ (Quarkus, JUnit 5 + Mockito)
  pom.xml
  src/main/java/.../accounts/
    api/AccountResource.java, api/dto/AccountDto.java
    service/AccountQueryService.java
    domain/Account.java
    persistence/AccountRepository.java, JdbcAccountRepository.java
  src/main/resources/application.properties
  src/main/resources/db/migration/V1__schema.sql, V2__seed.sql
  src/test/java/.../AccountQueryServiceTest.java, AccountMaskerTest.java
README.md
```

## Modelo de datos (PostgreSQL)
- Tabla `account` con estas columnas: `id UUID PK`, `customer_id VARCHAR(36) NOT NULL`, `account_number VARCHAR(20) UNIQUE`, `type VARCHAR(20)`, `currency CHAR(3)`, `balance NUMERIC(18,2)`, `status VARCHAR(12)` y `updated_at TIMESTAMPTZ`.
- Restricciones `CHECK` sobre `currency`, `type` y `status`.
- Índice `idx_account_customer (customer_id)`.
- Seed de 5 a 8 cuentas ficticias.
- Todas las consultas usan `PreparedStatement` con parámetros. Nunca se concatenan valores en el SQL.

## Hipótesis
- **H1:** La autenticación la resuelve un gateway externo. El backend recibe `X-Customer-Id` como marcador provisional (placeholder) y filtra las cuentas por ese cliente.
- **H2:** Versiones objetivo: Java 17+, Quarkus 3.x y Node 18+.
- **H3:** Las monedas son PEN y USD. Los datos son ficticios.
- **H4:** La integración con el core bancario está sin definir. No hay llamadas a sistemas reales, solo la interfaz `AccountRepository`.
- **H5:** La paginación es simple (`page`, `size`, con un máximo de 50).

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sin `mvn` o `npm` instalados, no se verifica compilación ni pruebas | Se marca como *no verificado* en el handoff. |
| El esquema de PostgreSQL solo admite revisión estática | SQL estándar sin extensiones. Se valida en un entorno con PostgreSQL. |
| H1 sin confirmar (riesgo de acceso a cuentas ajenas) | El filtro por `customer_id` es obligatorio en el repositorio. Se documenta en el README. |
| Fuga de PII en logs | No se registran el número de cuenta ni el saldo. |

## Trazabilidad de aceptación
- Fuentes de ambas capas, pruebas unitarias (Vitest y JUnit), migraciones SQL y README presentes.
- Sintaxis verificada donde exista validador local.
- El resumen candidate no afirma compilación ni producción.
