# Transferencias entre cuentas propias

Aplicación monorepo con `frontend/` (React 18, TypeScript y Vite) y `backend/` (Java 17, Spring Boot 3, JDBC y PostgreSQL). Permite consultar cuentas propias y ejecutar transferencias en una misma moneda. La interfaz consume la API del backend mediante rutas relativas `/api`.

## Requisitos

- JDK 17 y Maven 3.6+.
- Node.js compatible con npm (Node 18+ recomendado).
- PostgreSQL accesible desde el backend.

## Configuración y ejecución local

1. Cree una base de datos PostgreSQL vacía, por ejemplo `banking`. Configure credenciales propias en el entorno; no se incluyen credenciales para producción. El backend usa por defecto URL `jdbc:postgresql://localhost:5432/banking`, usuario `banking` y contraseña vacía. Puede establecer `DB_URL`, `DB_USER` y `DB_PASSWORD`.
2. En una terminal, inicie la API:

   ```sh
   cd backend
   mvn spring-boot:run
   ```

   Flyway aplica automáticamente las migraciones al arrancar. Puerto por defecto: `8080` (`PORT` lo cambia). El límite por transferencia es `10000.00`; se configura con `TRANSFER_MAX_AMOUNT`.
3. En otra terminal, inicie el frontend:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

   Abra la dirección que indique Vite (usualmente `http://localhost:5173`). El proxy de desarrollo reenvía `/api` a `http://localhost:8080`. Para compilar frontend para distribución: `npm run build`; los artefactos quedan en `frontend/dist/`.

El frontend envía `X-Customer-Id`, configurable mediante `VITE_CUSTOMER_ID` (por defecto `1`). Es un stub ficticio y **no es autenticación**; no exponer la aplicación como banca real.

## API

Todas las rutas usan el prefijo `/api/v1`. Las consultas requieren cabecera `X-Customer-Id`.

- `GET /accounts` — cuentas del cliente.
- `GET /accounts/{id}/movements?page=0&size=20` — movimientos paginados de una cuenta propia (tamaño máximo 50).
- `POST /transfers` — crea una transferencia. Requiere `Idempotency-Key` (no vacío, máximo 64 caracteres) y `X-Customer-Id`.

Ejemplo de solicitud:

```sh
curl -i -X POST http://localhost:8080/api/v1/transfers \
  -H 'Content-Type: application/json' \
  -H 'X-Customer-Id: 1' \
  -H 'Idempotency-Key: demo-transfer-001' \
  -d '{"sourceAccountId":1,"targetAccountId":2,"amount":"25.50","currency":"USD","description":"Ahorro"}'
```

`amount` es texto decimal, admite hasta dos decimales; se responde con monto en texto y estado `COMPLETED` (HTTP 201). Una clave ya usada se rechaza, no reproduce la respuesta original. Errores de negocio se devuelven como `application/problem+json`; por ejemplo, duplicado o saldo insuficiente son conflictos, y datos inválidos son `422`. No reutilice la clave de ejemplo si ya se ejecutó.

## Persistencia y consistencia

PostgreSQL es la persistencia real del backend. `V1__schema.sql` crea cuentas, transferencias y movimientos; `V2__seed_ficticio.sql` inserta cuentas de muestra para los clientes ficticios 1 y 2. No usar estos datos en producción. Flyway mantiene el historial de migraciones.

El servicio de transferencia ejecuta actualizaciones de saldos, alta de transferencia y dos movimientos dentro de una transacción JDBC. Bloquea cuentas por id ascendente (`SELECT ... FOR UPDATE`) para serializar operaciones concurrentes y reducir deadlocks; la clave de idempotencia tiene restricción única en base de datos. Los montos se guardan como `NUMERIC(19,2)`. Las cuentas de origen y destino deben usar la moneda solicitada.

La autorización al core se representa mediante `CoreBankingPort`, pero actualmente `FakeCoreBankingAdapter` autoriza todo: no hay integración con un core bancario real. Para producción deben reemplazarse tanto este adaptador como la identidad simulada por integraciones seguras y autenticadas.

## Pruebas

Desde la raíz del repositorio:

```sh
(cd backend && mvn test)
(cd frontend && npm install && npm test)
(cd frontend && npm run build)
```

Las pruebas Java son unitarias (JUnit 5/Mockito) y no requieren PostgreSQL. Vitest ejecuta las pruebas del frontend en jsdom; el build frontend incluye chequeo de tipos (`tsc --noEmit`). No hay pruebas de integración contra PostgreSQL ni pruebas end-to-end.

## Configuración del backend

| Variable | Predeterminado | Uso |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/banking` | URL JDBC |
| `DB_USER` | `banking` | Usuario de base de datos |
| `DB_PASSWORD` | vacío | Contraseña; establecer fuera del repositorio |
| `PORT` | `8080` | Puerto HTTP |
| `TRANSFER_MAX_AMOUNT` | `10000.00` | Límite positivo por operación |
| `LOG_LEVEL` | `INFO` | Nivel raíz de logging |
| `VITE_CUSTOMER_ID` | `1` | Identidad de demostración del frontend |

Actuator expone health. No hay configuración CORS separada; en desarrollo se usa el proxy Vite.

## Estado de verificación

Documentación basada en el código y manifiestos existentes. En esta sesión no se ejecutaron Maven, npm, las pruebas ni migraciones contra una base PostgreSQL.