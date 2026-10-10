# Notificaciones de Cuentas — Banca por Internet (candidate)

Full Stack: **React + TypeScript** (Atomic Design) y **Java 17 + Spring Boot 3.2** con **PostgreSQL**. Datos ficticios; sin autenticación (pendiente).

## Estructura
- `backend/`: `api` → `application` → `domain`, puertos en `port`, adaptadores en `infrastructure` (JDBC con SQL parametrizado). Migraciones Flyway en `src/main/resources/db/migration`.
- `frontend/`: `components/{atoms,molecules,organisms,templates}`, `pages`, `hooks`, `services`, `types`.

## Variables de entorno
| Variable | Uso |
|---|---|
| `DB_URL` | JDBC (por defecto `jdbc:postgresql://localhost:5432/notificaciones`) |
| `DB_USER` | Usuario de BD |
| `DB_PASSWORD` | Contraseña de BD (obligatoria, sin valor por defecto) |
| `PORT`, `LOG_LEVEL` | Opcionales |
| `VITE_API_BASE_URL` | Base de la API en el front (vacío = proxy de Vite a `localhost:8080`) |
| `VITE_CUENTA_ID` | Cuenta de demo (por defecto `0011223344`) |

## Ejecutar
```
docker compose up -d db          # requiere DB_PASSWORD exportada
cd backend && mvn spring-boot:run
cd frontend && npm install && npm run dev
```

## Pruebas y build
```
cd backend && mvn test           # JUnit 5 + Mockito + MockMvc standalone
cd frontend && npm test && npm run build
```

## API `/api/v1`
- `GET /cuentas/{cuentaId}/notificaciones?leida=&page=&size=`
- `PATCH /notificaciones/{id}/lectura`
- `GET|PUT /cuentas/{cuentaId}/preferencias-notificacion`
Errores en formato `ProblemDetail` (RFC 7807).

## Integración y persistencia
- Integración de canales: **sin definir**. `CanalLogFake` solo registra (cuenta enmascarada, sin montos). Un canal real implementa `CanalNotificacionPort`.
- `TitularidadStub` acepta cualquier cuenta con formato válido: **riesgo IDOR** hasta integrar autenticación.
- PostgreSQL: tablas `notificacion` y `preferencia_notificacion` (V1) y datos ficticios (V2). Requiere PostgreSQL 13+ (`gen_random_uuid`).

## Estado
Candidate. No se ejecutó compilación ni pruebas al generar el código.
