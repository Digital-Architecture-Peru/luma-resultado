# Consulta de cuentas — banca por Internet

Aplicación de solo lectura para listar cuentas y consultar su detalle. El repositorio contiene un backend Java 17 / Spring Boot 3.3 con PostgreSQL y Flyway (`backend/`), y una interfaz React 18 + TypeScript + Vite (`frontend/`). Los datos de ejemplo son ficticios.

> **Aviso de seguridad:** `X-Customer-Id` es una identidad simulada para desarrollo y pruebas, no autenticación. No desplegar con este mecanismo como control de acceso. En producción debe derivarse la identidad de una sesión/token validado y configurarse CORS para orígenes explícitos.

## Requisitos

- Java 17 y Maven 3.6 o posterior.
- Node.js compatible con Vite 5 (Node 18+ recomendado) y npm.
- PostgreSQL accesible para ejecutar la aplicación backend. Las pruebas Maven actuales son unitarias y no necesitan base de datos.

## Persistencia y configuración

El backend requiere estas variables de entorno (no hay credenciales incluidas):

| Variable | Descripción | Ejemplo local |
|---|---|---|
| `DB_URL` | URL JDBC PostgreSQL | `jdbc:postgresql://localhost:5432/banca` |
| `DB_USER` | Usuario de la base | `banca_app` |
| `DB_PASSWORD` | Contraseña de la base | definir localmente, no guardar en git |
| `SERVER_PORT` | Puerto HTTP (opcional, predeterminado `8080`) | `8080` |
| `CORS_ALLOWED_ORIGINS` | Origen(es) frontend permitido(s) (opcional) | `http://localhost:5173` |
| `LOG_LEVEL` | Nivel raíz de logging (opcional; predeterminado `INFO`) | `INFO` |

Crear una base PostgreSQL llamada `banca` y un usuario con permiso de conexión y modificación del esquema. Por ejemplo, desde una sesión administrativa local de PostgreSQL:

```sql
CREATE USER banca_app WITH PASSWORD 'cambiar-localmente';
CREATE DATABASE banca OWNER banca_app;
```

La aplicación ejecuta migraciones Flyway al iniciar: `V1__schema.sql` crea `account` y el índice por cliente; `V2__seed_ficticio.sql` carga cuatro filas ficticias para `C001` y `C002`. Flyway registra su historial y no debe editarse una migración ya aplicada; agregar cambios con una migración versionada nueva. El repositorio JDBC implementa lectura filtrada por `customer_id`; el detalle filtra simultáneamente por id y cliente.

Configurar las variables en el entorno del proceso (por ejemplo, exportarlas en una terminal local) sin poner claves reales en archivos versionados. `DB_URL`, `DB_USER` y `DB_PASSWORD` son obligatorias para arrancar el backend.

## Compilar, probar y ejecutar

### Backend

Desde la raíz del repositorio:

```bash
cd backend
mvn test
mvn package
```

`mvn test` ejecuta pruebas unitarias de servicio y controlador sin PostgreSQL. `mvn package` compila y empaqueta el servicio. Para iniciar el servidor, con PostgreSQL arriba y las variables configuradas:

```bash
mvn spring-boot:run
```

Por defecto queda en `http://localhost:8080`. El health check de Actuator está expuesto en `/actuator/health`.

### Frontend

En otra terminal, desde la raíz:

```bash
cd frontend
npm install
npm test
npm run build
npm run dev
```

`npm test` corre Vitest en modo no interactivo; `npm run build` realiza `tsc --noEmit` y genera el bundle de Vite; `npm run dev` sirve la UI en `http://localhost:5173`. La UI consulta el backend directamente; el CORS del backend permite por defecto ese origen.

Configuración del cliente mediante variables de entorno Vite antes de arrancarlo/compilarlo:

- `VITE_API_BASE_URL`: URL base del servicio, predeterminada `http://localhost:8080`.
- `VITE_CUSTOMER_ID`: cliente de demostración, predeterminado `C001`.

Los valores `VITE_*` se incorporan al cliente público y nunca deben contener secretos. Para probar el otro conjunto ficticio, usar `VITE_CUSTOMER_ID=C002`.

## API e integración

La integración implementada es HTTP/JSON entre el frontend y el backend. No hay integración configurada con sistemas bancarios externos. El frontend envía el header `X-Customer-Id` en cada petición; el backend resuelve el acceso a través del servicio y repositorio JDBC.

| Método y ruta | Header requerido | Respuesta |
|---|---|---|
| `GET /api/v1/accounts` | `X-Customer-Id` | Lista de cuentas del cliente |
| `GET /api/v1/accounts/{id}` | `X-Customer-Id` | Cuenta del cliente; `404` si no existe o pertenece a otro cliente |

El DTO incluye `id`, `maskedNumber` (solo últimos cuatro dígitos), `type`, `currency`, `balance` (decimal como texto), `status` y `openedAt`. La API es de solo lectura. Ejemplo local:

```bash
curl -H 'X-Customer-Id: C001' http://localhost:8080/api/v1/accounts
curl -H 'X-Customer-Id: C001' http://localhost:8080/api/v1/accounts/1
```

## Límites conocidos

La identidad por header es deliberadamente simulada y manipulable. Los datos semilla sirven únicamente para desarrollo; no representan clientes reales. La ejecución de compilaciones y pruebas no se verificó durante la preparación de esta documentación.
