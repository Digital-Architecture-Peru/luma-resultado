# Banca por Internet · Transferencias entre cuentas propias (candidate)

Full Stack: **React + TypeScript** (`frontend/`, Atomic Design) y **Java 17 + Quarkus 3.15** (`backend/`) con **PostgreSQL**.
Datos ficticios; sin autenticación (el alcance asume un cliente simulado). No apto para producción.

## Requisitos
JDK 17+, Maven 3.9+, Node 18+, PostgreSQL 14+.

## Variables de entorno (backend)
| Variable | Descripción | Valor por defecto |
|---|---|---|
| `DB_URL` | URL JDBC | `jdbc:postgresql://localhost:5432/banca` |
| `DB_USER` | Usuario | `banca_app` |
| `DB_PASSWORD` | Contraseña (no se versiona) | vacío |
| `PORT` | Puerto HTTP | `8080` |
| `DB_POOL_MAX`, `LOG_LEVEL` | Pool y nivel de log | `10`, `INFO` |

Frontend: `BACKEND_URL` (proxy de Vite en desarrollo, por defecto `http://localhost:8080`).

## Base de datos
Crea la base `banca` y el usuario con tus propias credenciales. Flyway aplica al arrancar `V1__schema.sql` (esquema, restricciones, índices) y `V2__seed_ficticio.sql` (4 cuentas ficticias).

## Ejecutar
```
cd backend && DB_PASSWORD=... mvn quarkus:dev
cd frontend && npm install && npm run dev
```

## Compilar y probar
```
cd backend && mvn package      # compila y ejecuta JUnit 5
cd frontend && npm run build   # tsc --noEmit + vite build
cd frontend && npm test        # vitest run
```

## API (`/api/v1`)
- `GET /accounts`
- `GET /accounts/{id}/movements`
- `POST /transfers` con cabecera obligatoria `Idempotency-Key` y cuerpo `{sourceAccountId, targetAccountId, amount:"10.00", currency:"USD", description}` → `201` con comprobante.
- Errores `application/problem+json`: `422` validación, `404` cuenta inexistente, `409` saldo insuficiente o clave de idempotencia reutilizada con otra solicitud.
- Reintento con la misma clave y la misma solicitud devuelve el mismo comprobante sin doble cargo.

## Diseño
- Capas: `api` → `service` → `repository` (puerto) → `JdbcAccountRepository`; `CoreBankingGateway` es un puerto con adaptador stub (**integración sin definir**).
- Atomicidad: `@Transactional` + `SELECT … FOR UPDATE` en orden de id ascendente; `CHECK (balance >= 0)` como red de seguridad.
- Montos: `BigDecimal` / `NUMERIC(19,2)` y texto en el front.
- Pruebas unitarias: `TransferServiceTest` (con repositorio en memoria), `validation.test.ts`, `TransferForm.test.tsx`.

## Pendientes y límites
Autenticación/autorización (bloqueante antes de producción), reglas corporativas SGC (en fallback), pruebas de integración contra PostgreSQL, carrera de dos solicitudes simultáneas con la misma clave nueva (la restricción `UNIQUE` la rechaza con error 500 genérico; falta mapearla a 409).
