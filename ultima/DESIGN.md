# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Spring Boot
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Spring Boot (capa Full Stack) para "Consulta" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + Java + Spring Boot y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN — Refinamiento

## Alcance (hipótesis)
- **H1**: la consulta es de solo lectura y cubre **listado de cuentas del cliente** y **detalle con saldo**. Movimientos, transferencias y bloqueos quedan fuera.
- **H2**: la autenticación queda fuera de alcance. La identidad del cliente se simula con el header `X-Customer-Id`; en producción vendría del token.
- **H3**: SGC está en *fallback*, así que no se aplican estándares corporativos (naming, librería UI, observabilidad).

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (Vite + React 18 + TS) y `backend/` (Spring Boot 3, Java 17, Maven) | Un solo entregable con build independiente por capa |
| D2 | Backend en capas: `api` → `service` → puerto `AccountRepository` → adaptador JDBC | Persistencia detrás de una interfaz y servicio testeable con mocks |
| D3 | `NamedParameterJdbcTemplate` con SQL explícito | Acceso parametrizado (sin concatenar SQL), lectura simple y sin ORM |
| D4 | Flyway: `V1__schema.sql` y `V2__seed_ficticio.sql`. Índice en `account(customer_id)` | Migraciones versionadas y búsqueda por cliente eficiente |
| D5 | API `GET /api/v1/accounts` y `GET /api/v1/accounts/{id}`. Errores como `ProblemDetail` (RFC 7807) | Contrato versionado y errores uniformes |
| D6 | El DTO enmascara el número de cuenta (`****1234`) y envía el saldo como string decimal | Protege datos sensibles y evita la pérdida de precisión de `float` |
| D7 | `{id}` se filtra también por `customer_id`. Si no coincide, responde 404 | Mitiga el acceso a cuentas ajenas (IDOR) |
| D8 | Frontend en Atomic Design con un hook `useAccounts` y `accountsApi.ts` (fetch, `VITE_API_BASE_URL`) | Separa la UI de los datos; los componentes son puros y testeables |
| D9 | Configuración por entorno: `DB_URL`, `DB_USER`, `DB_PASSWORD`, sin valores por defecto sensibles | Sin secretos en el repositorio |
| D10 | Pruebas unitarias: JUnit 5 + Mockito (servicio y MockMvc *standalone*); Vitest + Testing Library (átomos, organismos, formateo) | No requieren BD ni servidor levantado |

## Estructura de módulos
```
backend/
  pom.xml
  src/main/java/.../accounts/
    api/        AccountController, AccountDto, ErrorHandler
    service/    AccountService
    domain/     Account, AccountStatus
    persistence/AccountRepository, JdbcAccountRepository
  src/main/resources/application.yml
  src/main/resources/db/migration/V1__schema.sql, V2__seed_ficticio.sql
  src/test/java/.../AccountServiceTest, AccountControllerTest
frontend/
  package.json, vite.config.ts, tsconfig.json
  src/components/atoms/      Amount, Badge, Spinner
  src/components/molecules/  AccountSummary, StatusMessage
  src/components/organisms/  AccountList, AccountDetail
  src/components/templates/  AccountsTemplate
  src/pages/                 AccountsPage
  src/services/accountsApi.ts
  src/hooks/useAccounts.ts
  src/**/*.test.tsx
README.md
```

## Riesgos
- **R1**: sin toolchain local (Maven/npm), la compilación y las pruebas quedan **no verificadas**.
- **R2**: el esquema PostgreSQL solo tiene revisión estática. Tipos como `NUMERIC(18,2)` o `TIMESTAMPTZ` no se ejecutan.
- **R3**: la identidad simulada no es segura y no sirve para producción.
- **R4**: CORS entre `localhost:5173` y `:8080` debe configurarse solo para desarrollo.
- **R5**: el formateo de moneda depende del locale (hipótesis: `es-PE`/PEN, configurable).
- **R6**: no hay estándares SGC, por lo que puede requerirse retrabajo al integrarlos.

## Trazabilidad con la aceptación
- La sintaxis se verifica con el validador local disponible.
- Las pruebas de D10 cumplen "pruebas presentes".
- El README cubre build, ejecución, persistencia e integración "sin definir".
- El resultado es *candidate*: no se afirma compilación ni preparación para producción.
