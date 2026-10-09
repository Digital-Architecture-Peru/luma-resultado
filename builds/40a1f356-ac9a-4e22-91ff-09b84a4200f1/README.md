# Consulta de cuentas

Aplicación de consulta **solo lectura**: frontend Angular 17 y API REST Spring Boot 3 / Java 17, con PostgreSQL y migraciones Flyway. El cliente muestra las cuentas del cliente configurado y permite consultar listado paginado y detalle. Los números de cuenta se enmascaran en las respuestas.

## Requisitos

- Java 17 y Maven 3.6 o superior.
- Node.js compatible con Angular 17 (Node 18.13+ o 20.9+) y npm.
- PostgreSQL accesible para la API.

## Persistencia y configuración

La aplicación requiere PostgreSQL. Cree una base de datos (por ejemplo `banca`) y un usuario con permisos para conectar, crear/actualizar el esquema y leer/escribir las tablas. No almacene credenciales reales en el repositorio. La configuración se toma de variables de entorno del proceso que ejecuta Spring Boot:

| Variable | Predeterminado | Uso |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/banca` | URL JDBC |
| `DB_USER` | `banca_app` | Usuario de la base |
| `DB_PASSWORD` | vacío | Contraseña |
| `DB_POOL_SIZE` | `5` | Máximo de conexiones Hikari |
| `SERVER_PORT` | `8080` | Puerto HTTP de la API |
| `CORS_ORIGENES` | `http://localhost:4200` | Orígenes permitidos |
| `LOG_LEVEL` | `INFO` | Nivel raíz de logging |

`backend/env.example.txt` es una referencia de nombres y valores de desarrollo; no es un archivo de configuración cargado automáticamente por Maven/Spring. Exporte las variables en el entorno de ejecución. Configure una contraseña segura localmente y no la agregue al control de versiones.

Flyway aplica automáticamente `backend/src/main/resources/db/migration/V1__crear_cuenta.sql` y `V2__datos_ficticios.sql` al iniciar el backend. V1 crea la tabla `cuenta`, sus restricciones e índice de cliente; V2 inserta registros ficticios para `CLI-0001` y `CLI-0002`. En una base de datos de desarrollo vacía, las migraciones inicializan el esquema y los datos. No edite migraciones ya aplicadas: agregue una nueva versión. JPA tiene `ddl-auto: none`, así que Flyway es responsable del esquema.

## Compilar y probar

Ejecute desde la raíz, en terminales independientes según corresponda:

```sh
cd backend
mvn test
mvn package
```

Las pruebas del backend usan JUnit/Mockito y Spring Boot Test; `mvn package` también las ejecuta. Las pruebas unitarias/web no sustituyen una prueba de integración contra PostgreSQL.

```sh
cd frontend
npm install
npm test
npm run build
```

Jest ejecuta las pruebas del frontend en modo CI; el build incluye comprobación TypeScript y compilación Angular. Para instalaciones repetibles, use `npm ci` cuando exista un `package-lock.json` compatible; actualmente no hay lockfile en el repositorio.

## Ejecutar localmente

1. Asegúrese de que PostgreSQL está iniciado y que la base `banca` existe. Configure `DB_USER` y `DB_PASSWORD` para las credenciales locales.
2. Inicie la API; al arranque Flyway ejecutará las migraciones:

   ```sh
   cd backend
   mvn spring-boot:run
   ```

   API: `http://localhost:8080`; health: `http://localhost:8080/actuator/health`.

3. En otra terminal inicie Angular:

   ```sh
   cd frontend
   npm install
   npm start
   ```

   Abra `http://localhost:4200`. Angular llama a `http://localhost:8080/api/v1` y envía `X-Cliente-Id: CLI-0001`, según `frontend/src/environments/environment.ts`. El origen local está permitido por defecto en CORS.

## Contrato e integración

- `GET /api/v1/cuentas?pagina=0&tamanio=20` lista las cuentas del cliente indicado por la cabecera requerida `X-Cliente-Id`. La página empieza en cero; `tamanio` admite de 1 a 100 y por defecto es 20. El orden es fecha de apertura descendente.
- `GET /api/v1/cuentas/{id}` devuelve el detalle por UUID, únicamente si pertenece al cliente indicado.
- La API devuelve DTOs, no entidades JPA; el número se presenta enmascarado (`****` y los últimos cuatro dígitos). Los errores se exponen mediante `ProblemDetail` (RFC 7807).
- El frontend configura el origen API y el identificador ficticio en `frontend/src/environments/environment.ts`. Para otros entornos, adapte esa configuración del frontend y `CORS_ORIGENES` del backend de forma coordinada.

**Límite importante de seguridad:** `X-Cliente-Id` es un stub de desarrollo, no autenticación. Un consumidor puede modificarlo; el filtrado por cliente en consultas no impide suplantación. No exponga esta aplicación con datos reales ni use estos datos de ejemplo como base de una integración productiva. Antes de producción, integre autenticación/autorización confiable y derive el cliente de la identidad validada, además de configurar TLS, secretos y políticas de despliegue. Movimientos y transferencias no forman parte del alcance.

## Estado de verificación

Este documento describe los comandos definidos por los manifiestos presentes. En el entorno de generación no se ejecutaron Maven, npm, Angular ni PostgreSQL; por tanto compilación, pruebas, conexión y migraciones quedan **sin verificar**.
