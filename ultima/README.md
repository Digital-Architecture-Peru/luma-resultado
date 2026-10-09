# Notificaciones de Tarjetas — Banca por Internet (candidate)

Aplicación de demostración con **React 18 + TypeScript + Vite**, **Java 17 + Spring Boot 3.2 + Maven** y **PostgreSQL**. Los registros de migración son datos ficticios. No se conecta a sistemas bancarios o canales externos.

## Requisitos

- Java 17 y Maven 3.8+ (o usar `./mvnw` si se incorpora un wrapper).
- Node.js 18+ y npm.
- PostgreSQL 14+ para ejecutar el backend. Las pruebas unitarias/API no requieren PostgreSQL.

## Compilar y probar

Desde la raíz del repositorio:

```bash
cd backend
mvn test
mvn package
cd ../frontend
npm install
npm test
npm run build
```

`mvn test` ejecuta JUnit 5/Mockito y pruebas MVC; `npm test` ejecuta Vitest en modo no interactivo. `npm run build` hace primero `tsc --noEmit` y luego el build de Vite. No se afirma que estos comandos hayan sido ejecutados en este entorno.

## Ejecución local e integración

1. Cree una base PostgreSQL `notifications` y configure las variables de conexión. Ejemplo para una instancia local (ajuste usuario/contraseña a su instalación):

   ```sh
   createdb notifications
   export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/notifications
   export SPRING_DATASOURCE_USERNAME=notifications
   export SPRING_DATASOURCE_PASSWORD=''
   ```

   `application.yml` usa esos valores por defecto (URL local, usuario `notifications`, contraseña vacía); para un entorno real establezca credenciales apropiadas fuera del repositorio. Puede cambiar el puerto con `SERVER_PORT` (por defecto `8080`) y el nivel de log con `LOG_LEVEL` (por defecto `INFO`).

2. Inicie el backend, que ejecuta Flyway al arrancar:

   ```sh
   cd backend
   mvn spring-boot:run
   ```

3. En otra terminal, arranque la interfaz:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

   Vite reenvía `/api` a `http://localhost:8080`. Configure `VITE_PROXY_TARGET` si el backend usa otro destino. `VITE_API_BASE_URL` permite indicar una URL base directamente en el cliente; si queda vacía, las peticiones usan rutas relativas y el proxy en desarrollo. `VITE_CUSTOMER_ID` establece el identificador de demostración enviado en `X-Customer-Id` (por defecto `CLI-0001`). Las variables `VITE_*` se incorporan al cliente y no deben contener secretos. Más detalle: [`docs/environment.md`](docs/environment.md).

La API está bajo `/api/v1`: `GET /cards`, `GET /cards/{cardId}/notifications` (filtros `status`, `page`, `size`), `PATCH /notifications/{id}/read` y `GET`/`PUT /cards/{cardId}/notification-preferences`. Todas requieren `X-Customer-Id`. La identidad es únicamente una convención ficticia de demo, **no es autenticación ni autorización suficiente para producción**. El servidor comprueba la propiedad de la tarjeta para las operaciones correspondientes. Los errores se representan como `ProblemDetail`.

## Persistencia e integración de notificaciones

La persistencia usa PostgreSQL mediante `NamedParameterJdbcTemplate`. Flyway aplica `backend/src/main/resources/db/migration/V1__schema.sql` (tablas `card`, `notification`, `notification_preference`, restricciones e índices) y `V2__seed_ficticio.sql` (tarjetas, notificaciones y preferencias de demostración; clientes `CLI-0001` y `CLI-0002`). Las migraciones se aplican automáticamente al iniciar el backend y Flyway registra su estado en `flyway_schema_history`. No se guarda el PAN completo, únicamente los últimos cuatro dígitos. Para reiniciar datos de demo, restaure manualmente la base local y vuelva a iniciarla; no edite migraciones ya aplicadas.

La UI consume la API HTTP a través de `frontend/src/services/notificationsApi.ts`. El puerto de dominio `NotificationPublisher` tiene actualmente solo el adaptador `LoggingNotificationPublisher`: al marcar una notificación como leída se registra un evento de log, no se envía push, correo ni SMS. Las preferencias se guardan, pero no activan entregas. La integración con proveedor externo, credenciales, reintentos y garantías de entrega están fuera del alcance y deben definirse antes de producción.

## Alcance y límites

Datos y canales son ficticios; la cabecera de cliente es deliberadamente una hipótesis para la demostración. No se ha verificado aquí compilación, pruebas ni ejecución de migraciones contra una instancia PostgreSQL real. No usar con información personal o transacciones reales.
