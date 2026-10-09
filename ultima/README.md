# Banca por Internet · Transferencia entre cuentas propias

Full Stack: **Angular 17** (`frontend/`, Atomic Design) + **Spring Boot 3 / Java 17** (`backend/`, Maven) + **PostgreSQL** (Flyway). Datos ficticios; sin secretos en el repositorio.

## Alcance (hipótesis H1–H6)
- Transferencia entre cuentas propias de la **misma moneda**; sin conversión, límites, OTP ni comisiones.
- El cliente se identifica con la cabecera ficticia `X-Customer-Id` (el frontend envía `CLI-001`). No hay autenticación real.
- Integración externa: sin definir; no se hacen llamadas externas.

## Base de datos y variables de entorno
```bash
export DB_PASSWORD=<elija-una-contraseña-local>
docker compose up -d db
```
Variables (todas por entorno): `DB_URL` (por defecto `jdbc:postgresql://localhost:5432/cuentas`), `DB_USER` (`cuentas`), `DB_PASSWORD` (obligatoria, sin valor por defecto), `LOG_LEVEL` (`INFO`).

Migraciones en `backend/src/main/resources/db/migration` (`V1__schema.sql`, `V2__seed_ficticio.sql`), ejecutadas por Flyway al arrancar.
Modelo: `account`, `transfer` (`idempotency_key` único), `movement` (un débito y un crédito por transferencia, índice `(account_id, created_at DESC)`). Importes `NUMERIC(19,2)`.

## Backend
```bash
cd backend
mvn test                # JUnit 5 + Mockito + MockMvc standalone
mvn spring-boot:run     # http://localhost:8080
```
API v1 (errores `application/problem+json`), cabecera `X-Customer-Id` obligatoria:
- `GET /api/v1/accounts`
- `POST /api/v1/transfers` con `Idempotency-Key`: 201 creada, 200 reintento idéntico, 409 clave reutilizada con otro cuerpo, 422 regla de negocio, 400 validación.
- `GET /api/v1/accounts/{id}/movements?page=&size=`
- `GET /actuator/health`

La transferencia es una sola transacción con bloqueo pesimista de ambas cuentas ordenado por id.

## Frontend
```bash
cd frontend
npm install
npm test                # Jest (jest-preset-angular), una sola pasada
npm run build           # ng build (type-check estricto)
npm start               # http://localhost:4200, proxy /api -> :8080
```
Atomic Design: `atoms/`, `molecules/`, `organisms/`, `templates/`, `pages/`, `core/` (servicios y store con signals).

## Límites conocidos
- Las pruebas unitarias no cubren SQL ni concurrencia real; se sugiere Testcontainers después.
- Esquema PostgreSQL revisado solo de forma estática.
- Validar con negocio la interpretación de "Transacción" (H1).
