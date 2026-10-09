# Consulta de Pagos — Banca por Internet

Aplicación de consulta (solo lectura) de pagos ficticios, con frontend React 18 + TypeScript y API Java 17 / Spring Boot 3.3. El backend persiste y consulta datos en PostgreSQL mediante JDBC; Flyway gestiona el esquema y seed de demostración. No hay integración con un core de pagos ni autenticación configurada.

## Estructura

- `frontend/`: Vite, React, TypeScript y Vitest. Componentes organizados con Atomic Design; `src/services/pagosApi.ts` consume la API.
- `backend/`: Maven y Spring Boot. Capas `api` → `application` → `domain`; `infrastructure/JdbcPagoRepository` implementa el puerto de persistencia.
- `backend/src/main/resources/db/migration/`: migraciones Flyway versionadas.

## Requisitos

- Java 17 y Maven.
- Node.js compatible con Vite 5 y npm.
- PostgreSQL accesible. La base de datos `pagos` debe existir antes de arrancar el backend (Flyway crea las tablas, no la base de datos).

## Configuración

El backend lee configuración del entorno. No se incluyen credenciales; configura una contraseña adecuada para tu entorno.

| Variable | Descripción | Valor predeterminado |
|---|---|---|
| `DB_URL` | URL JDBC de PostgreSQL | `jdbc:postgresql://localhost:5432/pagos` |
| `DB_USER` | Usuario de PostgreSQL | `pagos` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | vacío |
| `DEMO_CUENTA_ID` | Cuenta ficticia consultada | `CTA-0001` |
| `PORT` | Puerto HTTP del backend | `8080` |
| `LOG_LEVEL` | Nivel raíz de log | `INFO` |
| `VITE_API_BASE_URL` | Base URL para llamadas frontend | vacío (rutas relativas) |

Crea `pagos` y un usuario con permisos de conexión, creación/alteración de tablas e índices para que Flyway pueda aplicar las migraciones. En PostgreSQL local, por ejemplo, crea la base con tu herramienta habitual como administrador; no uses credenciales de producción para desarrollo. Para que el seed corresponda a la cuenta consultada, conserva `DEMO_CUENTA_ID=CTA-0001`.

## Compilar, probar y ejecutar

Abre terminales separadas. Primero inicia PostgreSQL y configura `DB_URL`, `DB_USER` y `DB_PASSWORD` en el entorno del backend.

```bash
cd backend
mvn test
mvn package
mvn spring-boot:run
```

Al iniciar la aplicación, Flyway ejecuta las migraciones pendientes y Spring Boot atiende en `http://localhost:8080` (o el puerto `PORT`). `mvn package` también ejecuta las pruebas JUnit 5 / Mockito.

```bash
cd frontend
npm install
npm test
npm run build
npm run dev
```

`npm test` ejecuta Vitest una vez. `npm run build` efectúa el chequeo TypeScript (`tsc --noEmit`) y genera el bundle Vite. El servidor de desarrollo queda normalmente en `http://localhost:5173`.

## Integración frontend–backend

En desarrollo, Vite reenvía `/api` a `http://localhost:8080`; por tanto, ejecuta ambos servicios. El cliente consulta `GET /api/v1/pagos` y envía filtros/paginación como query params. Para desplegar el frontend fuera del proxy de Vite, establece `VITE_API_BASE_URL` a la URL pública de la API al construir el bundle y configura CORS/proxy en la infraestructura según corresponda. No hay CORS ni despliegue de producción configurados aquí.

### API de consulta

- `GET /api/v1/pagos?desde=YYYY-MM-DD&hasta=YYYY-MM-DD&estado=PENDIENTE|PROCESADO|RECHAZADO&page=0&size=20`: filtros opcionales por fechas inclusivas y estado; `page` comienza en cero, `size` predeterminado 20 y máximo 100.
- `GET /api/v1/pagos/{id}`: detalle dentro de la cuenta actual; devuelve 404 si no existe para esa cuenta.
- `GET /actuator/health`: estado de salud.

Las fechas se interpretan en UTC. Los errores de solicitud se representan como `application/problem+json`. La cuenta se enmascara en el DTO de respuesta.

## Persistencia y datos

`V1__schema.sql` crea `pago` con importe `NUMERIC(15,2)`, fecha `TIMESTAMPTZ`, restricciones e índices para cuenta/fecha y estado. `V2__seed_ficticio.sql` inserta pagos de ejemplo para `CTA-0001` y un registro separado de `CTA-0002`; los datos son inventados y no representan personas ni cuentas reales. Flyway registra las versiones aplicadas en su tabla de historial; no edites una migración ya aplicada: agrega una nueva migración `V3__...sql` y posteriores.

El repositorio JDBC siempre limita consultas a `cuenta_id` y parametriza los valores. La cuenta de la demo la proporciona `DEMO_CUENTA_ID`; no es una identidad autenticada. La persistencia es PostgreSQL local/configurable, sin conexión al core de pagos ni procesamiento de transacciones.

## Seguridad y límites

Esta aplicación es una demo de consulta, sin autenticación/autorización. Antes de un uso real, la identidad y cuenta deben obtenerse de un contexto de seguridad confiable (por ejemplo, token validado), nunca de una variable fija o un parámetro de usuario; también se requieren controles de acceso, gestión segura de secretos y configuración de red/observabilidad apropiados. No registres contraseñas ni datos sensibles.

## Verificación

Los comandos indicados documentan cómo ejecutar build y pruebas; no se afirma que hayan sido ejecutados en este entorno.