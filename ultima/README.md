# Notificaciones de tarjetas — banca por Internet

Aplicación frontend Angular 18 standalone para consultar notificaciones ficticias de tarjetas. Utiliza signals para el estado y una separación por dominio, aplicación, adaptador y UI (Atomic Design).

## Requisitos

- Node.js compatible con Angular 18 (Node.js 18.19.1+, 20.11.1+ o 22+).
- npm.

## Instalar, compilar y ejecutar

Desde la raíz del proyecto:

```sh
npm install
npm start
```

El servidor de desarrollo Angular estará disponible normalmente en `http://localhost:4200`; se recarga al modificar fuentes. Para generar el build de producción:

```sh
npm run build
```

Los artefactos se generan en `dist/tarjetas-notificaciones/`. `ng build` aplica la configuración de producción por defecto e incluye la comprobación TypeScript de Angular.

## Pruebas

```sh
npm test
```

El comando ejecuta Jest en modo CI, sin modo interactivo. Las pruebas cubren el store de notificaciones (carga correcta y fallida, orden, filtro y marcado como leído) y componentes de UI. Para ejecutar un subconjunto puede pasarse un patrón Jest, por ejemplo `npx jest src/app/application/notification-store.service.spec.ts --runInBand`.

## Estructura principal

- `src/app/domain/`: modelo de notificación y puerto abstracto `NotificationGateway`.
- `src/app/application/notification-store.service.ts`: carga, filtro, conteo y acciones de lectura con signals.
- `src/app/adapters/mock-notification.gateway.ts`: adaptador ficticio en memoria, con datos de demostración; no realiza peticiones de red.
- `src/app/ui/`: componentes standalone organizados en atoms, molecules, organisms y pages.
- `src/app/app.config.ts`: composición de dependencias; actualmente registra `MockNotificationGateway` para el puerto `NotificationGateway`.

## Integración y persistencia

La integración con servicios externos aún no está implementada. Para conectar una API, implementar `NotificationGateway` (por ahora su contrato expone `list(): Promise<CardNotification[]>`) y sustituir el proveedor de `NotificationGateway` en `src/app/app.config.ts`. El adaptador real debería traducir y validar la respuesta externa al modelo de dominio, manejar errores de transporte y configurar la URL mediante configuración de entorno de despliegue, nunca incluir credenciales en el frontend. Si se incorpora autenticación, debe delegarse en el mecanismo aprobado por la aplicación anfitriona; no almacenar secretos en el bundle.

No hay base de datos ni persistencia local: los registros de muestra y los cambios de lectura viven solo en memoria. Recargar la aplicación restablece los datos y estados al conjunto ficticio inicial. Para persistencia real, el backend debe ser la fuente de verdad para las notificaciones y registrar acciones de lectura; el frontend debería actualizar el estado tras una respuesta confirmada, con política explícita de errores y reintentos. No se configura ni se presupone un servicio backend en este proyecto.

## Alcance

Esta aplicación es una demostración de interfaz, no un canal bancario conectado. Los datos son ficticios; no usar con información financiera real.
