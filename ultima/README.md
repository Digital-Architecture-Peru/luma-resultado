# Consulta de Tarjetas · Banca por Internet

Aplicación de consulta de tarjetas construida con Vue 3, TypeScript y Vite. La interfaz muestra un listado y permite consultar el detalle de una tarjeta. El adaptador disponible es un mock con datos ficticios; no se realizan llamadas a servicios reales.

## Requisitos

- Node.js y npm compatibles con Vite 5.
- Instalación de dependencias mediante npm en el entorno de desarrollo.

## Instalar, ejecutar y validar

```sh
npm install
npm run dev
```

Vite mostrará la URL local de desarrollo en la terminal. Para validar tipos, generar el build de producción o servirlo localmente:

```sh
npm run typecheck
npm run build
npm run preview
```

Pruebas unitarias con Vitest:

```sh
npm test
```

`npm test` ejecuta Vitest en modo no interactivo (`vitest run`). Las pruebas existentes cubren formato de importes, fechas y PAN, composables de carga/selección/error, componentes y el adaptador mock. No se requiere un servicio externo para ellas.

## Configuración

Vite carga variables de entorno con prefijo `VITE_`. El archivo disponible `env.example.txt` contiene valores de ejemplo; para usarlos localmente, copiarlo a `.env` en la raíz del proyecto. `.env` es configuración local y no debe contener secretos: las variables `VITE_*` quedan expuestas al código del navegador.

- `VITE_CARDS_ADAPTER`: nombre del adaptador. Actualmente solo se admite `mock` (también es el valor por defecto).
- `VITE_LOCALE`: locale de formato; el valor de ejemplo es `es-PE`.
- `VITE_CURRENCY`: moneda de formato; el valor de ejemplo es `PEN`.

Los comandos de ejecución y prueba no dependen de esas variables. El selector de adaptador se encuentra en `src/services/index.ts`.

## Diseño e integración

La aplicación separa responsabilidades por capas:

- `src/domain/card.ts`: tipos de resumen y detalle de tarjeta.
- `src/services/CardQueryPort.ts`: contrato de lectura `listCards()` y `getCard(id)`.
- `src/services/mockCardAdapter.ts`: implementación ficticia del contrato.
- `src/services/index.ts`: selección del adaptador.
- `src/composables/useCards.ts`: estado de carga, selección y errores.
- `src/components/`: presentación organizada en átomos, moléculas, organismos y plantilla.
- `src/pages/CardsQueryPage.vue`: composición de la pantalla e inicio de la carga.
- `tests/unit/`: pruebas unitarias.

### Integrar un backend

La integración real no está implementada ni configurada. Para incorporarla, crear un adaptador que implemente `CardQueryPort`, convertir y validar la respuesta externa antes de exponerla como `CardSummary`/`CardDetail`, y registrarlo en `src/services/index.ts`. Mantener el contrato de consulta de solo lectura. La selección actual rechaza cualquier nombre distinto de `mock` hasta que se registre explícitamente otro adaptador.

Una integración real debe definir fuera de este mock la autenticación y autorización con el sistema de Banca por Internet, el manejo de expiración de sesión, los errores HTTP y la política de reintentos. No incluir credenciales ni secretos en variables `VITE_*`; la configuración incorporada al frontend es pública. Preferir que el shell/backend autorizado gestione credenciales y acceso, y limitar las respuestas a los campos necesarios. No registrar PAN ni datos sensibles.

## Persistencia y datos

No hay persistencia en navegador o servidor: no se usa `localStorage`, IndexedDB ni base de datos. El mock mantiene datos ficticios estáticos en memoria durante la ejecución, con un retardo simulado. No representa almacenamiento durable ni modifica tarjetas. Para añadir persistencia en el futuro habría que diseñar e implementar esa capa detrás de un servicio/repositorio del backend; este proyecto no define esquema ni migraciones.

El modelo expone únicamente `last4` para la tarjeta; no contiene PAN completo ni CVV. Los importes y fechas del mock son demostrativos y no corresponden a cuentas reales.

## Estado de verificación

No se ejecutaron instalación, pruebas ni build en la preparación de esta documentación. Los comandos indicados describen los scripts declarados en `package.json`; el resultado debe verificarse en el entorno de ejecución.
