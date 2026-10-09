# Consulta de Tarjetas · Banca por Internet

Aplicación Full Stack de solo lectura para consultar tarjetas y su detalle. El frontend está construido con React + TypeScript + Vite; el backend usa Java 17, Quarkus 3.15 y PostgreSQL.

## Requisitos

- Java 17 y Maven 3.9 o compatible.
- Node.js 18+ y npm.
- PostgreSQL 13+ para ejecutar el backend y las migraciones.

## Estructura

- `frontend/`: interfaz React, componentes organizados con Atomic Design y cliente HTTP.
- `backend/`: API REST Quarkus, separada en API, aplicación, dominio e infraestructura Panache.
- `backend/src/main/resources/db/migration/`: migraciones Flyway versionadas: `V1` crea el esquema y `V2` inserta datos ficticios.

## Base de datos

Crea una base de datos PostgreSQL llamada `tarjetas` y un usuario con permisos para crear tablas e índices y ejecutar migraciones. Por ejemplo, en una instalación local, crea ambos mediante las herramientas administrativas de PostgreSQL. Configura las variables de conexión antes de arrancar:

```sh
export QUARKUS_DATASOURCE_JDBC_URL=jdbc:postgresql://localhost:5432/tarjetas
export QUARKUS_DATASOURCE_USERNAME=tu_usuario
export QUARKUS_DATASOURCE_PASSWORD=tu_clave
```

La URL local por defecto está configurada para `localhost:5432/tarjetas`; usuario y contraseña deben suministrarse mediante el entorno. Hibernate no genera el esquema. Flyway ejecuta automáticamente las migraciones al iniciar la aplicación. No vuelvas a insertar manualmente el seed: Flyway administra su historial. Las migraciones incorporan registros sintéticos, incluidos tres para el cliente de desarrollo `11111111-1111-1111-1111-111111111111`.

## Backend: compilar, probar y ejecutar

```sh
cd backend
mvn test
mvn package
mvn quarkus:dev
```

`mvn test` ejecuta las pruebas de servicio y recurso definidas en `src/test`; están diseñadas para correr sin PostgreSQL. `mvn package` compila y empaqueta la aplicación. El modo dev inicia Quarkus, conecta a PostgreSQL y aplica Flyway. La API queda en `http://localhost:8080`.

Variables opcionales:

- `CORS_ORIGINS`: origen permitido por CORS; por defecto `http://localhost:5173`.
- `LOG_LEVEL`: nivel de logging; por defecto `INFO`.

## Frontend: instalar, probar y ejecutar

En otra terminal, desde la raíz del repositorio:

```sh
cd frontend
npm install
npm test
npm run build
npm run dev
```

`npm test` ejecuta Vitest en modo no interactivo y `npm run build` realiza el chequeo TypeScript (`tsc --noEmit`) y genera el bundle Vite. El servidor local de Vite normalmente queda en `http://localhost:5173`.

La configuración puede establecerse en `frontend/.env` (no se necesita incluir credenciales):

```dotenv
VITE_API_BASE_URL=http://localhost:8080
VITE_CLIENTE_ID=11111111-1111-1111-1111-111111111111
```

Si no se definen, el frontend usa esos mismos valores por defecto. `VITE_CLIENTE_ID` solo permite probar el seed ficticio; no es una identidad autenticada.

## Integración API

El frontend llama al backend mediante `fetch`, con `Accept: application/json` y la cabecera `X-Cliente-Id`:

- `GET /api/v1/tarjetas` devuelve la lista de resúmenes (`200`).
- `GET /api/v1/tarjetas/{id}` devuelve el detalle (`200`) o `404` si no existe para ese cliente.
- Una cabecera `X-Cliente-Id` ausente o inválida produce `400`; los errores usan `application/problem+json`.

Ejemplo de consulta local:

```sh
curl -H 'X-Cliente-Id: 11111111-1111-1111-1111-111111111111' \
  http://localhost:8080/api/v1/tarjetas
```

Para consultar detalle, sustituye el path por `/api/v1/tarjetas/aaaaaaaa-0000-0000-0000-000000000001`. La configuración CORS permite `GET` y `OPTIONS`, y `Content-Type` y `X-Cliente-Id`; ajusta `CORS_ORIGINS` al origen del frontend cuando sea distinto.

## Persistencia y límites de seguridad

La persistencia está detrás del contrato `TarjetaRepository`, implementado por `PanacheTarjetaRepository` sobre PostgreSQL. Las consultas filtran por cliente; el servicio no debe exponer tarjetas de otros clientes. Los importes se transportan como strings decimales. La base solo almacena los últimos cuatro dígitos: no contiene PAN completo, CVV ni PIN. Todos los registros de migración son ficticios.

**La integración de identidad real está pendiente.** `X-Cliente-Id` es únicamente un sustituto de desarrollo controlable por el solicitante, no autenticación ni autorización segura. No desplegar así en producción. En un entorno real, validar la sesión/token y obtener la identidad del cliente de una fuente confiable en el backend, sin aceptar el identificador del cliente directamente desde el navegador.

## Verificación

Los comandos anteriores describen las pruebas disponibles en cada módulo. El backend requiere PostgreSQL para el arranque integrado; las pruebas unitarias se ejecutan sin esa base. El frontend valida las llamadas mediante pruebas Vitest con respuestas simuladas. La ejecución de estos comandos debe realizarse en un entorno que tenga instaladas las herramientas indicadas.
