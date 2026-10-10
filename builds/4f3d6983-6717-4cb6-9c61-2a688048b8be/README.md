# Notificaciones de cuentas

Aplicación de ejemplo de banca por Internet: Angular 20, Java 17+ con Quarkus 3.15 y PostgreSQL. Los registros incluidos son ficticios. La interfaz usa Atomic Design (atoms, molecules, organisms, templates y pages).

## Requisitos

- Node.js compatible con Angular 20 y npm.
- JDK 17+ y Maven 3.9+.
- PostgreSQL 16 (o compatible) accesible desde el backend.

## Arranque local

En una terminal, inicia PostgreSQL. Ejemplo con Docker (solo para desarrollo):

```sh
docker run --rm --name notificaciones-db \
  -e POSTGRES_DB=notificaciones \
  -e POSTGRES_USER=notificaciones \
  -e POSTGRES_PASSWORD=notificaciones-dev \
  -p 5432:5432 postgres:16
```

En otra terminal, configura la conexión y arranca Quarkus en modo desarrollo:

```sh
cd backend
export DB_URL=jdbc:postgresql://localhost:5432/notificaciones
export DB_USER=notificaciones
export DB_PASSWORD=notificaciones-dev
mvn quarkus:dev
```

En Windows PowerShell usa `$env:DB_URL=...` en lugar de `export`. Quarkus escucha por defecto en `http://localhost:8080`. Al inicio Flyway aplica las migraciones pendientes. Comprueba el estado en `http://localhost:8080/q/health`.

En otra terminal, inicia Angular:

```sh
cd frontend
npm install
npm start
```

Abre `http://localhost:4200`. La URL base de la API se configura en `frontend/src/environments/environment.ts` (`apiBaseUrl`, predeterminada a `http://localhost:8080`). CORS permite por defecto el origen local `http://localhost:4200`.

## Compilar y probar

Backend, desde `backend/`:

```sh
mvn test
mvn package
```

Las pruebas `NotificationServiceTest` son unitarias y no requieren PostgreSQL. Para ejecutar la aplicación empacada, con PostgreSQL activo y las variables de conexión configuradas:

```sh
java -jar target/quarkus-app/quarkus-run.jar
```

Frontend, desde `frontend/`:

```sh
npm test
npm run build
```

`npm test` ejecuta las pruebas Angular/Vitest sin modo interactivo (`ng test --watch=false`). `npm run build` genera la salida de producción bajo `dist/`.

## Persistencia

Quarkus usa Hibernate ORM y el driver JDBC de PostgreSQL; la generación automática del esquema está deshabilitada. Flyway ejecuta al arrancar las migraciones de `backend/src/main/resources/db/migration/`:

- `V1__schema.sql`: crea `account`, `notification` y `notification_preference`, restricciones e índices para listar notificaciones por cuenta/fecha y filtrar no leídas.
- `V2__seed_ficticio.sql`: agrega cuentas y notificaciones demostrativas ficticias (ACC-001 y ACC-002), además de preferencias. Para una base local nueva se aplican automáticamente; no es necesario cargar el seed manualmente. Flyway no vuelve a aplicar versiones ya registradas.

La base de datos y sus migraciones son la persistencia de la aplicación; los repositorios JPA encapsulan las consultas. Configure `DB_URL`, `DB_USER` y `DB_PASSWORD` en el entorno y no almacene credenciales reales en el código ni en el repositorio. Valores configurables y predeterminados: `DB_URL=jdbc:postgresql://localhost:5432/notificaciones`, `DB_USER=notificaciones`, `DB_PASSWORD` vacío, `PORT=8080`, `CORS_ORIGINS=http://localhost:4200`, `LOG_LEVEL=INFO`. Use una contraseña segura fuera del entorno local.

## API e integración

El frontend consume la API REST JSON del backend en `/api/v1`:

- `GET /accounts/{accountId}/notifications?unread=false&page=0&size=20`: lista paginada; `unread=true` filtra pendientes.
- `PATCH /notifications/{id}/read`: marca como leída.
- `GET /accounts/{accountId}/notification-preferences`: obtiene preferencias.
- `PUT /accounts/{accountId}/notification-preferences`: actualiza preferencias enviando una lista JSON.

Los errores de dominio se traducen a respuestas JSON con `code` y `message`; pueden incluir 400, 404 y 409 según el caso. El cliente usa `NotificationService` y el origen configurable en `environment.ts`. Para probar los registros seed, usa `ACC-001` o `ACC-002` como cuenta.

`NotificationChannel` abstrae el canal de entrega y actualmente solo existe `InAppChannel`. No se integran proveedores de email/SMS/push ni un core bancario/event bus; los ejemplos proceden del seed. No hay endpoint público para generar notificaciones.

## Límites conocidos

La API de demostración no implementa autenticación/autorización ni comprueba que una cuenta pertenezca al usuario solicitante: no exponerla en producción sin incorporar identidad y autorización (mitigar IDOR). No hay configuración de despliegue productivo ni pruebas de integración con una instancia real de PostgreSQL en este repositorio.
