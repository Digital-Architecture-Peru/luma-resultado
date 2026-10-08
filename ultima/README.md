# Consulta de Tarjetas · Banca por Internet (candidate)

Full Stack: `backend/` (Java 17 + Spring Boot 3.2, JPA, Flyway, PostgreSQL) y `frontend/` (Angular 17, Atomic Design).
API de solo lectura: `GET /api/v1/cards` y `GET /api/v1/cards/{cardId}`. Datos ficticios; solo se guarda el PAN enmascarado (últimos 4 dígitos).

## Backend
Variables de entorno (sin valores por defecto para credenciales): `DB_URL` (opcional, por defecto `jdbc:postgresql://localhost:5432/cards`), `DB_USER`, `DB_PASSWORD`, `CORS_ALLOWED_ORIGIN` (por defecto `http://localhost:4200`), `LOG_LEVEL`.

```
cd backend
mvn test                                   # pruebas unitarias (JUnit 5 + Mockito + MockMvc standalone)
SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run
```
Flyway aplica `V1__schema.sql` y `V2__seed.sql` al arrancar.

**Advertencia:** el perfil `dev` activa `HeaderCustomerContextProvider`, que toma el cliente del header `X-Customer-Id`. Es un stub solo para desarrollo; en producción debe sustituirse por una implementación de `CustomerContextProvider` basada en la autenticación real del canal (OAuth2/JWT, aún sin definir).

## Frontend
```
cd frontend
npm install
npm run build
npm test        # Karma + Jasmine, ChromeHeadless, una sola pasada
npm start       # http://localhost:4200
```
`src/environments/environment.ts` define `apiBaseUrl` y el cliente ficticio de desarrollo.

## Integración
Sin definir: no hay conexión con el core de tarjetas; PostgreSQL es la fuente de la consulta.

## Persistencia
Tabla `card` (índice `(customer_id, status)`); acceso con Spring Data JPA (consultas parametrizadas) siempre filtrado por cliente.
