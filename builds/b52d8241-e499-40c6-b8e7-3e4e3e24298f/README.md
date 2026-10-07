# Consulta de Tarjetas

Frontend de consulta construido con Vue 3, TypeScript y Vite. Estado de entrega: **candidate**. El código se revisó mediante lectura; no se ejecutaron build, pruebas ni servidor en este entorno.

## Requisitos

- Node.js compatible con Vite 5 (Node.js 18+ recomendado).
- npm.

## Instalar, compilar y ejecutar

```sh
npm install
npm run typecheck
npm run build
npm run dev
```

Vite muestra la URL local (normalmente `http://localhost:5173`). Para servir el artefacto compilado localmente:

```sh
npm run preview
```

Scripts disponibles: `dev` inicia Vite; `typecheck` ejecuta `vue-tsc --noEmit`; `build` tipa y genera el build de Vite; `preview` sirve ese build. No hay lockfile listado, por lo que `npm install` resuelve las versiones admitidas por los rangos de `package.json`.

## Pruebas

```sh
npm test              # Vitest unitarias y de componentes
npm run test:watch    # Vitest interactivo
npm run test:e2e      # Playwright: tests/e2e
```

La configuración de Vitest incluye `tests/unit/**/*.spec.ts` y `tests/component/**/*.spec.ts` en jsdom. La prueba E2E usa `@playwright/test` y espera el servidor en `http://localhost:5173`; iniciar `npm run dev` en otra terminal antes de correrla. La configuración no levanta servidor automáticamente. No se han ejecutado estas pruebas durante esta entrega.

## Arquitectura e integración

La interfaz está organizada en `src/components` (atoms, molecules, organisms y templates), `src/pages` y `src/composables`. Los tipos de dominio están en `src/domain`; la implementación de datos y selección del adaptador, en `src/infrastructure`.

`CardsRepository` define el puerto asíncrono `listCards()` y `listMovements(cardId, filter?)`. Actualmente `repository-factory.ts` admite únicamente `mock` (predeterminado), implementado por `MockCardsRepository` con fixtures locales y latencia simulada. `VITE_CARDS_SOURCE` puede valer `mock`; otro valor falla explícitamente porque no existe adaptador HTTP.

Para integrar un backend real, definir primero contrato y autenticación con el sistema host; implementar un adaptador de `CardsRepository`, validar las respuestas externas antes de mapearlas a los tipos del dominio y registrarlo en la fábrica. Mantener errores traducibles y no registrar PAN completo, credenciales ni datos sensibles. Esta aplicación no define URL, endpoints, autenticación, CORS ni contrato de API; no realiza llamadas de red.

## Persistencia y datos

No hay persistencia del lado cliente: los fixtures de demostración viven en memoria y no se usan `localStorage` ni `sessionStorage`. No se deben persistir datos de tarjeta en el navegador. La persistencia de producción pertenece al backend, cuya tecnología, esquema, retención y política de datos no están especificados aquí. La vista presenta el PAN enmascarado; usar datos ficticios en desarrollo.

## Configuración y seguridad

`VITE_LOCALE` se menciona como locale opcional en la configuración anterior, pero no se observa que la aplicación lo consuma: el formateador tiene su propia configuración. No se requiere archivo `.env` para el modo mock. Las variables `VITE_*` quedan expuestas al cliente; nunca colocar secretos, tokens o credenciales en ellas. La autenticación y el enrutamiento se consideran responsabilidad de la aplicación host.

## Estructura relevante

- `src/domain/`: contratos y tipos.
- `src/infrastructure/`: fixtures, repositorio mock y fábrica.
- `src/composables/useCardsQuery.ts`: carga de tarjetas, selección y consulta/filtro de movimientos.
- `src/pages/TarjetasConsultaPage.vue`: composición de estados loading, empty, error y ready.
- `tests/unit`, `tests/component`, `tests/e2e`: pruebas existentes.
