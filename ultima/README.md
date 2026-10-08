# Consulta de Tarjetas — Banca por Internet (candidate)

Full Stack: Angular 17 (standalone, Atomic Design) + Spring Boot 3.2 (Java 17, Maven) + PostgreSQL (Flyway).
Alcance: solo lectura (`GET /api/v1/cards`, `GET /api/v1/cards/{cardId}`). Movimientos y extractos quedan fuera.

## Backend
Variables de entorno (ver `backend/.env.example`): `DB_URL`, `DB_USER`, `DB_PASSWORD`, `STUB_CUSTOMER_ID` (opcional), `LOG_LEVEL`.
```
cd backend
mvn test        # pruebas unitarias (Mockito, @WebMvcTest)
mvn package
DB_URL=... DB_USER=... DB_PASSWORD=... java -jar target/cards-query-0.1.0.jar
```
Las migraciones Flyway (`V1__schema.sql`, `V2__seed_ficticio.sql`) se aplican al arrancar. Datos ficticios; solo se guardan los últimos 4 dígitos y el PAN enmascarado (nunca PAN completo, CVV ni vencimiento).
Los errores usan `ProblemDetail` (RFC 7807); una tarjeta ajena responde 404 igual que una inexistente.

## Frontend
```
cd frontend
npm install
npm start       # ng serve con proxy /api -> http://localhost:8080
npm run build
npm test        # Karma + ChromeHeadless (requiere Chrome)
```

## Integración
Sin definir. `CurrentCustomerProvider` es el puerto; `StubCustomerProvider` devuelve un cliente ficticio fijo (`CUST-0001`). No hay autenticación real: no usar en producción.

## No verificado
Nada se ha compilado ni ejecutado: Maven, npm, Karma y el esquema PostgreSQL (solo revisión estática) quedan pendientes.
