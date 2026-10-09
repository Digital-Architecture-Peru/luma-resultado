# Consulta de pagos — Banca por Internet

Aplicación frontend de consulta de pagos construida con Angular 20 y TypeScript estricto. Presenta pagos ficticios, permite buscar por referencia, beneficiario o concepto, filtrar por estado, ordenar por fecha (más reciente primero) y consultar el total de pagos completados visibles agrupado por moneda. No ejecuta pagos ni modifica datos.

## Requisitos

- Node.js compatible con Angular 20: `^20.19.0`, `^22.12.0` o `^24.0.0`.
- npm (incluido con Node.js).

## Instalar, compilar y ejecutar

Desde la raíz del proyecto:

```sh
npm install
npm start
```

El servidor de desarrollo de Angular muestra la URL local en la terminal (normalmente `http://localhost:4200/`) y recarga al cambiar archivos.

Para generar el bundle de producción:

```sh
npm run build
```

La configuración predeterminada del build es producción; los archivos generados quedan en `dist/`. El compilador aplica comprobaciones de tipos y plantillas Angular estrictas configuradas en `tsconfig.json`.

## Pruebas

```sh
npm test
```

El script ejecuta Angular CLI con Vitest en una sola pasada, sin modo watch. Las pruebas cubren consultas de dominio (búsqueda sin distinción de tildes, filtro, orden, totales y formato), el badge de estado y la página (carga, búsqueda, vacío y error).

## Organización

- `src/app/domain/`: tipos, consultas puras y puerto abstracto `PaymentRepository`.
- `src/app/infrastructure/`: `MockPaymentRepository`, adaptador actual con datos ficticios en memoria.
- `src/app/atoms/`, `molecules/`, `organisms/`, `pages/`: presentación en componentes Angular organizados con Atomic Design.
- `src/app/app.config.ts`: composición de dependencias; actualmente enlaza `PaymentRepository` con `MockPaymentRepository`.

La página carga a través del repositorio y representa estados de carga, error y éxito. El filtrado, orden y total se calculan en el cliente; el total mostrado corresponde a los resultados visibles, y se calcula solo con pagos completados.

## Integración con un servicio

No hay backend ni API configurada en este proyecto. Para conectar un servicio real:

1. Definir el contrato HTTP con el equipo de backend: ruta, método, autenticación, formato de respuesta, paginación, errores y convenciones de fechas y monedas.
2. Crear un adaptador que extienda `PaymentRepository`, implemente `list(): Promise<Payment[]>` y traduzca/valide la respuesta de la API al modelo de dominio. No acoplar los componentes a detalles HTTP.
3. Configurar `HttpClient` en `src/app/app.config.ts` mediante `provideHttpClient()` y registrar el adaptador con `{ provide: PaymentRepository, useClass: ... }` en sustitución del mock.
4. Proveer la URL del servicio mediante configuración de entorno apropiada para el despliegue. Las variables incluidas en un frontend son públicas: nunca poner credenciales, secretos o claves privadas en el bundle.
5. Añadir pruebas del adaptador para respuestas correctas, errores HTTP y datos inválidos; conservar pruebas de dominio y página con repositorios falsos.

La interfaz de repositorio devuelve una promesa. Un adaptador HTTP puede convertir la respuesta de `HttpClient` a esa forma, por ejemplo con `firstValueFrom`; debe permitir que los errores se propaguen para que la página presente su estado de error. Acordar si búsqueda y paginación serán locales o del servidor antes de integrar grandes volúmenes de datos.

## Persistencia y datos

La aplicación actual no tiene persistencia: `MockPaymentRepository` entrega una copia de `SAMPLE_PAYMENTS` al consultarse. Los registros son demostrativos, viven solo en el código cliente y no deben confundirse con transacciones reales. No se escribe en `localStorage`, IndexedDB ni en una base de datos.

En un despliegue real, el backend debe ser la fuente de verdad y gestionar la persistencia y autorización. La API debe limitar cada consulta a los pagos autorizados para el usuario autenticado; el cliente no es una frontera de seguridad. Evitar almacenar datos financieros sensibles en almacenamiento persistente del navegador salvo que exista una necesidad y evaluación de seguridad explícitas.
