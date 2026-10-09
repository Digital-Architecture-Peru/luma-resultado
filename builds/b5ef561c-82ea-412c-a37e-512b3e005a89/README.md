# Transacción de Pagos – Banca por Internet (candidate)

Full Stack: **Angular 20** (Atomic Design) + **Java 17+ / Quarkus 3.15** + **PostgreSQL**. Datos ficticios; sin secretos.

## Estructura
- `backend/` – Quarkus, arquitectura hexagonal ligera (`api` → `application` → `domain` ← `infrastructure`). Migraciones Flyway en `src/main/resources/db/migration` (`V1__esquema.sql`, `V2__datos_ficticios.sql`).
- `frontend/` – Angular standalone: `atoms`, `molecules`, `organisms`, `templates`, `pages`, `services`.

## Variables de entorno (backend)
| Variable | Por defecto | Uso |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/pagos` | JDBC de PostgreSQL |
| `DB_USER` | `pagos` | Usuario |
| `DB_PASSWORD` | vacío | Contraseña (definirla en el entorno, nunca en el repo) |
| `DB_POOL_MAX` | `10` | Tamaño máximo del pool |
| `PORT` | `8080` | Puerto HTTP |
| `LOG_LEVEL`, `LOG_JSON` | `INFO`, `false` | Logging |

El frontend usa `/api/v1` (proxy de desarrollo a `http://localhost:8080` en `frontend/proxy.conf.json`).

## Compilar, probar, ejecutar
```bash
# Backend (JDK 17 o superior + Maven). El código se compila con --release 17.
cd backend
mvn test                # pruebas unitarias (sin base de datos)
mvn package
DB_PASSWORD=... mvn quarkus:dev   # requiere PostgreSQL local

# Frontend (Node 20+)
cd frontend
npm install
npm test                # ng test --watch=false (Vitest)
npm run build
npm start
```

## API (`/api/v1`)
- `POST /pagos` con cabecera `Idempotency-Key` → 201 (nuevo), 200 (reintento idéntico), 409 (misma clave con datos distintos), 422 (reglas), 400 (validación de formato).
- `GET /pagos/{id}` → 200 / 404. `GET /pagos?cuentaOrigen=` → últimos 50.
- Errores en `application/problem+json`. Salud: `/q/health`.

## Integración (sin definir)
La pasarela está tras el puerto `PasarelaPagoPort`; `PasarelaPagoStub` rechaza montos > 50 000 y destinos terminados en `0000`. Sustituirlo por el adaptador real cuando se defina.

## Persistencia
Tabla `pago` (`NUMERIC(19,2)`, `UNIQUE(idempotency_key)`, índice `(cuenta_origen, creado_en DESC)`); acceso JPA con parámetros enlazados.

## Limitaciones
Sin autenticación/autorización (la aporta Banca por Internet), sin límites diarios ni OTP, una sola moneda por pago. No apto para producción.
