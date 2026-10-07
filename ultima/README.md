# Portal de empresas · Transacciones con tarjeta

Aplicación frontend para registrar transacciones de tarjetas corporativas. Está construida con Vue 3, TypeScript y Vite, con componentes organizados en Atomic Design.

## Requisitos

- Node.js compatible con Vite 5 (Node.js 18+ recomendado).
- npm.

## Instalar, ejecutar y verificar

```sh
npm install
npm run dev
```

Vite mostrará la URL local de desarrollo en la terminal. Para comprobación estática de tipos y generar el bundle de producción:

```sh
npm run build
npm run preview
```

`npm run build` ejecuta primero `vue-tsc --noEmit` y después `vite build`. `npm run preview` sirve localmente el bundle ya generado; no reemplaza un servidor de producción.

Ejecutar todas las pruebas una vez, sin modo interactivo:

```sh
npm test
```

Vitest usa jsdom. Las pruebas bajo `tests/` verifican validación de entradas, comportamiento del gateway en memoria, formulario y flujo de la página.

## Diseño y flujo

`src/App.vue` es el punto de composición; crea `InMemoryGateway` y lo entrega a `TransactionPage`. La página coordina el formulario y el historial. La validación de borradores reside en `src/domain/validation.ts`; los contratos de dominio están en `src/domain/types.ts`.

`TransactionGateway` (`src/services/transactionGateway.ts`) es el puerto de integración: define `listCards()`, `listTransactions()` y `submit(request)`. `InMemoryGateway` implementa ese contrato usando tarjetas de demostración (`SAMPLE_CARDS`), crea registros aprobados y descuenta el cupo en memoria. El estado se pierde al recargar o reiniciar la aplicación. Los datos son ficticios; no se comunica con un banco ni procesa pagos reales.

## Integración y persistencia

La integración HTTP y una persistencia duradera están **pendientes de definir e implementar**. Para conectarlas, se recomienda implementar otro adaptador de `TransactionGateway`, manteniendo sus tipos y errores explícitos, y sustituir la instancia en `src/App.vue`. La interfaz actual no define rutas, autenticación, formato de errores de servidor, reintentos ni esquema de almacenamiento; esos contratos deben acordarse con el backend antes de implementar el adaptador.

Si se acuerda una URL base configurable, puede exponerse en Vite mediante una variable `VITE_API_BASE_URL` definida en un archivo local `.env` (no incluido en el repositorio) o en el entorno de despliegue. Las variables `VITE_*` quedan embebidas en el bundle del navegador: nunca deben contener secretos, tokens privados ni credenciales. No se requiere variable de entorno para ejecutar el gateway actual.

Al introducir persistencia remota, las reglas de negocio y cupos también deben validarse en el servidor; la validación cliente es solo una ayuda de interfaz y no constituye una frontera de seguridad. Usar HTTPS y no almacenar datos de tarjeta sensibles en este frontend.

## Estructura relevante

- `src/components/atoms/`, `molecules/`, `organisms/`, `templates/`: interfaz.
- `src/composables/useTransactions.ts`: estado y coordinación del ciclo de carga/envío.
- `src/domain/`: modelos, formato y validación.
- `src/services/`: interfaz del gateway y adaptador en memoria.
- `tests/`: pruebas de validación, gateway y componentes.

## Estado de verificación

Los comandos anteriores describen cómo compilar y probar el proyecto; no se ejecutaron durante la elaboración de esta documentación. Ejecuta `npm run build` y `npm test` en el entorno de desarrollo o CI para verificarlo.
