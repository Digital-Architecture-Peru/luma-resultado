# Consulta de Tarjetas · Banca por Internet (candidate)

Full Stack: **Angular 17** (Atomic Design) + **.NET 8** (Api/Application/Domain/Infrastructure) + **PostgreSQL**. Datos ficticios, sin secretos.

## Estructura
- `backend/` API de solo lectura: `GET /api/v1/cards`, `GET /api/v1/cards/{id}`, `GET /api/v1/cards/{id}/movements?page&size`, `GET /health`.
- `db/migrations/` `V001` esquema, `V002` índices, `V003` seed ficticio (cliente demo `11111111-1111-1111-1111-111111111111`).
- `frontend/src/app/` `atoms/`, `molecules/`, `organisms/`, `templates/`, `pages/`, `core/`.

## Seguridad
- El cliente sale del claim `customer_id`, nunca de la URL. En `Development` se acepta el header `X-Demo-Customer-Id` (stub; el proxy de `ng serve` lo inyecta). Fuera de Development sin claim → 401.
- Solo se guarda `last4`; el API devuelve `**** 1234`.

## Configuración (variables de entorno)
- `ConnectionStrings__Cards` (p. ej. `Host=localhost;Database=cards;Username=cards_app;Password=<DB_PASSWORD>`), `Cors__AllowedOrigins` (por defecto `http://localhost:4200`), `ASPNETCORE_ENVIRONMENT=Development`, `DB_PASSWORD` para docker-compose.
- Frontend: base `/api/v1` (token `API_BASE_URL`); en desarrollo `frontend/proxy.conf.json` apunta a `http://localhost:5080`.

## Ejecutar
```
export DB_PASSWORD=...            # elija una
docker compose up -d              # PostgreSQL + migraciones/seed
cd backend && dotnet run --project src/Cards.Api --urls http://localhost:5080
cd frontend && npm install && npm start
```

## Build y pruebas
```
cd backend && dotnet build && dotnet test      # xUnit con repositorio fake
cd frontend && npm install && npm run build && npm test   # Jest (jest-preset-angular), sin navegador
```

## Integración y persistencia
- Integración con el core de tarjetas: **sin definir**; solo existe el puerto `ICardQueryRepository` y su implementación Npgsql (SQL parametrizado).
- Persistencia PostgreSQL: montos `numeric(18,2)`, fechas `timestamptz` (UTC).

## Estado
Candidate: no se ejecutó build ni pruebas ni el SQL contra PostgreSQL.
