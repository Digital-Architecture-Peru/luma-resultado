# Transacciones de pagos — banca por Internet

Aplicación de ejemplo Full Stack: frontend React 18 + TypeScript servido por Vite y API Java 17 + Spring Boot 3.2.5. La base de datos de ejecución es PostgreSQL. Los registros seed y el gateway son ficticios; no usar para transacciones reales.

## Requisitos

- Java 17 y Maven.
- Node.js y npm compatibles con las dependencias del proyecto.
- PostgreSQL accesible desde el backend.

## Configurar y ejecutar

### 1. Preparar PostgreSQL

Crea una base de datos llamada `payments` (y un usuario con permisos de conexión, creación/lectura/escritura de tablas). Por ejemplo, desde una instalación local:

```sql
CREATE DATABASE payments;
```

Configura las variables de entorno para el proceso backend:

```text
DB_URL=jdbc:postgresql://localhost:5432/payments
DB_USER=<usuario local>
DB_PASSWORD=<contraseña local>
PAYMENTS_FAKE_LIMIT=10000.00
PORT=8080
LOG_LEVEL=INFO
```

`backend/env.example.txt` documenta los nombres/valores de ejemplo; no es un archivo `.env` que Spring cargue automáticamente. Exporta estas variables en tu entorno o en la configuración de ejecución de tu IDE. No pongas contraseñas reales en el repositorio.

### 2. Arrancar la API

```bash
cd backend
mvn spring-boot:run
```

Spring Boot escucha en `http://localhost:8080`. Flyway aplica las migraciones versionadas en `backend/src/main/resources/db/migration`: `V1` crea la tabla e índices y `V2` añade pagos ficticios de ejemplo. La inicialización requiere que la base de datos esté disponible.

### 3. Arrancar la interfaz

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abre la URL que indique Vite (normalmente `http://localhost:5173`). El servidor Vite reenvía `/api` a `http://localhost:8080` según `frontend/vite.config.ts`; por ello, en desarrollo deben estar activos frontend y backend.

## Compilar y probar

Ejecuta los comandos en sus respectivas carpetas:

```bash
# Backend: compila y ejecuta pruebas JUnit 5 / Mockito
cd backend
mvn verify

# Frontend: instala dependencias, hace type-check + build Vite y ejecuta Vitest
cd ../frontend
npm install
npm run build
npm test
```

Las pruebas unitarias del backend usan dobles y no requieren PostgreSQL; `mvn verify` no equivale a una prueba de integración con una base real. Los tests del frontend corren en Vitest/jsdom sin backend. La compilación del frontend realiza `tsc --noEmit` antes de empaquetar.

## API

Base URL: `/api/v1/payments`.

- `POST /api/v1/payments`: crea un pago. Requiere encabezado `Idempotency-Key` (máximo 64 caracteres) y un cuerpo JSON:

  ```json
  {
    "sourceAccount": "ES00-FAKE-0001",
    "beneficiary": "ES00-FAKE-9001",
    "amount": "120.50",
    "currency": "EUR",
    "reference": "Pago de ejemplo"
  }
  ```

  `amount` se envía como string decimal, positivo y con hasta dos decimales; cuentas y beneficiario tienen máximo 34 caracteres, moneda son tres letras mayúsculas y referencia hasta 140 caracteres. Responde `201` con el pago y estado `COMPLETED` o `REJECTED`. La clave repetida con la misma cuenta, beneficiario e importe reproduce el pago original; reutilizarla para una solicitud distinta da `409`. Una clave ausente o una solicitud inválida da `400`.
- `GET /api/v1/payments/{id}`: obtiene por UUID; `404` si no existe.
- `GET /api/v1/payments?account=<cuenta>&page=0&size=20`: lista los pagos de la cuenta de origen, más recientes primero. `account` es obligatorio; paginación comienza en cero.

Los errores se devuelven como `application/problem+json`. La API no implementa autenticación ni autorización: no exponerla públicamente.

## Diseño, integración y persistencia

El backend separa entrada HTTP (`api`), casos de uso (`application`), dominio (`domain`) e infraestructura (`infrastructure`). `PaymentGateway` y `PaymentRepository` son puertos del dominio; sus adaptadores actuales son `FakePaymentGateway` y `JdbcPaymentRepository` con `JdbcTemplate`. El frontend organiza componentes con Atomic Design; `src/services/paymentsApi.ts` realiza la llamada HTTP y usa el proxy Vite en desarrollo.

El gateway ficticio rechaza un importe estrictamente superior a `PAYMENTS_FAKE_LIMIT`; los importes hasta el umbral se aprueban. El umbral predeterminado es `10000.00`. Para integrar un proveedor real, debe añadirse un adaptador seguro de `PaymentGateway` y configurar credenciales fuera del código. Antes de producción se requieren, entre otros aspectos, autenticación/autorización, control de fraude y saldo, manejo de fallos/reintentos del proveedor, monitoreo y pruebas de integración.

PostgreSQL conserva los pagos en `payment`: importe `NUMERIC(19,2)`, UUID, estado y fecha; clave de idempotencia única e índices para buscar por cuenta/fecha. Flyway aplica migraciones; el seed contiene únicamente cuentas y transacciones ficticias. La persistencia JDBC usa parámetros para los valores SQL. Para desarrollo la idempotencia sobrevive reinicios porque la clave se guarda en base de datos.

## Límites conocidos

El proveedor es simulado y no se ejecutan cargos. No hay autenticación/autorización, verificación de fondos, soporte de pagos programados ni conversión multimoneda. Antes de producción hacen falta revisión de seguridad y privacidad, configuración/observabilidad operativa y pruebas con PostgreSQL y el proveedor real.
