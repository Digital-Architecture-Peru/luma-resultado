# Banca por Internet · Transacción de Pagos

Frontend demostrativo de pagos construido con Vue 3, TypeScript y Vite. La interfaz utiliza componentes organizados por Atomic Design y muestra datos completamente ficticios. **No procesa pagos reales ni debe utilizarse con información financiera real.**

## Requisitos

- Node.js compatible con Vite 5 (Node.js 18 o posterior recomendado).
- npm.

## Instalar, desarrollar y compilar

Desde la raíz del proyecto:

```sh
npm install
npm run dev
```

Vite mostrará la dirección local de desarrollo en la terminal. Para generar y revisar el build de producción:

```sh
npm run build
npm run preview
```

El script `build` ejecuta primero `vue-tsc --noEmit` para comprobar tipos y después `vite build`. `preview` sirve localmente el resultado de `dist`; no es un servidor de producción.

## Pruebas

```sh
npm test
```

Vitest corre una sola vez en entorno jsdom. Las pruebas cubren parsing y validación del dominio, el composable de pagos, el adaptador en memoria y componentes/página (incluidos casos de éxito, errores y accesibilidad de campos).

## Estructura

- `src/domain/payment.ts`: contratos del dominio, conversión de importes, validación y formato monetario.
- `src/services/paymentGateway.ts`: interfaz `PaymentGateway` y adaptador ficticio en memoria.
- `src/composables/usePayment.ts`: carga de datos, envío y estado de la operación.
- `src/components/`: átomos, moléculas, organismos y página de pagos.
- `src/App.vue`: composición de la aplicación; actualmente instancia el adaptador en memoria.
- `tests/`: pruebas Vitest.

## Integración

No hay integración de backend configurada. `PaymentGateway` (`src/services/paymentGateway.ts`) es el límite de integración, y `PaymentPage` recibe el gateway como dependencia. Para conectar un servicio real, implementar un adaptador que cumpla `listAccounts()`, `listBeneficiaries()` y `submit(request)`, y sustituir la instancia `InMemoryPaymentGateway` en `src/App.vue` por dicho adaptador. Definir antes el contrato API, autenticación, autorización, idempotencia, tratamiento de errores y validaciones del lado servidor. La validación del navegador no sustituye controles de seguridad del servidor.

`VITE_PAYMENTS_API_URL` está documentada como variable opcional prevista para un adaptador HTTP futuro; **el código actual no la lee ni realiza solicitudes HTTP**. Si se incorpora, Vite expone las variables `VITE_*` al cliente: no guardar secretos, credenciales ni tokens en ellas.

## Persistencia y límites

El adaptador actual conserva cuentas y saldo solo en memoria durante la vida de la instancia de la aplicación. Los datos ficticios, referencias secuenciales e historial del composable se pierden al recargar o cerrar la página. No existe persistencia local, base de datos ni almacenamiento remoto. En producción, los saldos y pagos deben ser autoritativos en el backend; nunca confiar en el estado o importes enviados por el cliente.

## Estado de verificación

Los comandos anteriores describen cómo verificar el proyecto; no se ejecutaron durante la preparación de esta documentación. Ejecutar build y pruebas en el entorno destino antes de integrar o desplegar.
