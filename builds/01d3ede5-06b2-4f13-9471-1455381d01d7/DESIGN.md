# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + .NET (capa Full Stack) para "Consulta" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + .NET y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN — Refinamiento (Consulta de Cuentas · Banca por Internet)

## Estructura de módulos
```
frontend/ (Angular, standalone)
  src/app/accounts/
    atoms/      badge-estado, monto, numero-enmascarado
    molecules/  tarjeta-cuenta, fila-saldo
    organisms/  lista-cuentas, detalle-cuenta
    templates/  layout-consulta
    pages/      cuentas.page, cuenta-detalle.page
    data/       accounts.api.ts, account.model.ts
  *.spec.ts junto a cada pieza
backend/ (.NET)
  src/Accounts.Domain/          Account, Money, AccountStatus
  src/Accounts.Application/     IAccountRepository, consultas, DTOs
  src/Accounts.Infrastructure/  PgAccountRepository (Npgsql + Dapper)
  src/Accounts.Api/             GET /api/v1/accounts, GET /api/v1/accounts/{id}
  tests/Accounts.UnitTests/     xUnit
db/migrations/  V001__create_accounts.sql, V002__seed_ficticio.sql
README.md
```

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Capas Domain/Application/Infrastructure/Api | Aísla PostgreSQL detrás de `IAccountRepository`. Permite pruebas unitarias sin BD. |
| D2 | Dapper + SQL parametrizado (`@customerId`) | El SQL es explícito y coincide con las migraciones versionadas. Evita inyección. Es más liviano que EF Core para un caso de solo lectura. |
| D3 | API de solo lectura y paginada (`page`, `size`, máx. 50) | El tipo de capacidad es Consulta. No hay escrituras. |
| D4 | Enmascarar el número de cuenta en el DTO (`****1234`) | Minimiza la exposición de datos sensibles en el canal Internet. |
| D5 | Montos `numeric(18,2)` / `decimal` y moneda ISO 4217 | No hay pérdida de precisión. El formato se aplica solo en el átomo `monto`. |
| D6 | Angular con componentes standalone, `OnPush` y signals | Las piezas Atomic Design son reutilizables y presentacionales. Solo `pages` habla con `data/`. |
| D7 | Configuración por variables de entorno (`ACCOUNTS_DB_CONNECTION`, `API_BASE_URL`) | No hay secretos en el repo. El README trae valores de ejemplo ficticios. |

## Modelo de datos (PostgreSQL)
- Tabla `accounts`:
  - Columnas: `id uuid PK`, `customer_id uuid NOT NULL`, `account_number varchar(20) UNIQUE`, `product_type`, `currency char(3)`, `available_balance numeric(18,2)`, `ledger_balance numeric(18,2)`, `status`, `opened_at`, `updated_at`.
  - Restricciones: `CHECK (status IN ('ACTIVA','BLOQUEADA','CERRADA'))`.
  - Índices: `idx_accounts_customer (customer_id)` e `idx_accounts_customer_status (customer_id, status)`.
- Seed con clientes y cuentas ficticias. Ningún dato real.

## Pruebas unitarias
- **Backend (xUnit):** servicio de consulta con repositorio fake, enmascarado, paginación y respuesta 404 para cuenta ajena o inexistente.
- **Frontend (Jasmine/Karma o Jest):** átomos (formato de monto, enmascarado), organismo de lista con datos mock y servicio con `HttpTestingController`.

## Hipótesis
- **H1.** No hay contexto SGC (estado fallback). Los estándares corporativos de nomenclatura, seguridad y observabilidad no están confirmados.
- **H2.** La autenticación existe aguas arriba. El `customer_id` llega como claim. En el candidate se simula con un stub o encabezado de desarrollo, documentado como no apto para producción.
- **H3.** La integración con el core bancario está sin definir. PostgreSQL actúa como fuente de lectura de ejemplo.
- **H4.** Versiones objetivo: .NET 8 LTS y Angular 17+. Se asumen y no se confirmaron.
- **H5.** El alcance es solo cuentas propias del cliente. Movimientos y transferencias quedan fuera.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sin toolchain local (`dotnet`/`npm`), la compilación no se verifica | Marcar como no verificado en el handoff |
| El SQL de PostgreSQL solo admite revisión estática | SQL estándar sin extensiones; validar en un entorno con PostgreSQL |
| Acceso a cuentas de otro cliente (IDOR) | Filtrar siempre por `customer_id` en el SQL y responder 404 |
| Fuga de datos sensibles en logs | No registrar números completos ni saldos |
| Divergencia con estándares SGC | Revisión cuando SGC esté configurado |

## Trazabilidad con la aceptación
- Las fuentes, las pruebas y el README cubren los criterios base.
- La sintaxis se valida donde exista validador.
- El resultado es candidate: no se afirma compilación ni preparación para producción.
