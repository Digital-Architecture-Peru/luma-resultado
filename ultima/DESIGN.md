# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Quarkus (capa Full Stack) para "Transacción" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
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
| D1 | Monorepo con `frontend/` (Vite + React + TS) y `backend/` (Quarkus + Maven) | Builds independientes y un solo README |
| D2 | Backend por capas: `api` → `service` → `domain` ← `repository` / `integration` (puertos) | El dominio queda aislado; el servicio se prueba con mocks |
| D3 | Integración externa detrás de `CardCoreGateway` con adaptador `FakeCardCoreGateway` | La integración no está definida; no hay llamadas reales |
| D4 | Persistencia JDBC/Panache con consultas parametrizadas y Flyway (`V1__schema.sql`, `V2__seed.sql`) | Migraciones versionadas sin SQL concatenado |
| D5 | `POST` con cabecera `Idempotency-Key` (UNIQUE en BD) | Evita cobros duplicados por reintentos |
| D6 | Montos `BigDecimal` / `NUMERIC(15,2)` y moneda ISO 4217 | Sin errores de punto flotante |
| D7 | Solo PAN enmascarado (`**** 1234`); nunca el PAN completo | Reduce el alcance de PCI |
| D8 | UI Atomic Design; estado local + hook `useCardTransaction` | Patrón pedido, sin dependencias extra |
| D9 | Unitarias: JUnit 5 + Mockito (sin `@QuarkusTest`) y Vitest + Testing Library | No requieren Docker ni una BD viva |

## Contrato API (v1)
- `GET /api/v1/cards/{cardId}/transactions?limit=20` → 200 con lista.
- `POST /api/v1/cards/{cardId}/transactions` con body `{type, amount, currency, description}` → 201, 409 (Idempotency-Key ya usada) o 422 (saldo o estado inválido).
- Los errores usan formato tipo RFC 7807: `{type, title, status, detail}`.

## Modelo de datos (PostgreSQL)
- `card(id UUID PK, masked_pan, holder_alias, status, credit_limit, available_balance, version)`
- `card_transaction(id UUID PK, card_id FK, type, amount CHECK>0, currency CHAR(3), status, idempotency_key UNIQUE, created_at)`
- Índice `(card_id, created_at DESC)`.
- Bloqueo optimista por `version` al afectar el saldo.

## Estructura de módulos
```
frontend/src/components/{atoms,molecules,organisms,templates}/  pages/  services/api.ts  hooks/  __tests__/
backend/src/main/java/.../cards/{api,service,domain,repository,integration}/
backend/src/main/resources/{application.properties,db/migration/}
backend/src/test/java/.../cards/
```

## Hipótesis
- H1: "Transacción" significa **registrar un pago o compra con tarjeta y consultar sus movimientos**. Debe confirmarse con el negocio.
- H2: El host de Banca por Internet gestiona la autenticación. Se recibe un `X-Customer-Id` simulado.
- H3: Versiones: Java 17, Quarkus 3.x, Node 20, React 18.
- H4: SGC está en fallback, así que no hay estándares corporativos aplicados (naming, logging, seguridad).
- H5: La configuración va por variables de entorno (`DB_URL`, `DB_USER`, `DB_PASSWORD`) sin valores reales en el repositorio.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sin toolchain local, la compilación queda sin verificar | Marcarlo como no verificado en el handoff |
| El SQL de PostgreSQL solo se revisa de forma estática | Usar sintaxis estándar y migraciones pequeñas |
| Concurrencia al actualizar el saldo | Columna `version` + reintento acotado + 409 |
| Contrato de integración desconocido | Puerto estable y adaptador fake reemplazable |
| Las unitarias no cubren el flujo HTTP ni la BD | Documentar que faltan pruebas de integración |

## Trazabilidad con la aceptación
- Fuentes de D1–D8 en los dos módulos.
- Pruebas en `__tests__/` y `src/test/`.
- README con build, ejecución, integración y persistencia.
- La sintaxis se valida con la herramienta local disponible.
- El resultado se entrega como candidate.
