# Consulta de Tarjetas – Banca por Internet (Backend)

Java 17 + Spring Boot 3.2, PostgreSQL, organización Component-based (Atomic Design adaptado):

| Capa | Paquete | Contenido |
|---|---|---|
| Atoms | `atoms` | `Card`, `CardStatus`, `MaskedPan`, errores de dominio |
| Molecules | `molecules` | puerto `CardRepository`, `CardResponse`, `PageResponse` |
| Organisms | `organisms` | `CardQueryService` (caso de uso) |
| Adapters / entrada | `adapters`, `web` | `JdbcCardRepository` (SQL parametrizado), `CardController`, errores problem+json |

## Build y pruebas
```
mvn package      # compila y ejecuta pruebas unitarias (sin base de datos)
mvn test
```

## Ejecución
Variables (ver `.env.example`): `DATABASE_URL`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DB_POOL_SIZE`, `LOG_LEVEL`, `PORT`.
```
SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run   # dev aplica además el seed ficticio
```
Flyway aplica `db/migration` (esquema); el seed ficticio `db/seed` solo en perfil `dev`.

## API (`/v1`)
- `GET /v1/cards?customerId=CLI-0001&status=ACTIVE&page=0&size=10`
- `GET /v1/cards/{id}?customerId=CLI-0001`
- `GET /actuator/health`

Errores en `application/problem+json` (400, 404, 500). El número se devuelve enmascarado; no se almacena PAN completo ni CVV.

## Integración y seguridad
Integración sin definir. `customerId` llega como parámetro solo para el candidate: en producción debe derivarse del token de sesión autenticado (autorización pendiente), nunca de un parámetro libre.

## No verificado
Compilación, pruebas y migraciones contra PostgreSQL real no se han ejecutado.
