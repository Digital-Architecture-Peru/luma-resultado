# cards-query-mfe — Consulta de tarjetas

Micro-frontend remoto Angular 19 de consulta de tarjetas. La interfaz muestra lista y detalle; los datos de demostración son ficticios. Estado de entrega: **candidate**. No se ha compilado ni ejecutado en este entorno.

## Requisitos

- Node.js 18.19 o superior (o Node.js 20+).
- npm compatible con la versión de Node.
- Chrome/Chromium disponible para ejecutar Karma en `ChromeHeadless`.

Las versiones de Angular y Native Federation están declaradas en `package.json` con rangos `~`; el equipo de integración debe confirmar la versión de Node/npm y las dependencias en CI. No hay lockfile en el repositorio listado.

## Instalar, ejecutar y comprobar

Desde la raíz del proyecto:

```sh
npm install
npm start
```

`npm start` ejecuta `ng serve`. En modo standalone, abre la dirección local indicada por Angular CLI (habitualmente `http://localhost:4200`) y entra en `/tarjetas` para la lista; `/tarjetas/:id` presenta el detalle. El modo predeterminado usa el gateway mock. Para crear el build de producción:

```sh
npm run build
```

Pruebas unitarias y de componente:

```sh
npm test
```

El script usa Jasmine/Karma en modo no interactivo con `ChromeHeadless`. Si el entorno de CI no ofrece un Chrome compatible, configura allí un launcher/Chrome adecuado sin cambiar el contrato funcional. Las pruebas disponibles cubren el gateway mock, el enmascaramiento del PAN, el store y la lista de tarjetas. Estos comandos están documentados, pero **no se han ejecutado aquí**.

## Integración con el shell

Este proyecto es un remote de Native Federation. `federation.config.js` define el nombre `cards-query-mfe`, expone `./routes` desde `src/app/cards/cards.routes.ts` y comparte dependencias (incluido Angular) como singleton con `strictVersion`.

En el shell, registra el remote apuntando al `remoteEntry.json` servido/desplegado por este proyecto, por ejemplo:

```json
{
  "cards-query-mfe": "http://<host-del-remote>/remoteEntry.json"
}
```

Monta sus rutas bajo `/tarjetas` mediante el mecanismo `loadRemoteModule` de Native Federation. Ejemplo orientativo para el shell (no incluido en este repositorio):

```ts
{
  path: 'tarjetas',
  loadChildren: () =>
    loadRemoteModule('cards-query-mfe', './routes')
      .then((module) => module.CARDS_ROUTES),
}
```

Alinea las versiones efectivas de Angular entre shell y remote: `strictVersion` puede impedir la carga si hay incompatibilidad. El host, el manifiesto final, la política de despliegue, el origen/CORS y la autenticación son decisiones de integración pendientes; no se incorporan URLs reales ni credenciales. En modo standalone, `src/app/app.routes.ts` es el punto de entrada local; las rutas federadas están en `CARDS_ROUTES`.

## Integración de datos

`CardsGateway` (`src/app/cards/data/cards.gateway.ts`) es el puerto que consume el estado. La selección de adaptador se realiza en las rutas:

- `environment.useMock: true`: `MockCardsGateway`, opción predeterminada, que devuelve copias de `MOCK_CARDS` ficticias.
- `environment.useMock: false`: `HttpCardsGateway`, adaptador HTTP disponible, pero sujeto a configuración e integración con backend.

El adaptador HTTP espera, como contrato provisional, `GET {apiBaseUrl}/cards` con un arreglo de tarjetas y `GET {apiBaseUrl}/cards/{id}` con una tarjeta o `null`. La URL base se define en `src/environments/environment.ts`; actualmente está vacía, por lo que hay que configurar una base antes de activar el adaptador. El shape de `Card` es una propuesta y debe acordarse con el backend, junto con códigos de error, paginación, validación de respuestas y semántica para recursos inexistentes. No hay un servicio API real integrado ni se realizan llamadas de red en el modo mock.

La autenticación corresponde al shell/plataforma. El adaptador no añade tokens ni credenciales; si el contrato lo requiere, intégralo mediante mecanismos aprobados (por ejemplo, interceptor proporcionado por el host) y nunca guardes secretos en el código.

## Estado y datos sensibles

No hay persistencia: `CardsStore` conserva datos solo en memoria durante la sesión de la aplicación. No usa localStorage, sessionStorage ni una base de datos. Al recargar o abandonar la aplicación, el estado se pierde. Los datos mock son exclusivamente de demostración. La interfaz debe mostrar el PAN enmascarado mediante `maskPan`; no usar PAN reales en fixtures, logs ni capturas. La autorización y el manejo de datos reales requieren revisión con el backend y la plataforma antes de habilitar la integración.

## Límites conocidos

- API, modelo definitivo, autenticación/autorización y persistencia: sin definir.
- El remote, el shell y su comunicación no han sido probados juntos.
- Build, ejecución local y pruebas: no verificados en este entorno.
