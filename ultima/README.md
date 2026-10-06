# Lista de tareas — Vue 3 + Vite + TypeScript

Microaplicación frontend para crear, completar y eliminar tareas. Muestra tareas pendientes, completadas y el total en un contador accesible (`role="status"`). Incluye datos de ejemplo; no hay servidor ni llamadas de red.

## Requisitos

- Node.js y npm instalados (se recomienda una versión LTS compatible con Vite 5).
- No se incluye un archivo de lock en el proyecto. `npm install` resolverá las versiones permitidas por `package.json`; para instalaciones reproducibles, genere y conserve `package-lock.json` y luego use `npm ci`.

## Instalar, ejecutar y probar

Desde la raíz del proyecto:

```sh
npm install
npm run dev
```

Vite imprime la dirección local para abrir la aplicación. Para generar el build de producción:

```sh
npm run build
npm run preview
```

`npm run build` primero ejecuta `vue-tsc --noEmit` y después genera los archivos estáticos en `dist/`. `npm run preview` sirve ese build localmente; no es un servidor de producción.

Ejecutar las pruebas automatizadas:

```sh
npm test
```

Vitest ejecuta las pruebas una vez en el entorno `jsdom`. El código fuente no se ha ejecutado ni validado durante la preparación de esta documentación.

## Estructura y responsabilidades

- `src/App.vue`: composición de pantalla, crea el adaptador en memoria y carga los datos al montar.
- `src/features/tasks/domain/task.ts`: tipos de tarea, validación del título (recorte, normalización de espacios y máximo de 120 caracteres) y cálculo de contadores.
- `src/features/tasks/ports/TaskGateway.ts`: contrato asíncrono de acceso a tareas (`list`, `create`, `toggle`, `remove`).
- `src/features/tasks/adapters/inMemoryTaskGateway.ts`: implementación en memoria del contrato; entrega copias de los datos y rechaza títulos o identificadores inválidos.
- `src/features/tasks/useTasks.ts`: composable Vue que coordina carga, operaciones, estado de carga y errores.
- `src/features/tasks/components/`: formulario, lista y contador.
- `src/mocks/tasks.fixture.ts`: conjunto ficticio inicial.
- `tests/unit/`: validación, conteo y comportamiento del adaptador.
- `tests/components/`: validaciones del formulario e interacciones de la aplicación.

## Integración y persistencia

Actualmente la integración es local: no existe API, autenticación, sincronización ni almacenamiento en navegador. El adaptador guarda el estado únicamente mientras la instancia de la aplicación está activa; al recargar, vuelve a cargarse la fixture ficticia. Los cambios no se conservan entre sesiones.

Para conectar un backend, implemente `TaskGateway` con un adaptador HTTP y selecciónelo desde el punto de composición (`src/App.vue`). Mantenga las operaciones asíncronas y traduzca los errores del servicio a mensajes presentables sin exponer detalles internos. Defina y documente antes el contrato del backend (esquema de tarea, validaciones, códigos de error y estrategia de identidad). Las URL públicas pueden configurarse con variables `VITE_*` en el build; cualquier valor `VITE_*` queda expuesto al cliente y nunca debe contener secretos. No hay variables de entorno configuradas ni integración HTTP implementada hoy.

Para persistencia, el backend debería ser la fuente de verdad si se requiere compartir datos entre usuarios o dispositivos. Una alternativa puramente local podría implementar el mismo puerto con `localStorage` o IndexedDB, considerando versionado, recuperación ante datos corruptos y límites del almacenamiento; no está implementada. No introduzca credenciales en el frontend.

## Cobertura y límites conocidos

Las pruebas existentes cubren normalización y límites de títulos, contadores, operaciones del gateway (incluidos identificadores desconocidos), validación del formulario y operaciones principales de la interfaz. No prueban integración con servicios externos porque no existe dicha integración. La compilación y las pruebas deben ejecutarse localmente con los comandos anteriores; no se afirma que hayan pasado.
