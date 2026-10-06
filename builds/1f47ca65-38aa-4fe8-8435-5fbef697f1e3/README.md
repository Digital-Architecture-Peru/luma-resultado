# Gestión de clientes

Aplicación de ejemplo Angular 19 para listar, buscar, crear, editar y eliminar clientes. Utiliza componentes standalone, rutas lazy, formularios reactivos y un store basado en signals. Los registros incluidos son ficticios.

> **Estado: candidate.** No se han ejecutado instalación, build ni pruebas en este entorno; los comandos de abajo son instrucciones, no resultados verificados.

## Requisitos

- Node.js 20.19+ o 22 y npm compatible con la versión elegida.
- Chrome o Chromium para las pruebas Karma en modo headless.

## Instalar, ejecutar y compilar

Desde la raíz del proyecto:

```bash
npm install
npm start
```

Abre <http://localhost:4200>. `npm start` ejecuta `ng serve` en modo desarrollo.

```bash
npm run build
```

El build de producción se escribe en `dist/clientes-app` (según `angular.json`). Para compilar en desarrollo:

```bash
npx ng build --configuration development
```

## Probar

```bash
npm test
```

El script usa `ng test --watch=false --browsers=ChromeHeadless`, con Jasmine y Karma. Requiere un Chrome/Chromium compatible disponible para el launcher. Las pruebas existentes cubren repositorio en memoria, store y páginas de formulario/listado. No se ha comprobado aquí que compilen ni que pasen.

## Funcionalidad y rutas

- `/clientes`: listado y búsqueda por nombre, correo, teléfono o ciudad; búsqueda sin distinguir mayúsculas ni acentos.
- `/clientes/nuevo`: alta.
- `/clientes/:id/editar`: edición.
- Eliminación desde el listado con confirmación en línea.
- Validación de nombre y ciudad requeridos, correo válido, teléfono de 7–20 caracteres y correo único (sin distinguir mayúsculas).

## Organización e integración

La UI consume `CustomersRepository`, definido en `src/app/features/customers/data/customers.repository.ts`; `CustomersStore` coordina las operaciones y estado. La implementación se elige en `src/app/app.config.ts` mediante `CUSTOMERS_REPOSITORY` y la configuración de `src/environments/environment.ts`.

Por defecto se usa `InMemoryCustomersRepository`, sembrado con datos ficticios. Para seleccionar el adaptador HTTP, cambiar en `environment.ts`:

```ts
repository: 'http',
apiBaseUrl: 'https://api.example.invalid/v1',
```

Sustituye la URL de ejemplo por el origen/base path de tu servicio antes de integrar. `HttpCustomersRepository` implementa este contrato REST asumido:

| Operación | Petición | Respuesta esperada |
|---|---|---|
| Listar | `GET {apiBaseUrl}/customers` | `Customer[]` |
| Obtener | `GET {apiBaseUrl}/customers/{id}` | `Customer`; `404` se traduce a `undefined` |
| Crear | `POST {apiBaseUrl}/customers` con `CustomerDraft` | `Customer` creado |
| Actualizar | `PUT {apiBaseUrl}/customers/{id}` con `CustomerDraft` | `Customer` actualizado |
| Eliminar | `DELETE {apiBaseUrl}/customers/{id}` | respuesta vacía compatible con `void` |

El formato del modelo `Customer` es `{ id, name, email, phone, city, createdAt }`; `createdAt` es una fecha ISO 8601. `CustomerDraft` contiene `name`, `email`, `phone` y `city`. El adaptador codifica el ID en la ruta. El backend debe implementar validación y unicidad del correo; el control de unicidad del repositorio en memoria no sustituye esa garantía. Definir autenticación, autorización, CORS, paginación, errores y políticas de reintento con el backend real: no están implementados por este adaptador. No se envían credenciales ni se deben incluir secretos en la configuración del frontend.

## Persistencia

El modo predeterminado almacena cambios únicamente en memoria de la pestaña y los pierde al recargar; no escribe en localStorage ni en una base de datos. En modo HTTP, la persistencia y sus garantías dependen del servicio conectado. Si se requiere otro almacenamiento, implementar `CustomersRepository` y registrar la implementación en `app.config.ts`, manteniendo la UI desacoplada del mecanismo de datos.

Toda configuración de `src/environments/` termina en el bundle público del navegador. No guardar claves, tokens privados ni cadenas de conexión allí; los secretos deben permanecer en el backend.
