# Consulta de Cuentas

SPA mobile-first construida con Angular 18 y componentes standalone. Permite consultar cuentas ficticias, buscar por alias, filtrar por tipo y abrir el detalle. La app es de solo lectura y enmascara los números de cuenta.

## Requisitos

- Node.js 18.19 o posterior (también Node 20+).
- npm compatible con la versión de Node.
- Chrome instalado para ejecutar las pruebas Karma en modo headless.

## Instalar, ejecutar y compilar

```sh
npm install
npm start
```

Abre `http://localhost:4200`. El servidor de desarrollo escucha en `0.0.0.0` según el script `start`.

```sh
npm run build
```

Angular CLI escribe el resultado en `dist/consulta-cuentas-movil`. La configuración predeterminada de build es producción; también existe configuración development con mapas de fuentes.

## Pruebas

```sh
npm test
```

El script usa `ng test --watch=false --browsers=ChromeHeadless`; requiere Chrome. Las pruebas están configuradas con Karma y Jasmine, sin servicios externos. Cubren el adaptador en memoria (listado, filtro, búsqueda por id y enmascaramiento), el pipe de enmascarado, páginas de listado/detalle y átomos, moléculas y organismo UI. El reporte de cobertura, si se genera, queda en `coverage/consulta-cuentas-movil`.

## Estructura y flujo

- `src/app/core/accounts`: modelo `Account`, puerto `AccountsQueryPort`, token `ACCOUNTS_QUERY`, adaptador ficticio en memoria y pipe de enmascarado.
- `src/app/features/accounts`: rutas lazy `/cuentas` y `/cuentas/:id`, con páginas de listado y detalle.
- `src/app/shared/ui`: componentes reutilizables organizados en atoms, molecules y organisms.
- `src/app/app.config.ts`: punto de composición donde `ACCOUNTS_QUERY` se vincula actualmente a `InMemoryAccountsAdapter`.
- `src/environments/environment.ts`: locale y moneda usados como configuración no secreta (`es`, `USD`).

El listado carga cuentas mediante el puerto, aplica el filtro de tipo en el adaptador y filtra el alias en la vista. El detalle obtiene la cuenta por id. La UI contempla carga, error/reintento en el listado y cuenta no encontrada en el detalle.

## Integración y persistencia

Actualmente no hay API, autenticación, backend ni persistencia: `InMemoryAccountsAdapter` devuelve cinco registros ficticios estáticos, en memoria, y no conserva cambios entre sesiones. No se requiere base de datos para el alcance actual. Los datos crudos con números ficticios solo existen en el adaptador; el modelo expuesto por el puerto lleva `maskedNumber`.

Para integrar un backend, implemente `AccountsQueryPort` usando `HttpClient` y registre el adaptador en `app.config.ts` bajo `ACCOUNTS_QUERY`. Mantenga el contrato de solo lectura (`list(filter?)`, `getById(id)`) y el enmascaramiento antes de exponer los datos a la UI. Configure cualquier URL mediante configuración de entorno apropiada para despliegue; no guarde credenciales ni secretos en el frontend. La persistencia real y las políticas de autorización deben residir en el backend.

## Supuestos y límites

“App móvil” se interpreta como SPA responsive; no incluye Ionic, Capacitor ni distribución nativa. Se asume que la autenticación y autorización, si fueran necesarias, pertenecen a una capa externa que esta aplicación aún no integra. Los datos son demostrativos y no representan cuentas reales.

No se ejecutaron `npm install`, `npm run build` ni `npm test` durante esta documentación; por tanto, su resultado queda sin verificar en este entorno.
