# Transacción de tarjetas

Aplicación de demostración para registrar pagos/cargos sobre tarjetas. Está formada por una interfaz Angular standalone y una API Java 17 con Quarkus 3.20.2. PostgreSQL conserva tarjetas ficticias y transacciones; no se almacena el PAN completo. **No es un sistema listo para producción**: autenticación y procesador de tarjetas están simulados.

## Requisitos

- JDK 17 y Maven 3.9 o compatible.
- Node.js compatible con Angular 21 (Node.js 20.19+, 22.12+ o 24+) y npm.
- PostgreSQL accesible para ejecutar la aplicación. Las pruebas backend actuales no requieren base de datos.

## Compilar y probar

Desde la raíz del repositorio:

```sh
cd backend
mvn test
mvn package
cd ../frontend
npm install
npm test
npm run build
```

`mvn test` ejecuta pruebas JUnit del dominio y servicio con un repositorio falso en memoria. `npm test` ejecuta las pruebas Angular/Vitest una vez, sin modo watch ni navegador. `npm run build` genera el build de producción. El build de Maven también ejecuta las pruebas configuradas por Surefire.

## Configurar y ejecutar en desarrollo

### 1. PostgreSQL y backend

Cree una base de datos PostgreSQL llamada `tarjetas` y un usuario con permisos de conexión, creación/uso de tablas e índices. Configure las variables de entorno en la terminal donde se iniciará Quarkus; no hay archivo `.env.example` en este repositorio:

| Variable | Valor por defecto / uso |
|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/tarjetas` |
| `DB_USER` | `tarjetas` |
| `DB_PASSWORD` | Contraseña del usuario PostgreSQL; configure la propiedad correspondiente de Quarkus en el entorno. No se documenta ni incorpora una contraseña en el repositorio. |
| `PORT` | `8080` |
| `DB_POOL_MAX` | `10` conexiones máximas del pool |
| `CORS_ORIGINS` | `http://localhost:4200` |
| `TARJETAS_STUB_LIMITE` | `5000.00` |
| `LOG_LEVEL` | `INFO` |

La configuración de datasource está en `backend/src/main/resources/application.properties`. Antes de arrancar, asegúrese de que `quarkus.datasource.password` esté enlazada a la contraseña elegida (por ejemplo, mediante la configuración externa de Quarkus `QUARKUS_DATASOURCE_PASSWORD`); no la escriba en el control de versiones.

```sh
cd backend
mvn quarkus:dev
```

Flyway aplica al inicio las migraciones `V1__esquema.sql` y `V2__datos_ficticios.sql`. La semilla incluye tarjetas ficticias para `cli-001` y `cli-002` y dos transacciones iniciales para la primera tarjeta de `cli-001`. Para reiniciar los datos de demostración, use una base de datos descartable nueva; no vuelva a ejecutar manualmente las migraciones ya registradas.

### 2. Angular

En otra terminal:

```sh
cd frontend
npm install
npm start
```

Abra <http://localhost:4200>. El servidor de desarrollo configura `proxy.conf.json`: las llamadas `/api` se reenvían a `http://localhost:8080`. Para cambiar el origen permitido por CORS del backend, defina `CORS_ORIGINS` apropiadamente.

## API y flujo

El frontend usa `/api` como base y envía `X-Cliente-Id: cli-001` como identidad demo. El backend lo requiere para las rutas de tarjetas; en una integración real debe derivarse de una sesión/token validado y no aceptarse como identidad confiable desde el cliente.

- `GET /api/tarjetas` — tarjetas del cliente, mostrando solo identificador, últimos cuatro, tipo y estado.
- `POST /api/tarjetas/{id}/transacciones` — registra el cargo. Requiere `X-Cliente-Id`, `Idempotency-Key` (1–64 caracteres) y JSON `{ "monto": 12.50, "moneda": "USD" }`. Devuelve `201` al registrar y `200` al repetir la clave para la misma tarjeta; tarjeta ausente o ajena produce `404`, regla de negocio `422` (`application/problem+json`).
- `GET /api/tarjetas/{id}/transacciones?limite=20` — historial más reciente. El límite se acota entre 1 y 100.

Monedas habilitadas: `USD`, `EUR`, `PEN`. El monto debe ser positivo, con hasta dos decimales, y no superar `1,000,000.00`. Las tarjetas bloqueadas no pueden operar. El stub aprueba montos menores o iguales a `TARJETAS_STUB_LIMITE` y rechaza montos superiores. La clave idempotente se conserva en la base de datos y está restringida a nivel global por una restricción `UNIQUE`; úsese una clave nueva para cada intento lógico.

## Integración y persistencia

La API separa entrada (`api`), casos de uso (`application`), dominio (`domain`) y adaptadores (`infrastructure`). `TransaccionRepository` abstrae la persistencia y `ProcesadorTarjetasGateway` el procesador. `JdbcTransaccionRepository` usa JDBC con `PreparedStatement`; Flyway versiona el esquema PostgreSQL, con montos `NUMERIC(15,2)`, UUID para transacciones, unicidad de clave idempotente e índice de historial por tarjeta/fecha.

`StubProcesadorGateway` no se conecta a una red de pagos. Para integrar un proveedor real, implementar/sustituir el adaptador del puerto `ProcesadorTarjetasGateway` y configurar sus credenciales fuera del repositorio. Antes de producción deben añadirse autenticación/autorización real, protección de secretos, controles operativos y pruebas de integración contra PostgreSQL/proveedor. El `X-Cliente-Id` del frontend es fijo para la demo, no autenticación.

## Estructura

- `backend/`: API Quarkus, modelo y servicio, adaptadores JDBC/stub, migraciones Flyway y pruebas JUnit.
- `frontend/`: aplicación Angular, servicio HTTP, interfaz por componentes y pruebas Vitest.
