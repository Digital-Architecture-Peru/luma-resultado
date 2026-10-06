# Consulta de tarjetas · Banca por Internet

Aplicación de consulta de tarjetas construida con Vue 3, TypeScript y Vite. La interfaz sigue Atomic Design (`atoms → molecules → organisms → templates → pages`) y es de solo lectura. El código se entrega como **candidate**: no se ejecutaron instalación, compilación ni pruebas en este entorno.

## Requisitos

- Node.js compatible con Vite 5 (Node.js 18 o posterior recomendado).
- npm.

## Instalar, ejecutar y probar

Desde la raíz del proyecto:

```bash
npm install
npm run dev
```

Vite muestra en la terminal la URL local de desarrollo. Para validar tipos y construir la versión de producción:

```bash
npm run typecheck
npm run build
npm run preview
```

`npm run build` ejecuta `vue-tsc --noEmit` y después `vite build`; `npm run preview` sirve el artefacto generado en `dist/`. Para correr las pruebas una vez o en modo interactivo:

```bash
npm test
npm run test:watch
```

Vitest usa jsdom. Las pruebas están en `tests/unit`, `tests/component` y `tests/integration`; cubren formateadores, estados y selección de consulta, componentes y el flujo de la página. No se ha configurado E2E ni un umbral de cobertura.

## Configuración

`VITE_LOCALE` y `VITE_CURRENCY` son variables de entorno opcionales que Vite expone al cliente; sus valores predeterminados son `es-PE` y `PEN`. Por ejemplo, pueden definirse en un archivo `.env.local` ignorado por control de versiones o en el entorno del proceso:

```dotenv
VITE_LOCALE=es-PE
VITE_CURRENCY=PEN
```

No hay `.env.example` en el repositorio porque no se requieren variables para arrancar. Toda variable `VITE_*` se incorpora al bundle público: no poner secretos, credenciales ni datos privados en ellas.

## Integración y datos

No existe integración con API, backend ni proveedor externo. `src/main.ts` compone la aplicación e inyecta `InMemoryCardRepository` mediante `cardRepositoryKey`. La página `src/pages/CardsQueryPage.vue` consume el puerto de dominio `CardRepository` (`src/domain/cardRepository.ts`), cuya interfaz actual expone `listCards(): Promise<Card[]>`. La implementación en memoria (`src/infrastructure/inMemoryCardRepository.ts`) devuelve copias de los fixtures ficticios de `src/infrastructure/fixtures/cards.ts`.

Para integrar una API, implementar `CardRepository` en una nueva clase de infraestructura, hacer la solicitud en `listCards`, validar y transformar la respuesta al tipo `Card`, manejar errores y reemplazar el proveedor del repositorio en `src/main.ts`. El composable `useCardQuery` ya traduce fallos de carga a un estado de error con opción de reintento. No se hacen peticiones de red actualmente. Una integración real debe definir autenticación/autorización y protección de transporte en el backend; nunca incluir secretos en el frontend ni registrar datos sensibles.

## Persistencia y datos sensibles

No se configura persistencia: el repositorio conserva datos solo en memoria durante la sesión y no usa localStorage, sessionStorage, cookies ni base de datos. Los fixtures son ejemplos ficticios, no datos de clientes. El modelo `Card` contiene únicamente `last4`, no el PAN completo. Si en el futuro se requiere persistencia, decidirla e implementarla detrás de una nueva abstracción de repositorio, con controles de acceso y minimización de datos apropiados; esta aplicación no proporciona esos controles de backend.

## Estructura relevante

- `src/domain/`: tipos `Card` y puerto `CardRepository`.
- `src/infrastructure/`: repositorio en memoria y fixtures ficticios.
- `src/composables/`: consulta reactiva y formateadores.
- `src/components/`: componentes organizados por Atomic Design.
- `src/pages/`: página de consulta.
- `tests/`: pruebas unitarias, de componentes e integración de página.

## Estado de validación

Los comandos anteriores documentan cómo validar el proyecto, pero no fueron ejecutados al preparar este README. La compilación y el resultado de las pruebas quedan pendientes de verificación en un entorno con dependencias instaladas.
