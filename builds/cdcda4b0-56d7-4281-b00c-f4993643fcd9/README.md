# Gestor de items

Aplicación frontend de ejemplo en Vue 3 + TypeScript + Vite. Permite listar items ficticios y crear nuevos. El dominio valida nombre obligatorio (máximo 60 caracteres) y descripción (máximo 200); los valores aceptados se recortan en los extremos.

## Requisitos

- Node.js compatible con Vite 5 (Node.js 18 o posterior recomendado).
- npm.

## Instalar, ejecutar y construir

Desde la raíz del proyecto:

```sh
npm install
npm run dev
```

Vite mostrará la URL local en la terminal. Para generar y servir localmente el build de producción:

```sh
npm run build
npm run preview
```

El build ejecuta primero `vue-tsc --noEmit` y luego `vite build`. No hay lockfile listado actualmente; en CI conviene versionar `package-lock.json` y usar `npm ci` para instalaciones reproducibles.

## Pruebas

```sh
npm test
```

Vitest corre `tests/**/*.spec.ts` en jsdom. Las pruebas cubren validación y normalización del dominio, el adaptador en memoria, estados y acciones del composable, y componentes de lista y formulario. No dependen de un backend ni de red real.

## Configuración de integración

La selección del gateway se realiza en `src/adapters/factory.ts` mediante variables Vite:

- `VITE_GATEWAY=mock` (valor por defecto efectivo): usa el adaptador local.
- `VITE_GATEWAY=http`: selecciona el adaptador HTTP únicamente si también se proporciona `VITE_API_BASE_URL`.
- `VITE_API_BASE_URL`: URL base del servicio, requerida para usar HTTP; por ejemplo `http://localhost:8080`.

Se pueden exportar antes de arrancar/build (o definirlas en un `.env` local no versionado):

```sh
VITE_GATEWAY=http VITE_API_BASE_URL=http://localhost:8080 npm run dev
```

Las variables con prefijo `VITE_` se incorporan al código cliente y son públicas. No guardar claves, tokens ni otros secretos en ellas. Si se configura `VITE_GATEWAY=http` sin una base URL, la factory cae silenciosamente al adaptador mock; confirmar ambas variables al configurar el entorno.

### Contrato HTTP esperado

`HttpItemGateway` asume respuestas JSON y concatena las rutas indicadas a la base URL:

| Método y ruta | Resultado esperado |
|---|---|
| `GET {base}/items` | `Item[]` |
| `GET {base}/items/{id}` | `Item` o `404` (que se convierte en `undefined`) |
| `POST {base}/items` | JSON `{ "name": string, "description": string }`; respuesta `Item` |

Un `Item` tiene `id`, `name`, `description` y `createdAt` (fecha como string). Las respuestas no exitosas producen errores en el gateway; la interfaz traduce fallos de carga/alta a mensajes genéricos. Este contrato es una hipótesis implementada en el cliente, no una integración verificada: el backend debe implementarlo y aceptar origen/CORS del host donde corre Vite. No se implementan autenticación, actualización ni eliminación.

## Persistencia y arquitectura

La interfaz del puerto `ItemGateway` separa el dominio del acceso a datos. `MockItemGateway` inicializa con fixtures ficticias y guarda altas solo en memoria: los cambios desaparecen al recargar o reiniciar. `HttpItemGateway` delega la persistencia al servicio remoto; el cliente no implementa almacenamiento durable. El composable `useItems` gestiona carga, errores y altas, y los componentes presentan formulario y lista.

Para cambiar el backend, mantener el contrato `ItemGateway` e implementar otro adaptador; revisar también `createGateway` para seleccionarlo. No se debe inferir que los datos del mock sean persistentes ni que el endpoint hipotético exista.

## Alcance de verificación

La configuración de scripts y pruebas se describe a partir de los archivos del proyecto. No se ejecutaron instalación, build ni pruebas durante la elaboración de esta documentación; el funcionamiento con un servidor HTTP real tampoco está verificado.
