# Transacción de pagos

Aplicación de demostración para pagos: **Angular 17**, **Java 17 / Spring Boot 3.3** y **PostgreSQL 16**. Todos los datos del seed son ficticios. No es un sistema bancario listo para producción: la autenticación y la integración con un procesador real están fuera de alcance.

## Requisitos

- Java 17 y Maven 3.6 o posterior.
- Node.js compatible con Angular 17 (Node.js 18.13+ o 20.9+) y npm.
- Docker con Docker Compose, para levantar PostgreSQL local.

## Configuración y ejecución local

Desde la raíz del repositorio, configure credenciales de desarrollo para el contenedor. No use credenciales reales:

```bash
export DB_USER=payments_dev
export DB_PASSWORD=payments_dev_local
 docker compose up -d postgres
```

Elimine el espacio inicial antes de `docker` si copia el bloque en un shell que lo rechace. Para configurar el backend, abra otra terminal (o continúe en la misma) y ejecute:

```bash
export DB_URL=jdbc:postgresql://localhost:5432/payments
export DB_USER=payments_dev
export DB_PASSWORD=payments_dev_local
cd backend
mvn spring-boot:run
```

El servicio escucha en `http://localhost:8080` de forma predeterminada. `PORT` permite cambiar el puerto. Al iniciar, Flyway ejecuta las migraciones versionadas `V1__schema.sql` (tablas e índices) y `V2__seed_ficticio.sql` (cuentas ficticias); `spring.datasource` obtiene URL, usuario y contraseña de `DB_URL`, `DB_USER` y `DB_PASSWORD`. `LOG_LEVEL` configura el nivel raíz de logging (por defecto `INFO`).

En una terminal aparte, desde la raíz:

```bash
cd frontend
npm install
npm start
```

Angular queda disponible normalmente en `http://localhost:4200`. El servidor de desarrollo reenvía `/api` a `http://localhost:8080` mediante `frontend/proxy.conf.json`; mantenga el backend en ejecución. La interfaz carga las cuentas y permite crear un pago y ver su comprobante.

## Compilar y probar

Backend, desde `backend/`:

```bash
mvn test
mvn package
```

Las pruebas Maven incluyen pruebas unitarias del servicio y del gateway ficticio, además de pruebas del controlador. Para iniciar después de empaquetar, use `mvn spring-boot:run` (con la base configurada), o ejecute el JAR generado en `target/` con las mismas variables de entorno.

Frontend, desde `frontend/`:

```bash
npm install
npm test
npm run build
```

`npm test` ejecuta Jest en modo CI, sin modo interactivo; `npm run build` compila la aplicación Angular. El backend necesita PostgreSQL disponible para arrancar, aunque las pruebas unitarias están diseñadas para ejecutarse sin una base real.

## API e integración

La API base es `/api/v1`:

- `GET /api/v1/accounts` devuelve las cuentas del cliente.
- `POST /api/v1/payments` crea un pago. Requiere `Idempotency-Key` y un JSON como:

  ```json
  {
    "sourceAccountId": "11111111-1111-4111-8111-111111111111",
    "targetAccount": "EC00-9000-1234",
    "amount": 25.50,
    "currency": "USD",
    "reference": "Pago de prueba"
  }
  ```

  Responde `201 Created` con el pago (`COMPLETED` o `REJECTED` en el adaptador actual). El monto debe ser positivo, tener como máximo dos decimales; la moneda debe tener tres letras mayúsculas y el destino 6–34 caracteres alfanuméricos o guiones.
- `GET /api/v1/payments/{id}` consulta un pago.
- `GET /actuator/health` expone el estado de salud.

La identidad no está autenticada en esta demo. Las rutas aceptan `X-Customer-Id` y, si falta, usan `CUST-001`. Para probar otro cliente, envíe esa cabecera explícitamente. No exponga esta simulación como mecanismo de autorización.

Los errores HTTP se representan como `application/problem+json`. Las validaciones devuelven 400; recursos inexistentes 404; conflictos de idempotencia o concurrencia 409; saldo insuficiente 422.

La integración externa está abstraída por el puerto `PaymentGateway`. `FakePaymentGateway` es determinista: rechaza cuentas destino terminadas en `0000` y autoriza las demás. Sustituirlo por una integración real requiere implementar el puerto, definir credenciales seguras mediante configuración externa y gestionar autenticación, tiempos de espera, reintentos, conciliación y tratamiento de resultados inciertos. Nada de eso se simula como una conexión real en este repositorio.

## Persistencia y garantías

La persistencia usa PostgreSQL mediante `JdbcTemplate`; las consultas usan parámetros y Flyway mantiene el esquema. `account` almacena propietario, moneda, saldo y versión; `payment` registra el origen, destino, monto, estado, referencia y fecha. Los importes usan `NUMERIC(19,2)`. Hay una clave de idempotencia única y una actualización del saldo condicionada por versión para detectar escrituras concurrentes. Las restricciones e índices están definidos en `backend/src/main/resources/db/migration/`.

El seed contiene dos cuentas para `CUST-001` y una para `CUST-002`, con saldos ficticios. Para inspeccionar el estado del contenedor, use `docker compose ps` y `docker compose logs postgres`. Para detener PostgreSQL sin borrar los datos: `docker compose down`. Para reiniciar desde cero y volver a cargar el seed, borre explícitamente el volumen local con `docker compose down -v` y levante el servicio de nuevo; esto elimina los datos guardados localmente.

## Organización

- `backend/`: dominio, aplicación/puertos y adaptadores Spring Web, JDBC y gateway.
- `frontend/`: componentes Angular y servicio HTTP para `/api/v1`.
- `docker-compose.yml`: PostgreSQL de desarrollo local; toma usuario y contraseña del entorno.
