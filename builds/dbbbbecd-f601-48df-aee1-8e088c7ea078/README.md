# Notificaciones de cuentas · Banca por Internet

Aplicación frontend de notificaciones bancarias ficticias, construida con Angular 18 standalone y componentes organizados con Atomic Design. Incluye avisos de saldo bajo, depósitos, retiros y seguridad; filtros de lectura, marcado como leído y descarte.

> **Demo únicamente:** no se conecta a servicios financieros y no contiene datos de clientes reales.

## Requisitos

- Node.js compatible con Angular 18: `^18.19.0`, `^20.11.0` o `^22.0.0`.
- npm (incluido con Node.js).

## Instalar, compilar y ejecutar

Desde la raíz del proyecto:

```sh
npm install
npm run build
npm start
```

`npm run build` ejecuta el build de Angular en configuración de producción, incluido el chequeo de tipos de TypeScript. `npm start` inicia el servidor de desarrollo; abre [http://localhost:4200](http://localhost:4200). Para detenerlo, usa `Ctrl+C`.

Para compilar explícitamente en modo desarrollo:

```sh
npx ng build --configuration development
```

## Pruebas

```sh
npm test
```

Las pruebas se ejecutan una sola vez con Vitest (no en modo watch), usando jsdom. Cubren el store de notificaciones, el componente de notificación y la página mediante pruebas unitarias y de componentes. No requieren backend ni credenciales.

## Organización

- `src/app/domain/`: modelo, tipos y puerto abstracto `NotificationRepository`.
- `src/app/application/`: `NotificationStore`, que mantiene estado reactivo en Angular signals y aplica filtros y acciones.
- `src/app/adapters/`: `InMemoryNotificationRepository`, con datos de ejemplo ficticios.
- `src/app/atoms/`, `molecules/`, `organisms/`, `pages/`: interfaz agrupada por nivel de Atomic Design.
- `src/app/app.config.ts`: composición de dependencias; enlaza el puerto al repositorio en memoria.

## Integración y persistencia

Actualmente no hay integración externa ni persistencia: el adaptador devuelve un conjunto fijo de datos ficticios, y los cambios (marcar como leído o descartar) viven únicamente en memoria. Al recargar la página se restablece el estado inicial.

Para integrar una API, implementa `NotificationRepository` con un adaptador basado, por ejemplo, en `HttpClient`, y sustituye el provider correspondiente en `src/app/app.config.ts`. Configura la URL del servicio mediante la configuración de despliegue apropiada; no incluyas secretos ni credenciales en el frontend. La interfaz actual del puerto solo define la lectura (`list()`); si la API debe guardar cambios de lectura o descarte, amplía el contrato y el store para representar esas operaciones, y maneja explícitamente errores y estados de carga.

Para que los cambios persistan entre sesiones, la fuente de verdad debe ser un servicio/backend con almacenamiento persistente. El almacenamiento local del navegador podría servir para una demo, pero no debe considerarse persistencia segura ni autoritativa para una aplicación bancaria.
