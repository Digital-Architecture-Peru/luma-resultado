# Consulta de Tarjetas

Aplicación de solo lectura para tarjetas: **Angular 17** en el frontend, **Java 17 / Quarkus 3.15.1** en la API y **PostgreSQL** para persistencia. Los registros de ejemplo son ficticios. La aplicación no almacena el PAN completo.

## Estructura

- `frontend/`: aplicación Angular standalone; componentes organizados por Atomic Design.
- `backend/`: API REST Quarkus; resource → servicio de consulta → puerto `CardRepository` → adaptador Panache.
- `backend/src/main/resources/db/migration/`: esquema y datos ficticios administrados por Flyway.

## Requisitos

- JDK 17 y Maven.
- Node.js compatible con Angular CLI 17 y npm.
- PostgreSQL accesible para ejecutar el backend en modo desarrollo.
- Chrome/Chromium disponible para las pruebas Angular con Karma `ChromeHeadless`.

## Persistencia y configuración

El backend usa PostgreSQL. Flyway aplica automáticamente al iniciar las migraciones `V1__schema.sql` y `V2__seed_ficticio.sql`; Hibernate no genera el esquema. La tabla `card` guarda `pan_last4` y un token, no el PAN completo, además de montos `NUMERIC(15,2)`. El seed contiene tarjetas ficticias para `cust-001` y `cust-002`.

Configura el acceso mediante variables de entorno (los valores no deben contener credenciales reales en el repositorio):

| Variable | Uso | Predeterminado de desarrollo |
|---|---|---|
| `DB_URL` | URL JDBC de PostgreSQL | `jdbc:postgresql://localhost:5432/cards` |
| `DB_USER` | Usuario de base | `cards_app` |
| `DB_PASSWORD` | Contraseña de base | No se documenta ni incluye aquí; definirla en el entorno local |
| `PORT` | Puerto HTTP de Quarkus | `8080` |
| `LOG_LEVEL` | Nivel de log | `INFO` |

Antes de iniciar, crea la base `cards` y el usuario correspondiente en PostgreSQL, y exporta `DB_USER` y `DB_PASSWORD` de acuerdo con esa instalación. No hay Dev Services; la base debe estar disponible. Flyway necesita permisos para crear la tabla e índices y registrar las migraciones.

## API e integración

Base local: `http://localhost:8080/api/v1`.

| Método | Ruta | Resultado |
|---|---|---|
| `GET` | `/cards` | Lista de tarjetas del cliente: alias, marca, tipo, estado y PAN enmascarado. |
| `GET` | `/cards/{cardId}` | Detalle de la tarjeta: límite, disponible, moneda, corte y vencimiento. |
| `GET` | `/q/health` | Estado de salud de Quarkus. |

La API espera `X-Customer-Id`; Angular envía `cust-001` desde `frontend/src/environments/environment.ts`. La consulta de detalle limita los resultados al cliente indicado y responde como no encontrado si el registro no existe o pertenece a otro cliente, evitando revelar tarjetas ajenas. Los errores se mapean a `application/problem+json`.

En `%dev`, CORS permite el origen `http://localhost:4200` y los métodos `GET`/`OPTIONS`. El servicio Angular apunta a `http://localhost:8080/api/v1`. Para cambiar ese origen de desarrollo, actualiza `apiBaseUrl` en el environment Angular. No existe integración con un proveedor externo de identidad: `X-Customer-Id` es un mecanismo de demostración, no autenticación. Antes de un uso real, debe obtenerse la identidad del sujeto autenticado (por ejemplo, `sub` de un token OIDC validado en backend), eliminar la identidad elegible por cliente desde el navegador y configurar CORS y gateway para el despliegue.

## Compilar y ejecutar

### Backend

Desde la raíz del repositorio:

```bash
cd backend
mvn test
mvn package
mvn quarkus:dev
```

`mvn test` ejecuta las pruebas unitarias existentes; no requiere conectar PostgreSQL para esas pruebas. `mvn package` construye el artefacto. `mvn quarkus:dev` requiere PostgreSQL y las variables `DB_USER`/`DB_PASSWORD` configuradas. Quarkus escucha en el puerto indicado por `PORT` (por defecto 8080) y Flyway migra al arrancar.

### Frontend

En otra terminal, desde la raíz:

```bash
cd frontend
npm install
npm test
npm run build
npm start
```

`npm test` ejecuta Karma/Jasmine en modo no interactivo con ChromeHeadless. `npm run build` genera la aplicación; `npm start` sirve el modo de desarrollo en `http://localhost:4200`. Para que la UI pueda consultar datos, el backend debe estar ejecutándose y accesible.

## Pruebas

Las pruebas backend incluyen DTO, servicio de consulta y enmascarado de PAN. Las pruebas frontend cubren el servicio HTTP, componentes y página de tarjetas. El frontend requiere Chrome/Chromium para su comando de pruebas. Las instrucciones describen los comandos configurados en los manifiestos; no implican que se hayan ejecutado en este entorno.

## Seguridad y límites

Los datos de la migración son ficticios. No usar los datos ni el mecanismo `X-Customer-Id` como seguridad de producción. Mantener secretos fuera del control de versiones y suministrarlos mediante un gestor de secretos o el entorno de despliegue. La solución no define despliegue ni integración externa de identidad.
