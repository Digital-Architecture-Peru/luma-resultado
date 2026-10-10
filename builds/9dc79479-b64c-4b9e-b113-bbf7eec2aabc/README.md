# Notificaciones de cuenta

Aplicación de demostración full stack para avisos in-app sobre eventos de cuenta. El frontend está hecho con React + TypeScript y Vite; la API usa .NET 8 con arquitectura por capas y PostgreSQL como persistencia.

## Requisitos

- .NET SDK 8
- Node.js compatible con Vite 5 y npm
- PostgreSQL 13 o posterior
- `psql` para aplicar los scripts SQL

## Configuración y base de datos

Crea una base de datos vacía y configura una cadena de conexión Npgsql. No guardes credenciales en el repositorio. Por ejemplo, en bash:

```sh
export ConnectionStrings__Notifications='Host=localhost;Port=5432;Database=notifications;Username=TU_USUARIO;Password=TU_CLAVE'
export ASPNETCORE_URLS='http://localhost:5080'
export Cors__AllowedOrigins='http://localhost:5173'
```

Aplica los scripts desde la raíz del repositorio, en este orden:

```sh
psql "$DATABASE_URL" -f db/migrations/V001__schema.sql
psql "$DATABASE_URL" -f db/migrations/V002__seed.sql
```

`DATABASE_URL` es la variable de conexión que consume `psql`; la aplicación recibe su conexión mediante `ConnectionStrings__Notifications`. Ajusta ambas según el entorno. V001 crea las tablas e índices; V002 añade notificaciones y preferencias ficticias para `CUST-0001` y la cuenta `10020030041234`. Los scripts usan `IF NOT EXISTS`/`ON CONFLICT` para los objetos y filas sembrados, pero no constituyen un gestor de migraciones ni resuelven cambios futuros de esquema.

## Backend (.NET)

Desde la raíz:

```sh
cd backend
dotnet restore Notifications.sln
dotnet build Notifications.sln
dotnet test Notifications.sln
dotnet run --project src/Notifications.Api/Notifications.Api.csproj
```

La API escucha en `http://localhost:5080` con la configuración anterior. La cadena `ConnectionStrings__Notifications` es obligatoria; el proceso falla al iniciar si falta. `Cors__AllowedOrigins` admite orígenes separados por coma y por defecto es `http://localhost:5173`.

Endpoints:

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Comprobación básica de proceso (no comprueba conexión a PostgreSQL). |
| GET | `/api/accounts/{accountId}/notifications?unreadOnly=true` | Lista hasta 100 notificaciones; `unreadOnly` es opcional y por defecto falso. |
| PATCH | `/api/notifications/{id}/read` | Marca como leída una notificación del cliente. |
| GET | `/api/accounts/{accountId}/notification-preferences` | Consulta preferencias; tipos no almacenados aparecen habilitados. |
| PUT | `/api/accounts/{accountId}/notification-preferences` | Guarda una lista JSON de `{ "type": "DEPOSIT", "enabled": true }`. |

Todas las rutas `/api` requieren `X-Demo-Customer`, por ejemplo `CUST-0001`. Esta cabecera es una identidad de demostración, no autenticación: no publiques ni expongas el servicio como si fuera seguro para usuarios reales. Las entradas inválidas se expresan como problem details; los tipos de notificación admitidos son `DEPOSIT`, `WITHDRAWAL`, `LOW_BALANCE` y `STATEMENT`.

## Frontend (React + TypeScript)

En otra terminal, desde la raíz:

```sh
cd frontend
npm install
npm run build
npm test
npm run dev
```

Vite sirve la aplicación en `http://localhost:5173`. La compilación incluye comprobación de tipos (`tsc --noEmit`) y generación de bundle. Las pruebas se ejecutan sin modo interactivo con Vitest.

Configuración opcional en `frontend/.env.local`:

```dotenv
VITE_API_BASE_URL=http://localhost:5080
VITE_DEMO_CUSTOMER_ID=CUST-0001
VITE_ACCOUNT_ID=10020030041234
```

La aplicación también define esos valores predeterminados en el código. `VITE_API_BASE_URL` apunta a la API; el origen del frontend debe estar permitido en `Cors__AllowedOrigins`. Reinicia Vite después de modificar variables `VITE_*`.

## Integración y persistencia

El cliente `frontend/src/api/notificationsApi.ts` consume la API por HTTP y envía `X-Demo-Customer`. El backend valida las solicitudes en el servicio de aplicación y usa `INotificationRepository` como frontera de persistencia; la implementación PostgreSQL usa Npgsql y Dapper con consultas parametrizadas. Las consultas y actualizaciones de notificaciones filtran por cliente, y la operación de preferencias está respaldada por una transacción.

No hay integración configurada con un sistema productor de eventos: los registros visibles se originan en el seed o se agregan directamente a la base de datos. Tampoco hay envío de email/SMS, autenticación real, ni pruebas de integración contra PostgreSQL. Las pruebas existentes del backend son unitarias con repositorio en memoria; las del frontend usan una API simulada. Antes de un despliegue real, sustituye la identidad demo por autenticación/autorización y define cómo se ingieren los eventos.

## Limitaciones

Proyecto de demostración/candidate, no apto para producción sin controles adicionales. `/health` solo informa que la aplicación responde y no verifica dependencias. Las migraciones SQL son scripts manuales; respalda la base de datos antes de aplicarlos en entornos con datos.