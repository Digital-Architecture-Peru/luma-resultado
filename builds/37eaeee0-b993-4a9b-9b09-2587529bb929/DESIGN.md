# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + .NET (capa Full Stack) para "Transacción" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + .NET y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN — Refinamiento

## Decisiones de arquitectura

| # | Decisión | Justificación |
|---|---|---|
| D1 | Alcance: **transferencia entre cuentas propias, misma moneda** (H1) | Es la transacción mínima verificable sobre Cuentas. |
| D2 | .NET en capas **Domain / Application / Infrastructure / Api** con puertos (`ICuentaRepository`, `IUnitOfWork`) | Persistencia detrás de interfaces. Las pruebas unitarias no requieren BD. |
| D3 | **Npgsql + Dapper**, SQL parametrizado, sin ORM | Pocas dependencias y SQL explícito, revisable de forma estática. |
| D4 | Una transacción de BD con `SELECT ... FOR UPDATE` en orden ascendente de `id` | Evita el doble débito y los interbloqueos. |
| D5 | Cabecera **`Idempotency-Key`** con índice único | Evita duplicados por reintentos del cliente. |
| D6 | Montos `decimal` (C#) y `numeric(18,2)` (SQL) | Sin errores de punto flotante en dinero. |
| D7 | Errores con **ProblemDetails**: 400/422 por validación o saldo, 409 por conflicto de idempotencia | Contrato uniforme para el front. |
| D8 | Angular standalone con carpetas **atoms → molecules → organisms → templates → pages** | Aplica el patrón Atomic Design pedido. |
| D9 | Configuración (`ConnectionStrings__Cuentas`, `API_BASE_URL`) por variables de entorno | Sin secretos en el repositorio. |

## Contrato API (v1)
- `GET /api/v1/cuentas`: devuelve las cuentas del titular simulado con número enmascarado y saldo.
- `POST /api/v1/transferencias`:
  - Body: `{origenId, destinoId, monto, moneda, concepto}`.
  - Respuesta: `201` con el comprobante.

## Modelo de datos (PostgreSQL)
- `cuentas(id uuid pk, titular_id, numero_enmascarado, moneda char(3), saldo numeric(18,2) check ≥0, version int)`
- `transferencias(id, idempotency_key unique, origen_id fk, destino_id fk, monto check >0, moneda, estado, creado_en timestamptz)`
- `movimientos(id, cuenta_id fk, transferencia_id fk, tipo 'D'|'C', monto, saldo_resultante, creado_en)`
- Índice adicional: `movimientos(cuenta_id, creado_en desc)`.
- Migraciones versionadas:
  - `V001__esquema.sql`
  - `V002__indices.sql`
  - `V003__seed_ficticio.sql`

## Estructura de módulos
```
backend/Cuentas.sln
  src/Cuentas.Domain/          Cuenta, Transferencia, Movimiento, reglas
  src/Cuentas.Application/     RealizarTransferencia (handler), puertos, DTOs
  src/Cuentas.Infrastructure/  Repos Npgsql+Dapper, UnitOfWork
  src/Cuentas.Api/             Minimal API, ProblemDetails
  tests/Cuentas.UnitTests/     xUnit + fakes en memoria
db/migrations/                 V00x__*.sql
frontend/src/app/
  shared/ui/{atoms,molecules,organisms,templates}/
  features/transferencias/{pages,data-access}/   *.spec.ts junto a cada pieza
```

Ejemplos por nivel de Atomic Design:
- Átomos: `input-monto`, `boton`.
- Moléculas: `selector-cuenta`.
- Organismos: `form-transferencia`, `comprobante`.

## Pruebas unitarias (mínimo)
- **Dominio:**
  - Rechaza monto ≤ 0.
  - Rechaza saldo insuficiente.
  - Rechaza origen igual a destino.
  - Rechaza monedas distintas.
- **Handler:** misma clave de idempotencia devuelve el mismo resultado.
- **Front:** el formulario es inválido sin monto y el servicio llama al endpoint correcto (`HttpTestingController`).

## Hipótesis
- **H1:** "Transacción" equivale a transferencia entre cuentas propias. No hay terceros, divisas ni programación de pagos.
- **H2:** No hay autenticación definida. Se usa un titular simulado fijo y la integración real queda fuera de alcance.
- **H3:** PostgreSQL ≥ 13, porque `gen_random_uuid()` está disponible sin extensiones.
- **H4:** .NET 8 LTS o posterior y Angular con componentes standalone. El runner de pruebas del front es el que trae por defecto la versión de CLI instalada.
- **H5:** El esquema PostgreSQL solo se revisa de forma estática. La compilación depende de la toolchain local y lo que no se pueda verificar se declara como no verificado.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| No hay contexto SGC (fallback), así que las reglas de negocio no están confirmadas | Reglas aisladas en Domain y listadas en el README |
| Concurrencia o doble débito | D4 + D5 + `check saldo ≥ 0` |
| Autenticación sin definir (H2) | Marcar como pendiente. No es apto para producción |
| SQL no ejecutado contra un motor real | Revisión estática y SQL estándar sin funciones exóticas |
| Accesibilidad del formulario | Etiquetas asociadas y mensajes de error con `aria-describedby` |

## Aceptación (complementa la base, no la reemplaza)
- Existen pruebas `*.spec.ts` y xUnit que cubren los casos listados arriba.
- El SQL usa solo parámetros, sin concatenar valores.
- El README indica cómo compilar y ejecutar, las variables de entorno, las hipótesis H1–H5 y lo que no se verificó.
