# Transacción de tarjetas — Vue 3 + TypeScript

Aplicación frontend mobile-first para simular pagos con tarjeta. Incluye formulario, validación, saldo disponible y movimientos. La integración actual es ficticia: los datos viven solo en memoria y se reinician al recargar o reiniciar la aplicación. No procesa pagos reales.

## Requisitos

- Node.js compatible con la versión de Vite 5 (Node.js 18+ recomendado).
- npm.

## Instalar, ejecutar y probar

```sh
npm install
npm run dev
```

Vite imprime la URL local en la terminal. Para compilar y ejecutar la suite de pruebas:

```sh
npm run build   # vue-tsc --noEmit y luego build de producción con Vite
npm test        # Vitest, una ejecución no interactiva
```

Para inspeccionar localmente el build, después de compilar:

```sh
npm run preview
```

## Estructura

- `src/domain/`: tipos y reglas puras de validación.
- `src/services/transactionGateway.ts`: contrato `TransactionGateway` y adaptador en memoria.
- `src/composables/useTransactions.ts`: estado y operaciones asíncronas de la pantalla.
- `src/components/`: interfaz organizada en átomos, moléculas, organismos, plantilla y página.
- `src/App.vue`: composición de la página y el adaptador concreto.
- `tests/`: pruebas unitarias de validación, gateway y componentes/página (Vitest + jsdom).

## Integración

No hay API, URL base ni servicio de pagos configurado. `TransactionGateway` es el límite de integración. Para conectar un backend, implementar sus tres operaciones (`listCards`, `listTransactions`, `submit`) en un adaptador que satisfaga la interfaz, y seleccionarlo desde `src/App.vue`, manteniendo la vista desacoplada del transporte. No se debe confiar en la validación del navegador: el servidor debe volver a validar tarjeta, saldo, monto y comercio, aplicar autorización y devolver errores manejables.

Si el adaptador usa HTTP, puede leer una URL pública de configuración como `import.meta.env.VITE_API_BASE_URL` con tipos Vite y `.env.local` ignorado por Git. Vite incorpora las variables `VITE_*` al bundle del cliente: nunca poner secretos, tokens privados ni credenciales en ellas. Definir el endpoint, autenticación, formato de errores, límites y política de reintentos junto con el contrato del backend antes de habilitar esa integración. Actualmente la app no lee esa variable ni realiza solicitudes de red.

## Persistencia y datos

El gateway en memoria inicializa tarjetas ficticias en `src/services/transactionGateway.ts`; los movimientos y saldos modificados existen solo durante la vida de esa instancia. No hay almacenamiento local ni base de datos, y recargar restablece los valores semilla. Para persistencia real, implementarla en el servicio backend detrás del mismo contrato, con almacenamiento transaccional y controles de autorización; no tratar datos del cliente como fuente de verdad. Los identificadores, saldos y fechas actuales son únicamente datos de demostración.

## Estado de verificación

Este documento describe los scripts declarados en `package.json`; no se ejecutaron build ni pruebas al redactarlo.
