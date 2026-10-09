# Consulta de pagos

Aplicación de consulta de pagos de solo lectura: frontend Angular 17, API Java 17 con Quarkus 3.15 y PostgreSQL. El frontend invoca la API REST mediante HTTP. Los datos de migración son exclusivamente ficticios; no usar esta configuración para producción.

## Requisitos

- Node.js compatible con Angular CLI 17 y npm.
- JDK 17 y Maven 3.9+.
- PostgreSQL compatible (desarrollo local: 14 o superior).

## Ejecutar localmente

### 1. Preparar PostgreSQL

Crea una base y un usuario de desarrollo; por ejemplo, desde `psql` como administrador:

```sql
CREATE USER pagos_app WITH PASSWORD 'cambiar-solo-local';
CREATE DATABASE pagos OWNER pagos_app;
```

Configura las variables para el proceso del backend (no guardes credenciales reales en el repositorio):

```sh
export DB_URL=jdbc:postgresql://localhost:5432/pagos
export DB_USER=pagos_app
export DB_PASSWORD=cambiar-solo-local
```

Quarkus conecta a PostgreSQL y Flyway aplica al arrancar las migraciones `backend/src/main/resources/db/migration/V1__esquema.sql` y `V2__datos_ficticios.sql`. Hibernate ORM no genera ni modifica el esquema. Las migraciones crean la tabla e índices e insertan datos ficticios.

### 2. Iniciar API

En una terminal:

```sh
cd backend
mvn quarkus:dev
```

Por defecto escucha en `http://localhost:8080`. Se puede cambiar con `PORT`. Otras propiedades: `DB_URL`, `DB_USER`, `DB_PASSWORD` y `LOG_LEVEL` (por defecto `INFO`). La configuración define valores locales de conexión para desarrollo; sobrescríbelos por entorno. Nunca uses credenciales de desarrollo en despliegues.

Comprobación de salud: `GET http://localhost:8080/q/health`.

### 3. Iniciar Angular

En otra terminal:

```sh
cd frontend
npm install
npm start
```

Abre la URL que Angular CLI indique (normalmente `http://localhost:4200`). El proxy de desarrollo `frontend/proxy.conf.json` reenvía `/api` al backend en `localhost:8080`, coincidiendo con la base `/api/v1` del frontend. Si se sirve en otro entorno, configura un proxy o gateway que publique `/api` hacia la API; el entorno Angular incluido usa una ruta relativa.

## API

- `GET /api/v1/pagos?cuentaId=...&desde=...&hasta=...&estado=...&page=0&size=20`: consulta paginada y filtrable. Fechas ISO-8601 con zona/UTC; `page` inicia en cero y `size` por defecto es 20 (el servicio valida el rango 1–100).
- `GET /api/v1/pagos/{id}?cuentaId=...`: detalle acotado a la cuenta indicada.

La cuenta devuelta se enmascara en el DTO. Los errores de validación/dominio se serializan como `application/problem+json`. Ejemplo para probar el listado:

```sh
curl 'http://localhost:8080/api/v1/pagos?cuentaId=0012345678901234&page=0&size=20'
```

La cuenta de ejemplo corresponde únicamente al seed ficticio. Las fechas de `desde` y `hasta` deben incluir instante ISO-8601, por ejemplo `2026-10-01T00:00:00Z`.

## Compilar y probar

Desde la raíz:

```sh
(cd backend && mvn test)
(cd backend && mvn package)
(cd frontend && npm test)
(cd frontend && npm run build)
```

Las pruebas backend son de unidad con JUnit/Mockito y no requieren PostgreSQL según el diseño de las pruebas. Las pruebas frontend usan Jest en modo no interactivo. El empaquetado y la aplicación en desarrollo requieren las dependencias indicadas; el arranque de Quarkus requiere PostgreSQL disponible y migraciones aplicables.

## Persistencia, integración y seguridad

La persistencia reside en PostgreSQL mediante Hibernate ORM/Panache. Flyway versiona el esquema y el seed; no se recomienda editar migraciones ya aplicadas: agrega una nueva versión para cambios. El endpoint solo consulta y no expone operaciones de escritura. Se ordena por fecha de pago y se filtra por cuenta, fechas y estado.

La única integración implementada es Angular → REST Quarkus → PostgreSQL; no hay servicios externos. No se implementa autenticación en esta aplicación. `cuentaId` es un parámetro de consulta provisional y **no constituye autorización**: en un despliegue real debe obtenerse la identidad/cuenta autorizada desde un mecanismo confiable (gateway/BFF y/o identidad validada por el backend), además de aplicar controles de acceso. No exponer este servicio directamente con datos reales hasta resolverlo. El enmascaramiento de cuenta en la respuesta no reemplaza autenticación ni autorización.

## Estructura

- `frontend/`: aplicación Angular, componentes de consulta, servicio HTTP, proxy de desarrollo y pruebas Jest.
- `backend/`: API REST, lógica de consulta, repositorio Panache, configuración Quarkus, migraciones Flyway y pruebas Java.
