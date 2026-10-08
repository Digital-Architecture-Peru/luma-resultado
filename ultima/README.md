# Consulta de tarjetas — Angular + Quarkus

Aplicación de consulta de solo lectura: Angular 17, Java 17/Quarkus 3.15 y PostgreSQL. Flyway administra el esquema y los datos ficticios. No se almacena ni expone PAN completo ni CVV.

## Requisitos

Node.js/npm, JDK 17, Maven y PostgreSQL accesible para ejecutar la aplicación.

## Compilar y probar

Desde la raíz:

```sh
cd backend
mvn package
```

Esto compila y ejecuta las pruebas JUnit 5/Mockito. Las pruebas backend no requieren base de datos: el perfil `test` deshabilita Dev Services y las migraciones de arranque.

```sh
cd frontend
npm install
npm run build
npm test
```

El build verifica TypeScript y compila Angular; Vitest se ejecuta en modo no interactivo. Las pruebas frontend actuales cubren el servicio HTTP y helpers/modelo, no la integración extremo a extremo.

## Configuración y ejecución

Crea una base `cards` y un usuario `cards_app` con permiso de crear tablas e índices. Configuración backend por entorno:

| Variable | Valor predeterminado |
|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/cards` |
| `DB_USER` | `cards_app` |
| `DB_PASSWORD` | vacío; definir antes de ejecutar |
| `DB_POOL_MAX` | `10` |
| `PORT` | `8080` |
| `CORS_ORIGINS` | `http://localhost:4200` |
| `DEMO_CUSTOMER_ID` | `11111111-1111-1111-1111-111111111111` |
| `LOG_LEVEL` | `INFO` |

No guardes credenciales en el repositorio. En POSIX, establece `DB_PASSWORD` en el entorno y arranca:

```sh
cd backend
mvn quarkus:dev
```

Flyway aplica las migraciones al inicio. Health: `http://localhost:8080/q/health`. En otra terminal:

```sh
cd frontend
npm start
```

Abre `http://localhost:4200`. `frontend/proxy.conf.json` envía `/api` a `http://localhost:8080`.

## API e integración

- `GET /api/v1/cards`: lista tarjetas del cliente actual.
- `GET /api/v1/cards/{cardId}`: obtiene detalle por UUID.

La respuesta presenta id, número enmascarado y últimos cuatro dígitos, marca, tipo, estado, titular, límite, saldo disponible y moneda. UUID inválido, tarjeta inexistente o ajena produce `404 application/problem+json`. Angular consume estas rutas con `CardService`.

`CustomerContext` usa un cliente fijo configurable mediante `DEMO_CUSTOMER_ID`; es un stub, no autenticación. Antes de desplegar, integrar autenticación/autorización real (por ejemplo OIDC/JWT) y resolver el cliente desde una identidad validada. CORS y el proxy son configuración, no controles de acceso. El saldo/cupo se leen de la tabla local; una integración con un core de tarjetas no está definida.

## Persistencia

`PgCardRepository` implementa `CardRepository` con JDBC y consultas parametrizadas. Tanto el listado como la consulta individual filtran por `customer_id`. Las migraciones Flyway están en `backend/src/main/resources/db/migration/`: V1 crea tabla, restricciones e índices; V2 carga registros ficticios de dos clientes. Flyway aplica cada versión una sola vez por base. Para reiniciar los datos de desarrollo, recrea la base local; no edites migraciones ya aplicadas.

## Límites de verificación

Las pruebas existentes no validan PostgreSQL real ni integración completa. Compilación, pruebas y arranque no se han ejecutado durante la preparación de esta documentación; dependen de las herramientas y servicios instalados localmente.