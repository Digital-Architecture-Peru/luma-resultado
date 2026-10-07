# Consulta de Tarjetas - Banca por Internet (candidate)

Full Stack: `backend/` (Java 17 + Spring Boot 3.3, Maven, PostgreSQL + Flyway) y `frontend/` (React 18 + TypeScript + Vite, Atomic Design). Capacidad de solo lectura sobre datos ficticios.

## API
- `GET /api/v1/cards` - tarjetas del cliente.
- `GET /api/v1/cards/{cardId}` - detalle. Tarjeta ajena o inexistente: 404 (`application/problem+json`).
- Header obligatorio `X-Customer-Id` (hipotesis H1: cliente ficticio; en produccion vendria del token de sesion). Falta de header o UUID invalido: 400.
- Solo se persisten y devuelven los ultimos 4 digitos (`**** **** **** 1234`).
- `/actuator/health` para liveness.

## Backend
Capas: `api` -> `service` -> `port (CardRepository)` -> `adapter (JdbcCardRepository)`, con SQL parametrizado (`NamedParameterJdbcTemplate`).

Variables de entorno (sin valores por defecto para credenciales):
| Variable | Descripcion |
|---|---|
| `DB_URL` | JDBC, por defecto `jdbc:postgresql://localhost:5432/cards` |
| `DB_USER` | usuario de PostgreSQL (por defecto `cards`) |
| `DB_PASSWORD` | contrasena de PostgreSQL |
| `CORS_ALLOWED_ORIGINS` | por defecto `http://localhost:5173` |
| `PORT`, `LOG_LEVEL` | opcionales |

```
cd backend
mvn test                # pruebas unitarias (no requieren base de datos)
mvn package
DB_USER=... DB_PASSWORD=... mvn spring-boot:run   # Flyway aplica V1 (esquema) y V2 (seed ficticio)
```

## Frontend
Variables opcionales: `VITE_API_BASE_URL` (por defecto `http://localhost:8080`), `VITE_CUSTOMER_ID` (por defecto `CUST-1001`).
```
cd frontend
npm install
npm test        # vitest run
npm run build   # tsc --noEmit && vite build
npm run dev
```

## Persistencia e integracion
- PostgreSQL: tabla `card` con CHECK de tipo/estado, indice `idx_card_customer_id`; migraciones en `backend/src/main/resources/db/migration`.
- Integracion con el core de tarjetas: sin definir. Se reemplaza implementando `CardRepository` con otro adaptador.

## Limites
Sin autenticacion real, sin paginacion (se asumen <20 tarjetas por cliente), sin pruebas de integracion contra PostgreSQL.
