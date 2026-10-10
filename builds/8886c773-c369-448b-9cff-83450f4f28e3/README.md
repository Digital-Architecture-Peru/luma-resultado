# Notificaciones

React + TypeScript/Vite y Java 17 + Quarkus; PostgreSQL mediante JDBC y Flyway.

## Build y pruebas

```sh
cd backend && mvn test
cd backend && mvn package
cd frontend && npm install && npm test && npm run build
```

## Ejecutar

Prepare PostgreSQL `notifications`, configure `DB_URL`, `DB_USER`, `DB_PASSWORD`; Quarkus aplica las migraciones Flyway al iniciar:

```sh
cd backend && mvn quarkus:dev
cd frontend && npm install && npm run dev
```

Frontend Vite: puerto 5173, proxy `/api` al backend 8080. Consulte `docs/ENVIRONMENT.md` para variables.

## Integración y persistencia

API bajo `/api/v1`; el cliente envía `X-Customer-Id` simulado. Incluye listar notificaciones, marcarlas leídas y consultar/reemplazar preferencias. PostgreSQL persiste datos mediante repositorios JDBC; migraciones `V1` y `V2` crean esquema y seed ficticio. Solo está implementado el canal IN_APP; SMS/email/push no están integrados. No existe autenticación real. No se ejecutaron builds, pruebas ni migraciones durante esta tarea.