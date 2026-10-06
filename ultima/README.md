# Lista de tareas

Microapp frontend en Vue 3 + Vite. La interfaz permite crear, completar y eliminar tareas; muestra el total, las pendientes y las completadas. Los datos de ejemplo son ficticios.

## Requisitos

- Node.js 18 o posterior
- npm

## Instalar, ejecutar y compilar

```sh
npm install
npm run dev       # servidor de desarrollo; abrir la URL que informa Vite
npm run build     # genera la salida de producción en dist/
npm run preview   # sirve localmente el build generado
```

`npm run preview` requiere ejecutar antes `npm run build`. Para comprobar la sintaxis del punto de entrada: `npm run check:syntax`.

## Pruebas

```sh
npm test
```

Vitest ejecuta las pruebas bajo `tests/` en jsdom, usando Vue Test Utils. Cubren normalización y validación de títulos, cálculo/formato del contador, interacción con la lista, operaciones del composable, errores de repositorio y configuración de entorno. No se han ejecutado las pruebas en este entorno.

## Configuración e integración

El repositorio se selecciona con `VITE_DATA_MODE` (`mock` por defecto o `http`) y `VITE_API_BASE_URL` (obligatoria en modo `http`). Puedes tomar `env.example.txt` como referencia y crear manualmente un archivo `.env` en la raíz, por ejemplo:

```dotenv
VITE_DATA_MODE=mock
VITE_API_BASE_URL=
```

Para usar el adaptador HTTP, define el modo y la URL base correspondiente:

```dotenv
VITE_DATA_MODE=http
VITE_API_BASE_URL=http://localhost:3000
```

Vite expone al código cliente las variables con prefijo `VITE_`; no pongas secretos en ellas. Reinicia el servidor de desarrollo tras modificar `.env`. El adaptador realiza peticiones `GET /tasks`, `POST /tasks`, `PATCH /tasks/:id/toggle` y `DELETE /tasks/:id`; el contrato de datos y las respuestas esperadas se detallan en [docs/integracion-api.md](docs/integracion-api.md). Hace falta implementar un backend compatible y permitir CORS desde el origen de la app. Sin backend, el modo HTTP dará errores visibles en la interfaz.

## Arquitectura y persistencia

La vista/composable de tareas depende del puerto `TaskRepository`, no de un almacenamiento concreto. `createRepository` selecciona el adaptador: `createMockTaskRepository` usa datos ficticios en memoria, mientras `createHttpTaskRepository` comunica con un backend HTTP. Las operaciones del modo mock se pierden al recargar la página; no hay persistencia local ni base de datos incluida. Para persistencia duradera, el backend debe guardar los datos y cumplir el contrato descrito en la documentación de integración.

## Estado de verificación

La estructura y comandos se documentaron a partir de los archivos presentes; instalación, build, ejecución de la app, pruebas y compilación no se verificaron. El adaptador HTTP está implementado contra un contrato candidate y no confirma que exista un servicio compatible.
