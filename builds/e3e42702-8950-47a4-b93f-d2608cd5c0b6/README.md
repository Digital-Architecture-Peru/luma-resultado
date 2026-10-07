# Notificaciones de tarjetas

Aplicación web móvil de notificaciones in-app, construida con Svelte 4 y Vite. La interfaz usa componentes organizados por Atomic Design y actualmente trabaja con datos ficticios; no realiza llamadas de red.

## Requisitos

- Node.js 18 o superior
- npm

## Instalar, ejecutar y probar

Desde la raíz del proyecto:

```sh
npm install
npm run dev
```

Vite mostrará la dirección local (normalmente `http://localhost:5173`). Para generar y revisar localmente el build de producción:

```sh
npm run build
npm run preview
```

Para ejecutar las pruebas unitarias y de componentes:

```sh
npm test
```

Vitest ejecuta el conjunto una vez. Las pruebas usan datos deterministas y no necesitan servicios externos.

## Configuración

`VITE_MAX_ITEMS` es una variable opcional que limita cuántas notificaciones se muestran después de ordenar por fecha descendente. Si se omite, no se aplica límite. Vite carga variables `VITE_*` desde el entorno o desde archivos locales `.env` (no versionar archivos con valores privados). No hay credenciales necesarias para la demo. No se encontró un `.env.example` en el proyecto.

## Estructura principal

- `src/lib/domain/notification.js`: validación, orden, conteo de no leídas, marcado como leído, enmascaramiento de tarjeta y formato de monto.
- `src/lib/ports/notificationSource.js`: contrato del origen, que expone `list()` asíncrono.
- `src/lib/adapters/mockSource.js`: adaptador con notificaciones ficticias.
- `src/lib/stores/notifications.js`: store Svelte; valida y ordena los datos del origen, mantiene estado de carga y expone acciones de lectura.
- `src/lib/components/`: átomos, moléculas, organismos y plantilla.
- `src/pages/NotificationsPage.svelte`: pantalla y carga del store al montar.
- `tests/`: pruebas de dominio, store y componentes (Vitest y Testing Library).

## Integración

La aplicación no está conectada a un backend: el store usa `mockSource`. Para integrar un servicio real, implementar el puerto `NotificationSource` con una función `list()` que devuelva una promesa de registros con `id`, `type`, `cardLast4`, `title`, `body`, `createdAt` y `read` (y opcionalmente `amount`). Los tipos válidos son `compra`, `pago_proximo`, `bloqueo` y `limite`; las fechas deben poder interpretarse como fecha ISO. El store descarta registros inválidos y presenta el estado de error si falla la carga.

El adaptador de API debería validar la respuesta externa antes de entregarla al dominio, aplicar autenticación en una capa de integración segura y no registrar datos financieros o tokens. No se deben enviar ni guardar números completos de tarjeta: la interfaz solo usa los últimos cuatro dígitos y los enmascara para mostrar.

## Persistencia y alcance

No hay persistencia. Las notificaciones y los cambios de leído/no leído se conservan solo en el store en memoria y se pierden al recargar la página; tampoco se sincronizan con un servidor. Si se requiere persistencia, definirla detrás de un adaptador/repositorio y acordar con el backend la semántica de lectura y sincronización antes de introducirla. No guardar datos sensibles de tarjetas en almacenamiento del navegador.

## Verificación

El código y las pruebas se documentan aquí, pero no se ejecutaron build ni pruebas en este entorno. Validar en el entorno de desarrollo con `npm test` y `npm run build`.
