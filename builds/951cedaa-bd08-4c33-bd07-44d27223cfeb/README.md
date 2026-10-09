# Pagos — banca por Internet

Aplicación de ejemplo para crear pagos: frontend React + TypeScript y API Java + Quarkus, con PostgreSQL y migraciones Flyway. Los datos son ficticios. No incluye autenticación ni integración con un proveedor bancario: `LocalPaymentGateway` simula autorización local; no usar para transacciones reales.

## Requisitos

- JDK 17 o posterior y Maven 3.9 o posterior.
- Node.js 18 o posterior y npm.
- PostgreSQL accesible por JDBC. Para ejecución local, crear base `payments` y usuario `payments_app` con permisos de conexión y escritura sobre esa base. Configurar las credenciales en el entorno; no guardarlas en el repositorio.

## Configuración

El backend usa estas variables (con los valores indicados como defaults en `application.properties`):

| Variable | Default | Uso |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/payments` | URL JDBC PostgreSQL |
| `DB_USER` | `payments_app` | Usuario de base de datos |
| `DB_PASSWORD` | sin valor documentado | Contraseña de base de datos |
| `PORT` | `8080` | Puerto HTTP del backend |
| `CORS_ORIGINS` | `http://localhost:5173` | Orígenes permitidos por CORS |
| `PAYMENTS_MAX_AMOUNT` | `50000` | Máximo permitido por regla de negocio |
| `PAYMENTS_STUB_DECLINE_ABOVE` | `20000` | Umbral de rechazo del gateway simulado |
| `LOG_LEVEL` | `INFO` | Nivel de logging |

El datasource requiere `DB_PASSWORD`; establecerla en el entorno antes de iniciar Quarkus. No se necesita configurar una URL en frontend en desarrollo: Vite proxy pasa `/api` al backend local. Para otra ubicación de API, `VITE_API_URL` define el prefijo de URL (sin incluir `/api/v1/payments`).

## Ejecutar en desarrollo

Iniciar primero PostgreSQL y establecer `DB_USER` y `DB_PASSWORD` (y opcionalmente `DB_URL`). En una terminal:

```sh
cd backend
mvn quarkus:dev
```

Quarkus queda disponible en `http://localhost:8080`. Al arrancar, Flyway ejecuta las migraciones y el seed ficticio.

En otra terminal:

```sh
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173`. El servidor de desarrollo reenvía las solicitudes `/api` a `http://localhost:8080`; el backend permite por defecto el origen local indicado.

## Compilar y probar

Backend, desde `backend/`:

```sh
mvn test
mvn package
```

Las pruebas unitarias del servicio y del dominio están en `src/test/java`. `mvn package` produce el artefacto Quarkus.

Frontend, desde `frontend/`:

```sh
npm install
npm test
npm run build
```

Vitest ejecuta pruebas no interactivas. El build ejecuta `tsc --noEmit` y Vite.

## API e integración

- `POST /api/v1/payments` recibe JSON con `originAccount`, `beneficiary`, `amount`, `currency` (`PEN` o `USD`) y `concept`. Admite cabecera `Idempotency-Key`; responde `201` con el pago creado o errores de validación/conflicto (`400`/`409`).
- `GET /api/v1/payments/{id}` consulta por UUID y responde `200` o `404`.
- Los errores se devuelven como `application/problem+json`. En el cliente web, `paymentsClient` transforma respuestas no exitosas en `ApiError`.
- El flujo de aplicación valida y crea el pago, invoca `PaymentGateway` y guarda el resultado. `LocalPaymentGateway` es exclusivamente un stub configurable; integrar un proveedor real requiere implementar el puerto `PaymentGateway`, definir credenciales seguras y diseñar timeouts, reintentos y conciliación.

## Persistencia y datos

`JdbcPaymentRepository` implementa `PaymentRepository` mediante JDBC y consultas parametrizadas. PostgreSQL persiste pagos en la tabla `payments`; Flyway aplica `backend/src/main/resources/db/migration/V1__schema.sql` (tabla, restricciones e índice) y `V2__seed.sql` (tres registros ficticios) al inicio (`quarkus.flyway.migrate-at-start=true`). Las claves de idempotencia tienen restricción única. El seed se ejecuta como parte de la migración inicial y no debe considerarse un mecanismo para reinicializar una base ya migrada.

El repositorio valida reglas del dominio y la base impone restricciones de monto positivo, moneda y estado. La aplicación no incorpora autenticación/autorización; debe añadirse antes de exponerla fuera de un entorno local controlado.

## Hipótesis y límites

PEN/USD, máximo 50 000, dos decimales y rechazo simulado por encima de 20 000 son reglas asumidas por esta demo, no requisitos confirmados de un sistema bancario. No se ejecutaron builds ni pruebas durante la preparación de esta documentación; consultar los comandos anteriores para verificarlos en el entorno local.
