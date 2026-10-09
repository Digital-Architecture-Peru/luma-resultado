# Banca por Internet — Transacción de pagos

Frontend Angular 17 standalone para simular pagos entre cuentas ficticias. La interfaz se organiza con Atomic Design; las reglas de validación son funciones puras y la UI interactúa con los casos de uso mediante `PaymentsFacade` y el puerto abstracto `PaymentGateway`.

## Requisitos

- Node.js compatible con Angular CLI 17 (Node.js 18.13+ o 20.9+).
- npm.

## Instalar, compilar y ejecutar

Desde la raíz del proyecto:

```sh
npm install
npm start
```

El servidor de desarrollo de Angular CLI estará disponible normalmente en `http://localhost:4200/` y recargará cambios automáticamente.

Para validar tipos y crear el bundle de producción:

```sh
npm run build
```

Este script ejecuta primero `tsc --noEmit -p tsconfig.app.json` y luego `ng build`; la salida de Angular se genera en `dist/banca-pagos`.

## Pruebas

```sh
npm test
```

Jest se ejecuta en modo CI, en una sola pasada y sin modo watch. Las pruebas cubren validaciones de pagos, el adaptador ficticio, la fachada y el formulario.

## Estructura y flujo

- `src/app/atoms/`: botón y badge reutilizables.
- `src/app/molecules/`: control de campo con etiqueta y error.
- `src/app/organisms/`: formulario y listado de historial.
- `src/app/core/payment.model.ts`: modelos de cuentas, borrador, pago y feedback.
- `src/app/core/payment.validator.ts`: validaciones puras de cuenta, beneficiario, monto, saldo y concepto.
- `src/app/core/payment.gateway.ts`: puerto de integración.
- `src/app/core/in-memory-payment.gateway.ts`: implementación simulada.
- `src/app/core/payments.facade.ts`: estado reactivo y coordinación de carga/envío.
- `src/app/app.config.ts`: composición de dependencias; actualmente enlaza el puerto a `InMemoryPaymentGateway`.

Al enviar un pago, el gateway valida de nuevo las reglas, descuenta el saldo en memoria y agrega el pago al historial. La fachada actualiza las señales de cuentas e historial y presenta feedback accesible.

## Integración con backend

No hay llamadas HTTP ni servicio backend configurado. Para integrar uno, conserva `PaymentGateway` como puerto y agrega un adaptador que lo implemente usando `HttpClient` (por ejemplo, operaciones para listar cuentas, consultar pagos y enviar un pago). Registra `provideHttpClient()` y sustituye en `src/app/app.config.ts` el proveedor por el nuevo adaptador. Define y acuerda con el backend los contratos, estados de error, autenticación, idempotencia y formato de fechas antes de habilitar pagos reales. Maneja errores de red de forma explícita y no registres datos sensibles.

La URL del servicio debe provenir de configuración de despliegue/entorno adecuada al proceso de build; no incluyas credenciales o secretos en el bundle del navegador, pues las variables frontend son públicas. La autenticación y autorización deben validarse en el servidor.

## Persistencia y seguridad

Actualmente no existe persistencia: las dos cuentas de ejemplo se inicializan en `InMemoryPaymentGateway`, el historial comienza vacío y cualquier saldo o pago se pierde al recargar la página. Los datos son ficticios; esta aplicación no procesa dinero real. En producción, el backend debe ser la fuente de verdad y persistir pagos y saldos de forma transaccional, volver a validar saldo y permisos en el servidor, y proteger las operaciones contra reintentos duplicados. No se almacena información de pagos en el navegador.
