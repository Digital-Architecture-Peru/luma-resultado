# Consulta de Tarjetas — Banca por Internet (candidate)

Full Stack: `backend/` (Java 17 + Quarkus 3.x, Maven) y `frontend/` (React + TypeScript, Vite). Persistencia: PostgreSQL 14+ con Flyway. Datos ficticios.

## Backend
```
cd backend
mvn test        # pruebas unitarias (JUnit 5, sin BD)
mvn package
export DB_URL=jdbc:postgresql://localhost:5432/tarjetas DB_USER=tarjetas DB_PASSWORD=<tu-clave-local>
mvn quarkus:dev # Flyway aplica V1 (esquema) y V2 (datos ficticios)
```
Endpoints (solo lectura), con cabecera `X-Cliente-Id: <uuid>`:
- `GET /api/v1/tarjetas?pagina=0&tamano=20`
- `GET /api/v1/tarjetas/{id}` (404 si no existe o es de otro cliente)

Errores: `{ "codigo": "...", "mensaje": "..." }`. Cliente de ejemplo: `00000000-0000-4000-8000-000000000001`.

## Frontend
```
cd frontend
npm install
npm test        # vitest run
npm run build   # tsc --noEmit && vite build
npm run dev     # VITE_API_URL, VITE_CLIENTE_ID (ver docs/variables-entorno.md)
```
Atomic Design: `components/{atoms,molecules,organisms,templates}`, `pages/`, `hooks/`, `services/`.

## Seguridad e integración
- Solo se guardan marca y últimos 4 dígitos; el PAN, CVV y fecha completa nunca se almacenan. El DTO devuelve `**** 1234`.
- **`X-Cliente-Id` es una simulación de identidad, NO apta para producción**: debe reemplazarse por el token validado de un gateway/OIDC.
- Integración con el core de tarjetas: sin definir; los datos provienen solo de PostgreSQL local.
- Secretos únicamente por variables de entorno (`docs/variables-entorno.md`); CORS por `CORS_ORIGINS`.
