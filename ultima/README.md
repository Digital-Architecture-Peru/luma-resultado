# Consulta de tarjetas

Aplicación de consulta de tarjetas ficticias con frontend React 18 + TypeScript + Vite y API Java 17 + Spring Boot 3.3.4. No requiere credenciales ni servicios externos.

## Requisitos

- JDK 17 o posterior compatible con Spring Boot 3.3.
- Apache Maven 3.6.3+ (o Maven Wrapper si se incorpora en el futuro; actualmente no hay wrapper).
- Node.js compatible con Vite 5 (Node 18+ recomendado) y npm.

## Ejecutar localmente

Abrir dos terminales desde la raíz del repositorio.

Terminal 1 — API:

```sh
cd backend
mvn spring-boot:run
```

La API queda en `http://localhost:8080`; para cambiar el puerto: `PORT=8090 mvn spring-boot:run` (PowerShell: `$env:PORT='8090'; mvn spring-boot:run`).

Terminal 2 — frontend:

```sh
cd frontend
npm install
npm run dev
```

Abrir la URL local que imprime Vite. El servidor de desarrollo reenvía `/api` a `http://localhost:8080`. Para apuntar a otro destino: `VITE_API_TARGET=http://localhost:8090 npm run dev` (PowerShell: `$env:VITE_API_TARGET='http://localhost:8090'; npm run dev`). `VITE_API_TARGET` solo configura el proxy de desarrollo de Vite; no es una variable de configuración del backend.

## Compilar y probar

Backend, desde `backend/`:

```sh
mvn test
mvn package
```

Las pruebas usan JUnit 5, Spring Test y MockMvc; comprenden pruebas del servicio y del controlador, incluidos filtrado, validación del estado y respuestas para identificadores existentes e inexistentes. `mvn package` ejecuta también la fase de pruebas.

Frontend, desde `frontend/` (después de `npm install`):

```sh
npm test
npm run build
```

Vitest corre en modo no interactivo; el build ejecuta primero `tsc --noEmit` y luego genera los artefactos Vite en `frontend/dist/`.

## API e integración

Base local: `http://localhost:8080/api/v1`.

- `GET /tarjetas` — devuelve las tarjetas disponibles.
- `GET /tarjetas?estado=ACTIVA|BLOQUEADA|VENCIDA` — filtra por estado. Los valores son enumeraciones exactas; un valor inválido produce HTTP 400.
- `GET /tarjetas/{id}` — obtiene una tarjeta; si no existe, HTTP 404.
- `GET /actuator/health` — estado de salud de Spring Boot Actuator.

El frontend consume `GET /api/v1/tarjetas` mediante `crearTarjetasApi` en `frontend/src/services/tarjetasApi.ts`; el filtro `TODAS` omite el parámetro y los demás estados se envían como query. El proxy Vite evita configurar CORS para el desarrollo local. No se ha configurado un servidor de producción para el frontend ni CORS para despliegues independientes.

El controlador delega al servicio (`TarjetaService`), que depende del puerto `TarjetaRepository`; el adaptador actual es `InMemoryTarjetaRepository`. La respuesta expone exclusivamente el número enmascarado. Errores de tipo de parámetro inválido y tarjeta no encontrada se serializan como `problem+json`.

## Persistencia y datos

No hay base de datos ni persistencia duradera: el adaptador de repositorio mantiene una lista inmutable de cuatro registros ficticios en memoria. Cada reinicio del backend vuelve a cargar esos registros; los cambios no se conservan. `TarjetaRepository` separa el servicio de la implementación de datos, permitiendo sustituir el adaptador por una integración o almacenamiento persistente posterior. No se integra con sistemas bancarios reales.

`LOG_LEVEL` permite configurar el nivel raíz de logging (por defecto `INFO`); `PORT` define el puerto HTTP (por defecto `8080`). El endpoint de salud expuesto es únicamente `/actuator/health`.
