# Banca por Internet · Consulta de tarjetas

Aplicación frontend de consulta construida con Vue 3, TypeScript, Vue Router y Vite. Presenta tarjetas, detalle financiero y movimientos. Los datos por defecto son fixtures ficticios; no hay autenticación ni escritura de operaciones.

## Requisitos

- Node.js compatible con Vite 5 (Node.js 18 o superior recomendado).
- npm.

## Instalar, ejecutar y verificar

```sh
npm install
npm run dev        # servidor local de desarrollo (Vite)
npm run typecheck  # comprobación estática con vue-tsc
npm test           # suite Vitest en modo run
npm run test:watch # modo interactivo
npm run build      # typecheck y bundle de producción en dist/
npm run preview    # servir localmente el bundle generado
```

La aplicación se sirve en `/tarjetas`; `/` redirige allí. Para probar el build local, ejecutar `npm run build` y después `npm run preview`. La ejecución de estos comandos no se ha verificado en este entorno.

## Configuración

Vite expone variables `VITE_*` al código cliente: no colocar secretos, credenciales ni datos personales en ellas.

| Variable | Uso |
| --- | --- |
| `VITE_CARDS_ADAPTER` | `mock` (predeterminado) o `http`. |
| `VITE_API_BASE_URL` | Base URL requerida al elegir `http`. |
| `VITE_LOCALE` | Locale de formato, predeterminado `es`. |

Crear un `.env` local si hace falta; no se requiere para el modo mock. Ejemplo de configuración local, sin secretos:

```dotenv
VITE_CARDS_ADAPTER=mock
VITE_LOCALE=es
```

Para seleccionar `http`, establecer además `VITE_API_BASE_URL`. Reiniciar Vite al cambiar variables de entorno.

## Estructura y arquitectura

- `src/pages/`: páginas para listado y detalle.
- `src/components/`: componentes organizados en atoms, molecules, organisms y templates.
- `src/composables/`: carga de listado/detalle, estados de carga, error y no encontrado.
- `src/domain/`: tipos y formato/enmascaramiento de datos.
- `src/services/CardsGateway.ts`: puerto de acceso a datos; `MockCardsGateway` proporciona fixtures locales.
- `src/services/gatewayFactory.ts`: selecciona el adaptador según configuración.
- `tests/`: pruebas unitarias, componentes e integración de navegación.

La interfaz `CardsGateway` define `listCards()`, `getCard(id)` y `getMovements(id)`. El mock implementa estas operaciones en memoria. El adaptador `HttpCardsGateway` es actualmente un stub: aunque se puede seleccionar mediante configuración, sus métodos lanzan un error porque el contrato backend aún no está definido. No representa una integración HTTP funcional.

## Integración pendiente

Antes de implementar el adaptador HTTP, acordar con el backend rutas, método, autenticación provista por el shell de banca, esquema y validación de respuestas, paginación/orden de movimientos, manejo de errores y política de timeout. El contrato de dominio actual está en `src/domain/card.ts`; los identificadores de tarjeta se pasan al gateway. No hay llamadas remotas en la configuración predeterminada. No enviar PAN completo ni datos sensibles que la pantalla no necesita; el frontend presenta únicamente los últimos cuatro dígitos mediante el componente de PAN enmascarado.

## Persistencia y datos

No existe persistencia cliente ni backend implementado por esta aplicación: no usa `localStorage`, `sessionStorage` ni IndexedDB. El mock obtiene datos de `src/mocks/cards.fixture.ts` y no los guarda. La integración, autenticación y almacenamiento de datos deben ser provistos por el entorno bancario/backend y diseñados antes de habilitar el adaptador HTTP.

## Pruebas

Vitest usa jsdom. Las pruebas existentes verifican formato de importes/fechas y enmascaramiento, selección del gateway, componentes y flujo de listado a detalle; la integración verifica que el modo mock no invoque `fetch`, además de estados de error y no encontrado. Ejecutar con `npm test`. No se afirma que las pruebas o el build pasen sin ejecutarlos.
