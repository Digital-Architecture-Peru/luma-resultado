# Consulta de Tarjetas · Banca por Internet

Aplicación de consulta construida con Vue 3, TypeScript y Vite. Presenta el listado de tarjetas, detalle (límite, disponible y estado) y movimientos asociados. Usa Atomic Design y datos ficticios mediante un gateway en memoria. No realiza operaciones financieras.

## Requisitos

- Node.js 18 o posterior y npm.
- Dependencias fijadas en `package.json`; no requiere servicios externos.

## Instalar, ejecutar y compilar

Desde la raíz del proyecto:

```sh
npm install
npm run dev
```

Vite muestra la URL local en la terminal. Para generar la distribución de producción:

```sh
npm run build
npm run preview
```

`build` ejecuta primero la comprobación de tipos con `vue-tsc --noEmit` y después genera los archivos estáticos en `dist/`. `preview` sirve localmente esa distribución. El proyecto no se ha ejecutado en este entorno; verifica estos comandos en tu entorno o CI.

## Pruebas

```sh
npm test
npm run typecheck
```

Vitest ejecuta pruebas de `tests/unit/**/*.spec.ts` en jsdom. Las pruebas cubren componentes/átomos, lista de tarjetas, gateway ficticio y composable de consulta. No hay llamadas a servicios reales.

## Estructura y flujo

- `src/domain/card.ts`: contratos de tarjeta y movimiento y etiquetas de estado.
- `src/services/cards-gateway.ts`: interfaz que desacopla la UI del origen de datos.
- `src/services/mock-cards-gateway.ts`: datos ficticios usados por defecto, con latencia simulada.
- `src/composables/useCardsQuery.ts`: carga, selección y estado de error/carga.
- `src/components/`: átomos, moléculas, organismos y plantilla.
- `src/pages/CardsConsultPage.vue`: composición de la pantalla; admite un gateway opcional mediante la prop `gateway`.

## Integración

El backend y el contrato HTTP no están definidos ni conectados. Para integrar una API, implementa `CardsGateway` en un adaptador de servicio y proporciona esa instancia a `CardsConsultPage`; el adaptador debe transformar respuestas externas al modelo de `src/domain/card.ts` y manejar errores de transporte sin filtrarlos a la UI. La interfaz requiere `listCards(): Promise<Card[]>` y `getMovements(cardId: string): Promise<CardMovement[]>`.

La aplicación no implementa autenticación, autorización, sesión, rutas del shell bancario ni configuración de URL de API. Deben resolverse en la integración anfitriona. No se necesita `.env` para el modo demo y no hay secretos en el repositorio.

## Persistencia y datos

No existe persistencia: tarjetas y movimientos demo viven en memoria en `MockCardsGateway`; selecciones y resultados viven en el estado reactivo del composable y se pierden al recargar. No se usa `localStorage`, base de datos ni caché. Para producción, el backend debe ser la fuente autorizada de datos y la integración debe definir su política de almacenamiento y retención; no guardar datos de tarjeta sensibles en el navegador.

El dominio expone únicamente `last4`; nunca representa ni solicita el PAN completo. Los registros presentes son datos ficticios.
