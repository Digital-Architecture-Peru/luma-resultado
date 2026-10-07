# Consulta de Tarjetas — Banca por Internet

Aplicación full stack de consulta con React 18 + TypeScript + Vite y Java 17 + Quarkus 3. Presenta tarjetas ficticias; no procesa pagos ni contiene datos reales.

## Requisitos

- JDK 17 y Maven 3.8+ (`mvn -version`).
- Node.js compatible con Vite 5 (Node 18+) y npm.
- Para desarrollo, dos terminales; el puerto 8080 para API y 5173 para Vite deben estar disponibles.

## Desarrollo local

Terminal 1 — iniciar el API:

```sh
cd backend
mvn quarkus:dev
```

API disponible en `http://localhost:8080`; health check en `http://localhost:8080/q/health`.

Terminal 2 — instalar dependencias y arrancar el frontend:

```sh
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173`. Vite reenvía `/api` a `http://localhost:8080` por defecto. Para apuntar a otro backend durante desarrollo: `BACKEND_URL=http://host:puerto npm run dev` (en PowerShell: `$env:BACKEND_URL='http://host:puerto'; npm run dev`). Si se configura `VITE_API_BASE`, el cliente usa ese valor en lugar de `/api/v1`; en ese caso el servidor API debe permitir el origen del frontend mediante CORS.

## Build y pruebas

Backend — compilar, ejecutar pruebas unitarias e integración y generar el artefacto Quarkus:

```sh
cd backend
mvn test
mvn package
```

Frontend — instalación reproducible según `package-lock.json` (si está disponible) y type-check/build y pruebas Vitest:

```sh
cd frontend
npm install
npm test
npm run build
```

Las pruebas backend incluyen JUnit y RestAssured; las frontend usan Vitest y Testing Library. `mvn package` también ejecuta las pruebas del ciclo Maven. Para ejecutar la aplicación empaquetada en modo JVM: `java -jar backend/target/quarkus-app/quarkus-run.jar` desde la raíz después de `mvn package`.

## API

Base local: `http://localhost:8080/api/v1`.

- `GET /tarjetas` — devuelve las cuatro tarjetas ficticias.
- `GET /tarjetas?estado=ACTIVA|BLOQUEADA|VENCIDA` — filtra por estado; no distingue mayúsculas/minúsculas.
- `GET /tarjetas/{id}` — consulta detalle; IDs de muestra: `tc-001`, `td-002`, `tc-003`, `td-004`.
- `GET /q/health` — estado de salud de Quarkus.

Los errores de solicitud usan `application/problem+json`: estado inválido o ID mal formado responde 400; ID válido inexistente responde 404. Los datos expuestos incluyen únicamente número de tarjeta enmascarado.

## Configuración

Configuraciones backend (variables de entorno; valores predeterminados entre paréntesis):

- `PORT` (`8080`): puerto HTTP.
- `CORS_ORIGINS` (`http://localhost:5173`): origen permitido para el navegador.
- `LOG_LEVEL` (`INFO`): nivel de log.

Frontend:

- `BACKEND_URL` (`http://localhost:8080`): destino del proxy de Vite en desarrollo.
- `VITE_API_BASE` (`/api/v1`): base de URL que usa el cliente. Para apuntar a un backend remoto, configure URL accesible desde el navegador y CORS en ese backend.

No se requieren credenciales ni archivos de secretos.

## Integración y persistencia

La UI consume el API REST a través de `frontend/src/api/tarjetasApi.ts` (`TarjetasApi`); `App` recibe ese puerto, lo que permite sustituirlo en pruebas. El API separa recurso HTTP (`TarjetaResource`), lógica (`TarjetaService`) y acceso (`TarjetaRepository`). `DatosFicticiosTarjetaRepository` es el adaptador actual y devuelve una lista inmutable en memoria.

No hay base de datos, migraciones ni persistencia: los registros son datos de demostración constantes y no cambian entre reinicios. La integración con un core bancario o una base de datos no está implementada; requeriría proporcionar un adaptador de `TarjetaRepository` y definir autenticación, autorización, manejo de errores, disponibilidad y contratos con el sistema externo antes de usar datos reales. Esta app es solo de consulta y no debe recibir números completos, CVV ni secretos.

## Estructura

- `backend/`: proyecto Maven Quarkus; código en `src/main/java`, configuración en `src/main/resources`, pruebas en `src/test/java`.
- `frontend/`: proyecto npm React + TypeScript + Vite; UI por componentes y pruebas en `src`.
