# Transacciones de tarjeta

Aplicación Full Stack de ejemplo para consultar y registrar transacciones de tarjetas. El monorepo contiene un frontend React 18 + TypeScript + Vite y un backend Java 17 + Quarkus 3.15.1, con PostgreSQL y Flyway. Los datos y la autorización del core son ficticios; no usar con información ni operaciones reales.

## Requisitos

- Java 17 y Maven 3.9 o superior.
- Node.js 20 o superior y npm.
- PostgreSQL 14 o superior, accesible desde el backend.

## Base de datos

Crear una base PostgreSQL `cards` y un usuario local con permisos de esquema, por ejemplo:

```sql
CREATE USER cards_app WITH PASSWORD 'local-dev-only';
CREATE DATABASE cards OWNER cards_app;
```

Configura la conexión mediante variables de entorno del backend: `DB_URL` (predeterminado `jdbc:postgresql://localhost:5432/cards`), `DB_USER` (predeterminado `cards_app`), `DB_PASSWORD` (debe configurarse localmente), `PORT` (8080) y `CORS_ORIGINS` (predeterminado `http://localhost:5173`). No guardes contraseñas reales en el repositorio.

Al arrancar Quarkus, Flyway ejecuta `backend/src/main/resources/db/migration/V1__schema.sql` y `V2__seed.sql`. El seed crea tarjetas y transacciones ficticias; la tarjeta activa de demo usa el UUID `11111111-1111-1111-1111-111111111111` y otra tarjeta está bloqueada. Flyway no vuelve a aplicar migraciones ya registradas.

## Compilar y probar

Desde la raíz, ejecutar por separado:

```sh
cd backend
mvn test
mvn package
```

Las pruebas del backend son unitarias (JUnit 5 y Mockito) para reglas de negocio, idempotencia, saldo y conflictos optimistas; no requieren PostgreSQL. `mvn package` compila y ejecuta las pruebas.

```sh
cd frontend
npm install
npm test
npm run build
```

`npm test` ejecuta Vitest en modo no interactivo. `npm run build` ejecuta `tsc --noEmit` y genera el bundle de Vite. No se requieren dependencias adicionales en el frontend.

## Ejecutar localmente

1. Inicia PostgreSQL y configura las variables de entorno indicadas arriba (incluida `DB_PASSWORD`).
2. En una terminal, inicia el backend:

   ```sh
   cd backend
   mvn quarkus:dev
   ```

   El servicio queda en `http://localhost:8080`; Flyway migra la base al inicio. La comprobación de salud está en `http://localhost:8080/q/health`.

3. En otra terminal inicia Vite:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

   Abre la URL que informe Vite (normalmente `http://localhost:5173`). Su proxy de desarrollo reenvía `/api` a `http://localhost:8080`. Para apuntar el cliente a otra URL se puede definir `VITE_API_URL` al ejecutar/build del frontend; el valor esperado incluye el prefijo API, por ejemplo `https://host/api/v1`.

## API e integración

El frontend llama a `GET /api/v1/cards/{cardId}/transactions?limit=20` para listar y a `POST /api/v1/cards/{cardId}/transactions` para crear. El POST requiere `Idempotency-Key` y un JSON como:

```json
{"type":"PURCHASE","amount":25.50,"currency":"USD","description":"Compra demo"}
```

Tipos permitidos: `PURCHASE`, `PAYMENT` y `REFUND`; moneda de tres letras mayúsculas; monto positivo con hasta dos decimales. Una creación aprobada devuelve `201` y una representación de transacción. Los errores se exponen como `application/problem+json`; pueden incluir `400`, `404`, `409` y `422`.

`CardCoreGateway` define el puerto para autorizar con el core de tarjetas. Actualmente se inyecta `FakeCardCoreGateway`, un adaptador simulado que aprueba importes de hasta 10 000.00 y no hace llamadas externas. Para integrar un core real debe implementarse ese puerto con el cliente y configuración segura correspondientes; esto no está incluido.

## Persistencia y límites

La persistencia usa PostgreSQL y JDBC parametrizado a través de repositorios. Flyway versiona el esquema: `card` conserva PAN enmascarado, estado, límite, saldo y versión; `card_transaction` almacena tipo, importe, estado y clave idempotente única. Importes usan `NUMERIC(15,2)` y hay índice por tarjeta/fecha. La actualización de saldo comprueba `version` para detectar escrituras concurrentes; el registro de saldo y transacción está bajo transacción JTA.

La aplicación no implementa autenticación ni autorización de cliente: la identificación/validación del titular debe aportarla el host de Banca por Internet antes de exponer estos endpoints. El frontend usa una tarjeta demo fija. La cobertura existente no incluye pruebas HTTP de extremo a extremo ni pruebas de integración contra PostgreSQL. Una carrera entre solicitudes con la misma clave puede chocar con la restricción UNIQUE de la base; el servicio comprueba previamente duplicados, pero el conflicto concurrente no está convertido actualmente a una respuesta 409 garantizada.
