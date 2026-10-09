# Consulta de cuentas

Aplicación de consulta de cuentas con Angular 17, Java 17, Quarkus 3.15 y PostgreSQL. La interfaz consume una API REST; el backend persiste y consulta datos mediante Hibernate ORM Panache y Flyway.

## Estructura

- `frontend/`: aplicación Angular standalone, componentes organizados por Atomic Design, cliente HTTP y pruebas Jest.
- `backend/`: API JAX-RS, servicios de dominio, puerto de repositorio y adaptador Panache.
- `backend/src/main/resources/db/migration/`: migraciones SQL versionadas. `V1` crea el esquema; `V2` inserta datos ficticios de desarrollo.
- `docs/variables-entorno.md`: variables de configuración del backend.

## Requisitos

- Java 17 y Maven.
- Node.js y npm compatibles con Angular CLI 17.
- PostgreSQL accesible para ejecutar el backend.

## Compilar y probar

Backend — desde la raíz del repositorio:

```sh
cd backend
mvn package
```

`mvn package` compila y ejecuta las pruebas JUnit 5/Mockito. Las pruebas actuales de servicio y DTO no requieren una base de datos externa.

Frontend:

```sh
cd frontend
npm install
npm run build
npm test
```

`npm test` ejecuta Jest en modo CI, sin modo interactivo. `npm run build` genera la compilación de Angular.

## PostgreSQL, migraciones y persistencia

Crea previamente una base de datos PostgreSQL y configura sus datos de conexión en el entorno del proceso backend. La aplicación usa estas variables (no se incluyen credenciales en el repositorio):

```text
QUARKUS_DATASOURCE_JDBC_URL=jdbc:postgresql://localhost:5432/banca
QUARKUS_DATASOURCE_USERNAME=<usuario configurado en PostgreSQL>
QUARKUS_DATASOURCE_PASSWORD=<contraseña configurada en PostgreSQL>
```

Los valores entre `<...>` son marcadores: sustitúyelos en tu entorno; no los escribas en archivos versionados. Opcionalmente, configura `PORT` (por defecto `8080`), `CORS_ORIGINS` (por defecto `http://localhost:4200`) y `LOG_LEVEL` (por defecto `INFO`). Consulta `docs/variables-entorno.md`.

Al iniciar, Flyway ejecuta las migraciones de `db/migration` (`quarkus.flyway.migrate-at-start=true`). Hibernate no genera ni altera el esquema (`quarkus.hibernate-orm.database.generation=none`). La tabla `cuenta` almacena identificador, cliente, número, tipo, moneda, saldo, estado y fecha de apertura; `V2` añade cuatro registros ficticios para los clientes de demostración `1` y `2`. No son datos reales. Las consultas filtran por cliente; el número de cuenta se enmascara en las respuestas.

## Ejecutar localmente

1. Asegúrate de que PostgreSQL está disponible y configura las variables anteriores en la sesión de terminal.
2. Inicia el backend:

   ```sh
   cd backend
   mvn quarkus:dev
   ```

   La API queda en `http://localhost:8080`; el endpoint de salud de Quarkus está en `/q/health`.
3. En otra terminal, inicia Angular:

   ```sh
   cd frontend
   npm install
   npm start
   ```

   Abre `http://localhost:4200`. El servidor de desarrollo reenvía `/api` a `http://localhost:8080` según `frontend/proxy.conf.json`.

## API e integración

Endpoints de solo lectura:

- `GET /api/v1/cuentas` — lista las cuentas del cliente.
- `GET /api/v1/cuentas/{id}` — busca una cuenta del cliente indicado.

Ambos requieren `X-Cliente-Id`, un entero positivo. Para probar la lista de datos de demostración:

```sh
curl -H 'X-Cliente-Id: 1' http://localhost:8080/api/v1/cuentas
```

Una cabecera ausente o inválida produce `400`; una cuenta inexistente o perteneciente a otro cliente produce `404`. Los errores se representan como `application/problem+json`. CORS permite por defecto el origen local de Angular y los métodos `GET`/`OPTIONS`.

La integración existente es únicamente Angular → API HTTP → servicio/repositorio → PostgreSQL. No hay conexión implementada con core bancario, OIDC, JWT ni otros sistemas. `X-Cliente-Id` es una identidad simulada de demostración, no un control de seguridad: no expongas esta aplicación como servicio bancario real sin autenticación/autorización apropiadas y revisión de seguridad. El cliente Angular actualmente envía el ID de demostración `1`.

## Verificación

Este documento describe los comandos definidos por los manifiestos y el código inspeccionado. No se ejecutaron compilaciones ni pruebas durante la elaboración de esta documentación; ejecútalas localmente para verificar tu entorno.
