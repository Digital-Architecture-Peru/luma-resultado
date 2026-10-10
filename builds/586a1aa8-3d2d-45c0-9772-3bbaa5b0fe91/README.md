# Notificaciones de Pagos — Banca por Internet (candidate)

Full Stack: **Angular 17** (`frontend/`, Atomic Design) + **Java 17 / Spring Boot 3.3** (`backend/`, capas domain/application/adapters) + **PostgreSQL** (migraciones Flyway). Todos los datos son ficticios.

## Requisitos
Java 17, Maven 3.9+, Node 18.19+/20, Chrome (para las pruebas Karma) y PostgreSQL.

## Configuración (variables de entorno, sin valores por defecto)
Ver `backend/.env.example`: `DB_URL`, `DB_USER`, `DB_PASSWORD` (obligatorias), `SERVER_PORT`, `LOG_LEVEL`. No se versionan secretos.

## Backend
```
cd backend
mvn test                # pruebas unitarias (no requieren base de datos)
mvn package
DB_URL=... DB_USER=... DB_PASSWORD=... mvn spring-boot:run
```
Flyway aplica `V1__schema.sql` (tablas, `UNIQUE(payment_id, event_type)` para idempotencia, índices) y `V2__seed_ficticio.sql` (datos de ejemplo de `CUST-0001`/`CUST-0002`).

## Frontend
```
cd frontend
npm install
npm run build
npm test                # Jasmine/Karma, ChromeHeadless, una sola pasada
npm start               # http://localhost:4200, proxy /api -> localhost:8080
```

## API
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/payment-notifications?page=0&size=20` | Bandeja paginada (size 1..100) |
| PATCH | `/api/v1/payment-notifications/{id}/read` | Marca como leída (idempotente) |
| GET/PUT | `/api/v1/notification-preferences` | Matriz evento × canal (por defecto habilitado); PUT `{"preferences":[...]}` |
| POST | `/internal/payment-events` | Simula un evento de pago: 201 creada, 204 duplicada/deshabilitada |

Todas requieren la cabecera `X-Customer-Id`. Errores en `application/problem+json`. La cuenta se expone enmascarada (`****1234`).

Ejemplo:
```
curl -X POST localhost:8080/internal/payment-events -H 'Content-Type: application/json' \
 -d '{"customerId":"CUST-0001","paymentId":"PAY-9","eventType":"PAGO_EXITOSO","amount":10.5,"currency":"USD","accountNumber":"00112233441234"}'
```

## Integración (sin definir) y límites
- No hay broker ni proveedor de email/SMS: el puerto `NotificationSender` tiene un adaptador simulado (`LogNotificationSender`). La bandeja in-app es el canal real.
- El front consulta por polling cada 30 s (`POLL_INTERVAL_MS`); SSE sería la evolución.
- **Autenticación fuera de alcance**: `X-Customer-Id` es ficticio y **no apto para producción**.
- Si el canal IN_APP está deshabilitado no se persiste la notificación, por lo que la idempotencia no aplica a ese caso.
- Una carrera entre dos eventos idénticos simultáneos la frena la restricción UNIQUE (la segunda transacción falla con 500).

## Estado de verificación
Código generado sin ejecutar: no se afirma que compile ni que las pruebas pasen.
