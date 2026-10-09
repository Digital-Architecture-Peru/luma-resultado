# Pago de tarjetas · Banca por Internet

Frontend de demostración para realizar pagos a tarjetas desde una cuenta. Construido con Angular 19 standalone y signals; componentes organizados con Atomic Design. Los datos y las transacciones son ficticios.

## Requisitos

- Node.js compatible con la versión de Angular CLI 19 y npm.
- Instalar dependencias desde la raíz del proyecto con `npm install`.

## Compilar y ejecutar

```sh
npm install
npm run build
npm start
```

`npm run build` ejecuta `ng build` en la configuración de producción predeterminada. `npm start` inicia el servidor Angular de desarrollo; abre la URL local que informa la CLI (normalmente `http://localhost:4200`). Para compilar explícitamente en modo desarrollo: `npx ng build --configuration development`.

## Pruebas

```sh
npm test
```

El comando ejecuta Vitest en modo no interactivo (`vitest run`). Las pruebas unitarias cubren reglas de pago, el adaptador en memoria y el flujo de pago; no hay pruebas de renderizado de componentes. No se requieren servicios externos.

## Estructura y flujo

- `src/app/atoms`: pipe de moneda y distintivo de estado.
- `src/app/molecules`: selección de tarjeta y opciones de monto.
- `src/app/organisms`: formulario, revisión y comprobante.
- `src/app/domain`: modelos, validaciones, puerto de integración (`PaymentGateway`), adaptador en memoria y estado/casos de uso (`PaymentFlow`).
- `src/app/app.config.ts`: punto de composición que enlaza el puerto con `InMemoryPaymentGateway`.

El flujo permite escoger tarjeta, cuenta y monto (mínimo, total o personalizado), revisar y confirmar. Las reglas rechazan tarjetas bloqueadas, montos no positivos o superiores a la deuda y pagos que excedan el saldo disponible.

## Integración

No hay API ni integración bancaria configurada. `PaymentGateway` define las operaciones para listar tarjetas y cuentas y procesar un pago. Para integrar un backend, implementar ese puerto con un adaptador HTTP, registrar el adaptador en `src/app/app.config.ts` y acordar antes el contrato de API, autenticación, autorización, idempotencia, manejo de errores y formato monetario. No enviar credenciales al frontend ni tratar las validaciones del navegador como control de seguridad: el backend debe volver a validar y autorizar cada operación. El adaptador actual sirve solo para demostración.

## Persistencia y alcance de los datos

No existe persistencia duradera ni almacenamiento en navegador. `InMemoryPaymentGateway` inicia con tarjetas y cuentas ficticias; pagos actualizan balances solo en memoria durante la vida de la instancia y se pierden al recargar o reiniciar la aplicación. No usar datos reales ni considerar el comprobante generado como evidencia de una transacción bancaria.
