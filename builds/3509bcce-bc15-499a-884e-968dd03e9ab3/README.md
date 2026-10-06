# Contador — Vue 3 + TypeScript

Aplicación frontend pequeña para incrementar, decrementar y reiniciar un contador. Incluye límites configurables (por defecto, de `-100` a `100`) y pasos enteros. No requiere backend.

## Requisitos

- Node.js y npm instalados (se recomienda una versión LTS vigente).
- Acceso a las dependencias del proyecto para la primera instalación.

## Instalar, ejecutar y compilar

Desde la raíz del proyecto:

```sh
npm install
npm run dev
```

Vite mostrará la URL local de desarrollo en la terminal. Para generar la versión de producción:

```sh
npm run build
```

El comando de build ejecuta primero `vue-tsc --noEmit` y después `vite build`; los archivos resultantes se generan en `dist/`. Para servir localmente ese resultado:

```sh
npm run preview
```

## Pruebas

```sh
npm test
```

El script ejecuta `vitest run` en el entorno `jsdom`. La configuración está en `vite.config.ts`; las pruebas cubren reglas del dominio (`tests/domain`), el composable (`tests/composables`) y el componente (`tests/components`).

## Configuración

La aplicación lee estas variables al compilar/ejecutar Vite:

| Variable | Valor predeterminado | Descripción |
|---|---:|---|
| `VITE_COUNTER_INITIAL` | `0` | Valor inicial entero. |
| `VITE_COUNTER_STEP` | `1` | Paso entero positivo. |

Vite expone al código cliente las variables con prefijo `VITE_`; no incluir secretos en ellas. `parseIntOr` usa el fallback si el valor está ausente o no representa un entero. `buildConfig` normaliza pasos no positivos al paso predeterminado y limita el valor inicial al rango. Los límites `min` y `max` se fijan en el dominio (`-100` y `100` por defecto); si se construye una configuración con `min > max`, se produce un error.

No hay archivo `.env.example` en el repositorio actual. Para una configuración local opcional se puede crear `.env.local` (no subir valores privados) y reiniciar Vite tras cambiarla, por ejemplo:

```dotenv
VITE_COUNTER_INITIAL=5
VITE_COUNTER_STEP=2
```

## Organización

- `src/domain/counter.ts`: configuración y operaciones puras (clamp, incremento/decremento y lectura de enteros).
- `src/composables/useCounter.ts`: estado reactivo y operaciones del contador.
- `src/components/CounterPanel.vue`: interfaz y accesibilidad; el valor se anuncia en una región `role="status"`.
- `src/App.vue`: compone el panel y obtiene la configuración del entorno.
- `tests/`: pruebas de dominio, composable y UI.

## Integración y persistencia

La implementación existente es exclusivamente cliente: no realiza peticiones HTTP, no define API ni sincroniza con otros usuarios. El estado vive en memoria y se pierde al recargar o cerrar la página. No hay base de datos ni persistencia local configurada.

Si se necesita guardar el contador, conviene mantener las reglas del dominio independientes e introducir una interfaz de almacenamiento detrás del composable. Una persistencia local (por ejemplo, `localStorage`) sirve únicamente para conservar datos en ese navegador; para compartir estado entre dispositivos se necesitaría un backend con un contrato API, validación en servidor y almacenamiento persistente. Ninguna de esas integraciones está implementada aquí.

## Estado de verificación

Esta documentación refleja los scripts y archivos inspeccionados. No se ejecutaron instalación, build ni pruebas en este entorno; su resultado queda sin verificar.
