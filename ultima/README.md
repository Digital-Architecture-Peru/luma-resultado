# Banca por Internet · Consulta de tarjetas

Aplicación frontend Angular de consulta en modo solo lectura: lista tarjetas, permite abrir su detalle y muestra movimientos. La interfaz emplea componentes standalone y una estructura de UI inspirada en Atomic Design. Los datos actuales son ficticios; no se conecta a servicios externos ni persiste cambios.

## Requisitos

- Node.js 20.19 o posterior, conforme al README existente (la versión exacta requerida debe confirmarse con el entorno de despliegue).
- npm.

## Compilar, ejecutar y probar

Desde la raíz del proyecto:

```sh
npm install
npm run build
npm start
npm test
```

`npm start` ejecuta Angular CLI (`ng serve`); abre la URL local que indique la CLI. `npm run build` ejecuta `ng build`. `npm test` está configurado como `ng test --watch=false`, para ejecutar Vitest en modo no interactivo según la configuración del proyecto. Las pruebas existentes cubren la fachada, páginas, componentes UI y el pipe de enmascaramiento.

No se han ejecutado estos comandos durante la elaboración de esta documentación. En la versión actual, el script `build` no declara explícitamente un paso separado de comprobación de tipos; Angular CLI realiza la compilación configurada por el proyecto.

## Navegación y comportamiento

- `/` redirige a `/tarjetas`.
- `/tarjetas` muestra tarjetas; `/tarjetas/:id` presenta el detalle y sus movimientos.
- La interfaz distingue estados de carga, vacío, error y datos. El detalle usa el estado vacío para una tarjeta inexistente.
- Los importes usan USD y locale `es` por configuración de entorno.

## Integración

La frontera de lectura es `CardsRepository`, con operaciones `list()`, `getById(id)` y `movements(cardId)`. `MockCardsAdapter` implementa ese contrato con datos locales, y `CardsFacade` entrega el estado a la interfaz mediante signals.

`src/environments/environment.ts` tiene `useMock: true`. La fábrica de proveedores en `src/app/app.config.ts` lanza un error cuando `useMock` es `false`: no existe todavía un adaptador HTTP ni un contrato de API definido. Antes de integrar un backend se deben acordar autenticación/sesión con la aplicación host, rutas y esquemas de respuesta, errores, autorización, paginación/orden de movimientos y tratamiento de datos sensibles. Después se implementará un adaptador de `CardsRepository` y se configurará en el punto de composición; no se deben introducir credenciales en el código fuente.

## Persistencia y datos

No hay persistencia en navegador o servidor. `src/app/core/cards/adapters/mock-data.ts` contiene datos ficticios en memoria; el adaptador emite copias/filtrados de esos datos. Recargar la aplicación vuelve a la misma muestra. La aplicación no ofrece operaciones de modificación.

## Seguridad y límites

El modelo declara que el número de tarjeta se recibe enmascarado y no incluye PAN completo ni CVV; el pipe `maskPan` complementa la presentación enmascarada. No enviar datos reales a la implementación mock. La autenticación y autorización de una integración real quedan a cargo del contrato y del host de banca, aún por definir. No se afirma cumplimiento de requisitos corporativos o de seguridad sin una revisión específica.

## Fuentes principales

- `src/app/core/cards/`: modelos, puerto, adaptador ficticio y fachada.
- `src/app/features/cards/pages/`: páginas y navegación.
- `src/app/shared/ui/`: componentes de interfaz organizados en átomos, moléculas, organismos y plantilla.
- `src/app/shared/pipes/`: formato de presentación.
- `src/environments/environment.ts`: configuración no sensible de entorno.
