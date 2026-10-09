# Notificaciones de pagos · Banca por Internet

Frontend Angular 18 (standalone, signals) para consultar notificaciones de pagos. La implementación actual usa datos ficticios en memoria; no se conecta a servicios bancarios ni guarda cambios entre recargas.

## Requisitos

- Node.js compatible con Angular 18 (Node.js 18.19+ o 20.11+ recomendado).
- npm.

## Instalar, compilar y ejecutar

Desde la raíz del proyecto:

```sh
npm install
npm run build
npm start
```

`npm run build` ejecuta el build de Angular en modo producción, incluyendo la compilación y comprobación de tipos configuradas por Angular CLI. `npm start` ejecuta `ng serve`; abre la URL que informa el CLI (normalmente `http://localhost:4200/`). Para detener el servidor, usa Ctrl+C.

## Pruebas

```sh
npm test
```

El comando ejecuta Jest en modo CI, sin modo interactivo. Las pruebas cubren el estado de aplicación (carga, error, filtros y marcado de lectura) y los componentes de notificación. También se puede compilar después de las pruebas con `npm run build`.

## Diseño e integración

El flujo separa dominio, aplicación, adaptador y presentación:

- `src/app/domain/`: modelo `PaymentNotification` y puerto abstracto `NotificationGateway`.
- `src/app/application/notification-store.service.ts`: carga datos y mantiene el estado reactivo con signals; ofrece filtro de no leídas y acciones de lectura.
- `src/app/adapters/mock-notification.gateway.ts`: adaptador mock con ejemplos ficticios, sin llamadas de red.
- `src/app/ui/`: componentes standalone organizados como átomos, moléculas y organismo.
- `src/app/app.config.ts`: composición de dependencias; actualmente enlaza `NotificationGateway` con `MockNotificationGateway`.

La integración con un backend está pendiente de contrato. Para incorporarla, definir el endpoint y el formato de respuesta con el servicio propietario, implementar un adaptador que extienda `NotificationGateway` y devuelva `Observable<PaymentNotification[]>`, habilitar `HttpClient` en la configuración de Angular y registrar el adaptador en `app.config.ts`. Validar y mapear la respuesta externa al modelo del dominio en el adaptador; manejar errores de red y respuestas inválidas sin exponer datos sensibles. La URL base debe provenir de configuración por entorno y no incluir secretos en el frontend (todo valor incluido en un bundle del navegador es público). Autenticación y autorización deben resolverse mediante mecanismos aprobados por el backend, no mediante credenciales codificadas en la aplicación.

## Persistencia y límites

No hay persistencia: el mock entrega una copia de datos constantes; el store vive en memoria y sus cambios se pierden al recargar la página. No se usa localStorage, base de datos ni API. Para una integración real, el backend debe ser la fuente de verdad y persistir las notificaciones y sus estados de lectura con controles de acceso por usuario; definir también las operaciones de marcado como leído en el contrato antes de implementarlas. No guardar información financiera sensible en almacenamiento local del navegador.
