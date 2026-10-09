# Notificaciones de Tarjetas · Banca por Internet (candidate)

Full Stack: **Angular 19** (`frontend/`) + **Java 17 / Quarkus 3.15** (`backend/`) + **PostgreSQL**.
Alcance (hipótesis H1): alertas in-app listables y marcables como leídas. Quién las genera
es una **integración sin definir**; esta solución solo las persiste y las expone. Datos ficticios.

## Backend
```
cd backend
mvn package        # compila y ejecuta las pruebas unitarias (JUnit 5 + Mockito)
mvn quarkus:dev    # ejecución local (requiere PostgreSQL o Dev Services con Docker)
```
Variables de entorno (sin valores por defecto, no se versionan secretos):
`QUARKUS_DATASOURCE_JDBC_URL`, `QUARKUS_DATASOURCE_USERNAME`, `QUARKUS_DATASOURCE_PASSWORD`,
opcional `CORS_ORIGINS` (por defecto `http://localhost:4200`), `DB_POOL_MAX`, `LOG_LEVEL`.

API (`/api/v1`):
- `GET /tarjetas/{tarjetaId}/notificaciones?leida=&page=0&size=20` → `{items,page,size,total}` (size 1–100)
- `PATCH /notificaciones/{id}/leida` → notificación actualizada (404 si no existe)
- `GET /q/health` (liveness/readiness)

Errores en `application/problem+json`.

## Persistencia (PostgreSQL)
Migraciones Flyway en `backend/src/main/resources/db/migration`:
`V1__esquema.sql` (tabla `notificacion`, solo `ultimos4`, nunca el PAN; índices
`(tarjeta_id, creada_en DESC)` y parcial `WHERE leida = FALSE`) y `V2__datos_ficticios.sql`.
Acceso JDBC con consultas parametrizadas detrás del puerto `NotificacionRepository`.

## Frontend (Atomic Design)
```
cd frontend
npm install
npm run build   # ng build (type-check incluido)
npm test        # vitest run
npm start       # ng serve con proxy /api -> http://localhost:8080
```
`ui/atoms` (badge-tipo, icono-estado) → `ui/molecules` (item-notificacion) → `ui/organisms`
(lista-notificaciones) → `ui/templates` → `pages`. HTTP centralizado en `core/services`.
URL base del API: token `API_BASE_URL` (por defecto `/api/v1`).

## Límites
Sin autenticación/autorización (el `tarjetaId` se asume validado por una capa externa): no apto
para producción. Las migraciones PostgreSQL solo tuvieron revisión estática.
