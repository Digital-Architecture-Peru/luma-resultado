# Notificaciones de cuentas

Aplicación de demostración para consultar notificaciones de cuentas y administrar preferencias. Stack: Angular 17, Java 17 / Spring Boot 3.3 y PostgreSQL. Los datos de seed son ficticios. **No es apta para producción**: no implementa autenticación ni autorización; la cuenta fija `10001234` del frontend es solo para demostración.

## Requisitos

- Node.js y npm compatibles con Angular CLI 17.
- JDK 17 y Maven 3.6.3 o posterior.
- PostgreSQL accesible desde el backend.

## Configurar PostgreSQL

Crea una base de datos `notificaciones` y un usuario de desarrollo `notif_app` con permisos para crear tablas y escribir datos. Por ejemplo, desde una sesión administrativa de PostgreSQL:

```sql
CREATE USER notif_app WITH PASSWORD 'elige-una-clave-local';
CREATE DATABASE notificaciones OWNER notif_app;
```

La clave del ejemplo es local: no la guardes en el repositorio. El backend lee configuración por entorno:

| Variable | Predeterminado | Descripción |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/notificaciones` | URL JDBC |
| `DB_USER` | `notif_app` | Usuario PostgreSQL |
| `DB_PASSWORD` | vacío | Contraseña PostgreSQL |
| `PORT` | `8080` | Puerto HTTP del backend |
| `CORS_ORIGIN` | `http://localhost:4200` | Origen permitido por CORS |
| `LOG_LEVEL` | `INFO` | Nivel de logging raíz |

Configura `DB_PASSWORD` en el entorno local antes de iniciar la aplicación. No se requiere configurar credenciales para las pruebas unitarias indicadas abajo.

## Ejecutar en desarrollo

Inicia primero el backend; requiere que PostgreSQL esté en ejecución:

```sh
cd backend
# Define DB_PASSWORD y, si corresponde, DB_URL / DB_USER en el entorno.
mvn spring-boot:run
```

En otra terminal inicia Angular:

```sh
cd frontend
npm install
npm start
```

Abre <http://localhost:4200>. El servidor de desarrollo Angular usa `proxy.conf.json` para reenviar `/api` a `http://localhost:8080`, evitando configurar una URL distinta en el cliente.

## Compilar y probar

Backend, desde `backend/`:

```sh
mvn test
mvn package
```

Frontend, desde `frontend/`:

```sh
npm install
npm test       # Jest en modo CI, no interactivo
npm run build  # Angular CLI y comprobación de tipos
```

Las pruebas backend son pruebas unitarias de servicios y dominio; no necesitan PostgreSQL. Las pruebas frontend usan Jest. Para probar la aplicación integrada sí hacen falta PostgreSQL, el backend y el servidor Angular. No se afirma aquí que los comandos hayan sido ejecutados en este entorno.

## API

La API tiene prefijo `/api/v1`:

- `GET /accounts/{accountId}/notifications?status=ALL|UNREAD&page=0&size=20` — lista notificaciones. `page` empieza en cero; `size` permitido de 1 a 100.
- `PATCH /notifications/{id}/read` — marca como leída; `{id}` es UUID.
- `GET /accounts/{accountId}/notification-preferences` — consulta preferencias.
- `PUT /accounts/{accountId}/notification-preferences` — actualiza preferencias. Ejemplo de JSON:

```json
{
  "lowBalanceThreshold": 100.00,
  "depositEnabled": true,
  "withdrawalEnabled": true
}
```

Los identificadores de cuenta aceptan entre 4 y 20 caracteres alfanuméricos. Los errores controlados se devuelven como `application/problem+json`. Las cuentas se presentan enmascaradas en las respuestas de notificación.

Para probar con los datos iniciales, utiliza la cuenta `10001234`. El seed también incluye la cuenta ficticia `20005678`.

## Persistencia e integración

Spring JDBC accede a PostgreSQL mediante `NamedParameterJdbcTemplate`, detrás de los puertos de repositorio del dominio. Flyway aplica al arrancar las migraciones versionadas en `backend/src/main/resources/db/migration`: `V1` crea `account_notification` y `notification_preference` e índices asociados; `V2` añade datos ficticios. Flyway registra las migraciones aplicadas y no vuelve a insertar el seed en cada inicio normal. Los cambios de esquema deben añadirse como nuevas migraciones, no editando migraciones ya aplicadas.

La integración con el origen de eventos de banca y con un canal real de entrega aún no está definida. `NotificationService.register` es el punto de entrada previsto para eventos; el adaptador `LoggingDispatcher` solo registra y no envía notificaciones. La conexión a dichos sistemas requiere definir contratos, configuración y tratamiento de fallos antes de desplegar.

## Pendientes de seguridad para producción

Integrar identidad/autorización de la banca en lugar de confiar en la cuenta fija de demostración. Además, la operación `PATCH /notifications/{id}/read` no recibe ni valida la pertenencia a una cuenta autenticada: debe incorporarse esa comprobación antes de exponerla a usuarios reales. Configurar credenciales seguras y CORS según cada entorno, y definir el proveedor real de eventos y despacho.
