# Consulta de Cuentas – Banca por Internet (candidate)

Full Stack: Angular 17 (Atomic Design) + Java 17 / Spring Boot 3.3 + PostgreSQL. Solo lectura (GET). Datos ficticios.

## Estructura
- `backend/`: Maven. `api` (controller, DTO, errores problem+json) → `service` → `persistence` (`CuentaRepository` + `JdbcCuentaRepository` con `NamedParameterJdbcTemplate`) y `domain`.
- `backend/src/main/resources/db/migration/`: Flyway `V1__esquema_cuentas.sql`, `V2__datos_ficticios.sql`.
- `frontend/`: `core/` (servicio HTTP), `shared/atoms|molecules|organisms`, `features/cuentas/{templates,pages}`.

## Variables de entorno
Ver `.env.example`: `DB_URL`, `DB_USER`, `DB_PASSWORD` (obligatoria, sin valor por defecto), `CORS_ORIGIN`, `LOG_LEVEL`.

## Ejecución
```
export DB_PASSWORD=<su-clave-local>
docker compose up -d db
cd backend && mvn spring-boot:run        # http://localhost:8080
cd frontend && npm install && npm start  # http://localhost:4200 (proxy /api -> 8080)
```

## Build y pruebas
```
cd backend && mvn package        # incluye JUnit 5 (service y @WebMvcTest)
cd frontend && npm run build && npm test
```
Las pruebas del frontend usan Jasmine/Karma con `frontend/karma.conf.js` (solo `karma-jasmine` y `karma-chrome-launcher`; lanzador `ChromeHeadlessCI` con `--no-sandbox`). Requiere Chrome/Chromium instalado.

## API
- `GET /api/v1/cuentas?clienteId=CLI-001` → lista de `CuentaResumen`.
- `GET /api/v1/cuentas/{cuentaId}` → `CuentaDetalle` o 404.
- Errores 400/404 en `application/problem+json`. Número de cuenta siempre enmascarado (`****2345`). Salud: `/actuator/health`.

## Integración y persistencia
- Integración: sin definir; el contrato puede cambiar. Autenticación fuera de alcance: `clienteId` por parámetro es solo simulación y **no es apto para producción**.
- Persistencia: PostgreSQL con Flyway; montos `NUMERIC(18,2)`; índice `idx_cuenta_cliente`.

## Sin verificar
Compilación, pruebas y migraciones contra PostgreSQL real no se han ejecutado.
