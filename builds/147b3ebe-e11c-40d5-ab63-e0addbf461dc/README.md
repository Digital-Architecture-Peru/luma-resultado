# Consulta de tarjetas · Banca por Internet

Aplicación de consulta construida con Vue 3, TypeScript y Vite. Presenta tarjetas ficticias, permite filtrar por alias/marca/últimos cuatro dígitos y estado, y muestra números enmascarados. Es una demo de solo lectura: no procesa pagos ni modifica tarjetas.

## Requisitos

- Node.js compatible con Vite 5 (Node.js 18 o superior recomendado).
- npm.

## Instalar, ejecutar y probar

Desde la raíz del proyecto:

```sh
npm install
npm run dev
```

Vite mostrará la URL local de desarrollo en la terminal. Para validar tipos y generar el bundle de producción:

```sh
npm run build
```

Para servir localmente el bundle generado, primero ejecuta `npm run build` y luego:

```sh
npm run preview
```

Ejecuta la suite de pruebas en modo no interactivo con:

```sh
npm test
```

Las pruebas usan Vitest con jsdom. `src/domain/card.test.ts` cubre el enmascaramiento y los criterios de filtrado; `src/components/templates/CardsPage.test.ts` cubre carga, presentación, filtros, estado vacío, error y reintento.

## Estructura y comportamiento

- `src/domain/card.ts`: tipos, etiquetas y funciones puras de dominio para filtrar, enmascarar y dar formato a importes.
- `src/services/cardRepository.ts`: puerto `CardRepository` y adaptador `InMemoryCardRepository`, que devuelve cuatro registros ficticios.
- `src/composables/useCards.ts`: carga y estado `idle | loading | success | error`.
- `src/components`: interfaz organizada en átomos, moléculas, organismo y template.
- `src/App.vue`: punto de composición que instancia el repositorio en memoria.

## Integración y persistencia

Actualmente **no hay integración con un backend ni persistencia**. Cada carga obtiene los registros estáticos de `InMemoryCardRepository`; no se guardan datos entre sesiones y no se realizan escrituras. Los datos de ejemplo son ficticios.

Para conectar un servicio real, implementar `CardRepository` con un adaptador HTTP y sustituir la instancia en `src/App.vue`. El contrato existente solo requiere `list(): Promise<Card[]>`; el formato de respuesta, autenticación, manejo de expiración de sesión, errores de red y políticas de reintento deben acordarse con el backend antes de integrar. Validar la respuesta externa antes de tratarla como `Card[]`, y no registrar datos sensibles.

Si el endpoint requiere configuración, puede definirse una variable Vite, por ejemplo `VITE_CARDS_API_URL`, en un archivo `.env.local` no versionado. Esta variable es solo una propuesta para el adaptador futuro: el código actual no la lee ni incluye un cliente HTTP. Las variables `VITE_*` quedan expuestas en el bundle del navegador; nunca colocar secretos, tokens privados o credenciales en ellas. La autenticación debe resolverse mediante el mecanismo aprobado por el backend y la plataforma.

No almacenar números completos de tarjeta. El modelo de interfaz contiene `last4` y el componente muestra únicamente esos cuatro dígitos enmascarados; mantener ese límite también en cualquier adaptador y contrato de API.

## Estado de verificación

Este README documenta los comandos configurados en `package.json`; no implica que build o pruebas se hayan ejecutado en este entorno.
