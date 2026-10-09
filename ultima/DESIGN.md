# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + .NET (capa Full Stack) para "Consulta" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + .NET y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento: Consulta de Cuentas en Banca por Internet

## Decisiones de arquitectura

| # | Decisión | Justificación |
|---|---|---|
| D1 | Solo lectura: `GET /api/v1/cuentas` y `GET /api/v1/cuentas/{id}` | La capacidad es "Consulta"; sin escrituras se reduce la superficie de riesgo |
| D2 | Backend .NET 8 en capas Api → Application → Infrastructure | Los casos de uso se prueban con un repositorio falso, alineado con pruebas unitarias |
| D3 | Npgsql + Dapper con SQL parametrizado (`@clienteId`) | Control explícito del SQL, sin inyección y coherente con migraciones SQL versionadas (T04-db) |
| D4 | Migraciones como SQL plano `V00N__*.sql` | Revisables de forma estática sin toolchain; portables a Flyway o DbUp |
| D5 | Frontend React + Vite + TS con Atomic Design; cliente `fetch` tipado y sin librería de estado | Es el patrón pedido; el alcance pequeño no justifica Redux |
| D6 | Errores con ProblemDetails (RFC 7807) | Es el formato estándar en .NET y se consume de forma uniforme en el front |
| D7 | Configuración por variables de entorno (`CUENTAS_DB_CONNECTION`, `VITE_API_BASE_URL`) | No hay secretos en el repositorio |
| D8 | Número de cuenta enmascarado en el DTO (`****1234`) | Minimiza la exposición de datos sensibles |

## Estructura de módulos
```
backend/
  src/Cuentas.Api/            Program.cs, Endpoints/CuentasEndpoints.cs
  src/Cuentas.Application/    Dtos/, ICuentaRepository.cs, ConsultarCuentasService.cs
  src/Cuentas.Infrastructure/ PgCuentaRepository.cs
  tests/Cuentas.UnitTests/    xUnit: servicio + enmascarado
  Cuentas.sln
db/migrations/
  V001__crear_cuentas.sql     tabla cuentas, numeric(18,2), CHECK moneda, índice (cliente_id)
  V002__datos_ficticios.sql
frontend/
  src/components/atoms/       Amount, Badge, Spinner
  src/components/molecules/   AccountRow, ErrorMessage
  src/components/organisms/   AccountList, AccountDetail
  src/components/templates/   BankingLayout
  src/pages/                  CuentasPage
  src/services/cuentasApi.ts, src/types/cuenta.ts
  tests: Vitest + Testing Library (*.test.tsx)
  package.json, vite.config.ts, tsconfig.json
README.md
```

## Modelo de datos (resumen)
Tabla `cuentas`:
- `id uuid PK`
- `cliente_id uuid NOT NULL`
- `numero varchar(20) UNIQUE`
- `tipo` ∈ {AHORROS, CORRIENTE}
- `moneda char(3)`
- `saldo numeric(18,2)`
- `estado` ∈ {ACTIVA, BLOQUEADA}
- `actualizado_en timestamptz`

Índice: `ix_cuentas_cliente_id`.

## Hipótesis (no confirmadas)
- H1: El alcance cubre listado y detalle con saldo; los movimientos quedan fuera.
- H2: No hay autenticación definida. El cliente se simula con el header `X-Cliente-Id` y datos ficticios. Debe reemplazarse por el IdP del banco.
- H3: La integración queda sin definir. Solo se usa PostgreSQL detrás de `ICuentaRepository`.
- H4: Las versiones objetivo son .NET 8 LTS y Node 20.
- H5: El saldo se serializa como número con 2 decimales y el front solo lo formatea con `Intl.NumberFormat`.
- H6: No hay paginación; se asumen pocas cuentas por cliente.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sin toolchain .NET/npm, la compilación no se verifica | Marcar "no verificado" en el handoff |
| El SQL de PostgreSQL solo se revisa de forma estática | Usar sintaxis estándar y evitar extensiones |
| La autenticación simulada se confunde con seguridad real | Advertencia explícita en README y en el código |
| Pérdida de precisión decimal en JS | Sin aritmética en el front; evaluar el saldo como string si se requiere |
| Fuga de datos sensibles en logs | No registrar número ni saldo; enmascarar en el DTO |

## Criterios verificables complementarios (sin alterar los base)
- El servicio devuelve solo las cuentas del `clienteId` solicitado (prueba unitaria con un repositorio falso).
- `GET /cuentas/{id}` de otro cliente o inexistente responde 404 con ProblemDetails.
- `AccountList` muestra el número enmascarado y el estado vacío o de error (prueba con Vitest).
- Todas las consultas SQL usan parámetros; no hay concatenación de cadenas.
