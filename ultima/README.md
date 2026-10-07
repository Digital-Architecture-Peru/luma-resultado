# Consulta de tarjetas

Aplicación frontend de consulta de tarjetas, construida con Vue 3, TypeScript y Vite. Presenta una lista seleccionable y el detalle de la tarjeta, con estados de carga, vacío y error. El estado de datos reside en el composable `useCards`; no hay backend conectado.

## Requisitos

- Node.js compatible con Vite 5 (Node.js 18+ recomendado).
- npm.

## Instalar, ejecutar y compilar

Desde la raíz del proyecto:

```sh
npm install
npm run dev
```

Vite mostrará la URL local en la terminal. Para generar la versión de producción y servirla localmente:

```sh
npm run build
npm run preview
```

`npm run build` ejecuta primero la comprobación de tipos de Vue (`vue-tsc --noEmit`) y luego crea los artefactos de Vite en `dist/`.

## Comprobaciones y pruebas

```sh
npm run typecheck  # comprobación TypeScript y componentes Vue
npm test           # suite Vitest en entorno jsdom, una ejecución
```

Las pruebas existentes cubren formato del dominio, componentes, página, estados del composable y comportamiento del repositorio en memoria. Para desarrollar la suite en modo interactivo se puede invocar `npx vitest` (requiere dependencias instaladas).

## Configuración

`src/config.ts` lee variables de entorno de Vite:

| Variable | Valor predeterminado | Uso |
|---|---|---|
| `VITE_LOCALE` | `es-PE` | Configuración regional de presentación |
| `VITE_DEFAULT_CURRENCY` | `PEN` | Moneda predeterminada |

Se pueden establecer en `.env.local` en la raíz del proyecto; por ejemplo:

```dotenv
VITE_LOCALE=es-PE
VITE_DEFAULT_CURRENCY=PEN
```

No se necesita `.env.example` para ejecutar la aplicación. Las variables con prefijo `VITE_` se exponen al código del navegador: no colocar secretos ni credenciales en ellas.

## Arquitectura e integración de datos

- `src/domain/`: modelo `Card` y formateadores.
- `src/data/CardsRepository.ts`: contrato de datos (`list` y `getById`).
- `src/data/inMemoryCardsRepository.ts` y `src/data/fixtures/cards.ts`: implementación y datos ficticios usados actualmente.
- `src/composables/useCards.ts`: carga, selección y estados de presentación.
- `src/components/` y `src/pages/CardsConsultaPage.vue`: interfaz organizada en átomos, moléculas, organismos, plantilla y página.

La página acepta opcionalmente una implementación `repository` de `CardsRepository`; si no se proporciona, crea `InMemoryCardsRepository`. Para integrar una API, impleméntese ese contrato en un adaptador separado y pásese a la página, conservando el modelo de dominio y manejando errores de red en el adaptador. No hay llamadas HTTP ni servicio externo configurado en el estado actual; configurar un endpoint por sí solo no conecta una API.

## Persistencia y datos

No existe persistencia. El repositorio en memoria inicializa sus datos desde fixtures ficticios; los cambios no sobreviven a una recarga y no se escriben en almacenamiento local ni en una base de datos. Para persistir, debe añadirse un adaptador de repositorio apropiado al servicio elegido, sin acoplar la UI a detalles de almacenamiento.

El modelo solo contempla `last4` (los últimos cuatro dígitos), no el número completo de tarjeta (PAN). Las fixtures son únicamente datos de demostración y no deben sustituirse por datos reales sensibles.

## Estado de verificación

Se documentan scripts declarados en `package.json` y la estructura observada del proyecto. No se ejecutaron instalación, compilación, servidor ni pruebas en este entorno; sus resultados quedan sin verificar.
