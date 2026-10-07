# Consulta de tarjetas

Microaplicación de consulta construida con Vue 3, TypeScript y Vite. Presenta un listado de tarjetas ficticias y permite consultar el detalle seleccionado. Está organizada con Atomic Design; la carga/estado se coordina en `src/composables/useCards.ts` y el acceso a datos queda detrás de `CardsRepository`.

## Requisitos

- Node.js compatible con Vite 5 (Node.js 18+ recomendado).
- npm.

## Instalar, ejecutar y probar

Desde el directorio del proyecto:

```sh
npm install
cp env.example.txt .env
npm run dev
```

Vite imprime la URL local en la terminal. Para compilar y previsualizar la versión de producción:

```sh
npm run build
npm run preview
```

El script `build` ejecuta `vue-tsc --noEmit` y después `vite build`. Ejecuta las pruebas unitarias con:

```sh
npm test
```

Vitest ejecuta las pruebas bajo `tests/unit/`, que cubren el composable, el listado, los formateadores y el número enmascarado. No hay lockfile en el proyecto: `npm install` resuelve las dependencias declaradas en `package.json` y puede generar `package-lock.json`. En un checkout con lockfile, preferir `npm ci`.

## Configuración

`env.example.txt` puede copiarse a `.env` para desarrollo. `VITE_CARDS_DATA_SOURCE` acepta actualmente solo `mock` (valor por defecto si está ausente o vacío). La factoría rechaza otros valores; no hay endpoint HTTP configurado. Las variables `VITE_*` se incorporan al bundle del navegador: no incluir secretos ni credenciales.

## Integración

El puerto `src/services/CardsRepository.ts` define `list(): Promise<Card[]>` y `getById(id: string): Promise<Card | null>`. `MockCardsRepository` implementa el contrato usando los datos ficticios de `src/mocks/cards.fixture.ts`; permite simular demora y fallos. `repositoryFactory.ts` selecciona la implementación y la página consume el repositorio mediante `useCards`.

Para conectar un servicio real, crear una implementación HTTP de `CardsRepository` y registrarla en `repositoryFactory.ts`. Antes de habilitarla, acordar el contrato backend (ruta, autenticación, esquema de respuesta y errores, timeout y reintentos). El contrato real y la autenticación no están definidos aquí; la aplicación host es responsable de sesión, autorización, navegación y layout global. Evitar exponer información sensible en errores y logs.

## Persistencia y datos

La aplicación es de solo lectura: no tiene almacenamiento local, base de datos ni escrituras. La persistencia, si se requiere, corresponde a la integración/backend y debe diseñarse aparte. Los datos actuales son fixtures ficticios. El modelo `Card` solo contiene `last4`; no debe ampliarse para exponer el PAN completo, CVV u otros datos sensibles de autenticación.

## Alcance y verificación

El alcance incluye listado y detalle con estado, límite y saldo disponible; movimientos y operaciones sobre tarjetas están fuera de alcance. Se contemplan estados de carga, error y lista vacía. No se ejecutaron instalación, compilación ni pruebas durante la elaboración de este README.
