# Notificaciones de tarjetas · Banca por Internet

Frontend de notificaciones construido con Svelte 4, TypeScript y Vite. La interfaz organiza sus componentes con Atomic Design (`atoms`, `molecules`, `organisms`); las reglas del dominio están en `src/lib/model`, el puerto de integración y su implementación ficticia en `src/lib/services`, y el estado reactivo en `src/lib/stores`.

> **Estado:** integración con backend y persistencia todavía no están implementadas. La aplicación usa datos de ejemplo en memoria; los cambios se pierden al recargar. No usar datos ficticios como información real de clientes.

## Requisitos

- Node.js compatible con Vite 5 (Node.js 18 o superior recomendado).
- npm.

## Instalar, compilar y ejecutar

Desde la raíz del proyecto:

```sh
npm install
npm run dev
```

Vite imprime la URL local de desarrollo en la terminal. Para crear una compilación de producción:

```sh
npm run build
```

El script ejecuta primero `svelte-check --tsconfig ./tsconfig.json` (comprobación de Svelte y TypeScript) y después `vite build`; el resultado se genera en `dist/`. Para servir localmente esa compilación:

```sh
npm run preview
```

`preview` es un servidor local de previsualización, no un servidor de producción.

## Pruebas

```sh
npm test
```

Ejecuta Vitest una vez, sin modo interactivo. Las pruebas actuales cubren funciones del modelo (enmascarado, filtros, conteo y orden), operaciones/errores del store y componentes. La configuración de Vitest usa jsdom y `tests/setup.ts`.

## Integración

La interfaz de integración es `NotificationGateway`, definida en `src/lib/services/notificationGateway.ts`:

- `list(): Promise<CardNotification[]>`
- `markRead(id: string): Promise<void>`
- `markAllRead(): Promise<void>`

La composición actual en `src/App.svelte` instancia `InMemoryNotificationGateway`, que carga `SAMPLE_NOTIFICATIONS`. Para conectar un backend, implementar el puerto mediante un adaptador HTTP y sustituir esa instancia en el punto de composición; mantener transporte y configuración fuera de componentes y reglas del dominio.

El modelo `CardNotification` (`src/lib/model/notification.ts`) requiere `id`, `cardLast4` (exactamente cuatro dígitos), `type` (`purchase`, `limit`, `blocked` o `payment_due`), `message`, `createdAt` (fecha ISO 8601) y `read`. Antes de aceptar respuestas remotas, validar la estructura, el tipo de notificación, fechas y los cuatro dígitos; no confiar en la validación del cliente como control de seguridad. Los errores del store se reflejan en su estado y las escrituras actualizan la interfaz únicamente tras completar la llamada al gateway.

No hay URL de API configurada ni adaptador HTTP en esta versión. Aunque la implementación futura podría usar una variable de entorno de Vite, por ejemplo `VITE_NOTIFICATIONS_API_URL`, el código actual no la lee: crear un archivo `.env` por sí solo no habilita la integración. Las variables `VITE_*` se exponen al código del navegador; nunca colocar secretos, credenciales ni tokens privados allí. Autenticación, autorización, CORS, límites y validación también deben resolverse en el servicio y en el backend.

## Persistencia y operación

`InMemoryNotificationGateway` conserva una copia mutable de los datos solo durante la vida de la página. No hay almacenamiento local, base de datos, sincronización entre dispositivos ni garantía de durabilidad. En una integración real, el backend debe ser la fuente de verdad y persistir las notificaciones y su estado de lectura con autorización por usuario. El adaptador deberá traducir fallos de red/HTTP a errores manejables, y la interfaz debería definir con el backend el contrato de paginación, orden, concurrencia y reintentos antes de manejar volúmenes de producción.

No almacenar números completos de tarjeta en este cliente. El modelo solo muestra y valida los últimos cuatro dígitos; la función `maskCard` presenta ese sufijo enmascarado.
