# Transacciones de tarjetas

Aplicación web Angular 18 para simular pagos de tarjeta y avances de efectivo sobre tarjetas ficticias. Usa componentes standalone, signals y una arquitectura por capas; no se conecta a un banco ni a un servicio remoto.

## Requisitos

- Node.js compatible con Angular 18 (Node 18.19+ o 20.11+).
- npm.

## Instalación y ejecución

Desde la raíz del proyecto:

```sh
npm install
npm start
```

Abra <http://localhost:4200>. `npm start` ejecuta `ng serve` en modo desarrollo y recarga al editar fuentes.

## Compilación y pruebas

```sh
npm run build
npm test
```

`npm run build` ejecuta la compilación Angular de producción y un chequeo de tipos de las pruebas (`tsc -p tsconfig.spec.json --noEmit`). `npm test` ejecuta Vitest en modo no interactivo (`vitest run`). Las pruebas existentes cubren reglas de dominio y la fachada de transacciones; no hay pruebas de componentes con TestBed.

## Arquitectura

- `src/app/domain`: tipos, reglas de validación y cálculos en centavos; `CardGateway` define el puerto de integración.
- `src/app/adapters`: `InMemoryCardGateway` y `SEED_CARDS`, datos totalmente ficticios.
- `src/app/application`: `TransactionFacade`, coordinación y estado reactivo con signals.
- `src/app/ui`: componentes de interfaz organizados en atoms, molecules, organisms y pages.
- `src/app/app.config.ts`: composición de dependencias e inyección del gateway.

## Integración con backend

Actualmente la integración es simulada y no definida: `InMemoryCardGateway` satisface el contrato `CardGateway`, añade una latencia simulada y mantiene datos solo en memoria. Para conectar un backend, implemente un adaptador HTTP que extienda `CardGateway`, traduzca respuestas y errores del contrato de API a los tipos de dominio, e inyéctelo en `src/app/app.config.ts` en sustitución del adaptador en memoria. La integración real debe definir autenticación, autorización, idempotencia de operaciones, manejo de errores y validación final en servidor; las validaciones del navegador no sustituyen controles del servidor. Configure URL y parámetros por ambiente/deployment y no incluya secretos en el bundle frontend.

No existe endpoint, contrato HTTP, backend ni credenciales configurados en este proyecto.

## Persistencia y datos

No hay persistencia local o remota. El gateway mantiene las tarjetas en memoria, inicializadas desde `SEED_CARDS`; el historial de recibos y el estado de la fachada también viven en memoria. Al recargar o cerrar la aplicación se reinician con los datos ficticios. No se usa localStorage, IndexedDB ni base de datos.
