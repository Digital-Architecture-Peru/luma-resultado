# Consulta de pagos

Aplicación frontend de consulta de pagos ficticios, construida con Angular 18 standalone y TypeScript. La página permite buscar por beneficiario, concepto o referencia, filtrar por estado y limpiar los filtros. Los resultados se ordenan por fecha descendente. No se crean ni modifican pagos.

## Requisitos

- Node.js compatible con Angular 18 (Node.js 18.19.1 o posterior de la línea 18, o Node.js 20.11.1 o posterior).
- npm.

## Instalar, ejecutar y compilar

Desde la raíz del proyecto:

```sh
npm install
npm start
```

El servidor de desarrollo de Angular suele estar disponible en `http://localhost:4200/`; la salida de `ng serve` confirma la URL. Detén el servidor con Ctrl+C.

Para generar el build de producción y comprobar tipos:

```sh
npm run build
```

El script ejecuta primero `tsc -p tsconfig.app.json --noEmit` y después `ng build`. Angular escribe el resultado en `dist/banca-consulta-pagos/`.

## Pruebas

```sh
npm test
```

Jest se ejecuta en modo CI, en una sola pasada y sin modo interactivo. Las pruebas cubren la función de filtrado (estado, búsqueda sin distinguir mayúsculas ni acentos, referencia, orden y no mutación de la entrada) y la página (carga correcta, búsqueda, estado vacío, limpieza de filtros y error del repositorio).

## Diseño y flujo de datos

La composición de dependencias está centralizada en `src/app/app.config.ts`: el puerto `PagosRepository` se vincula actualmente con `PagosMockRepository`. La página `PagosConsultaPageComponent` consulta el repositorio, mantiene los filtros y la carga con signals y delega la búsqueda a la función pura `filtrarPagos`. La presentación se organiza en `atoms/`, `molecules/`, `organisms/` y `templates/`.

El modelo `Pago` define los datos de consulta: identificador, fecha ISO (`yyyy-mm-dd`), beneficiario, concepto, importe, moneda, estado y referencia. El adaptador actual devuelve registros ficticios en memoria (`PAGOS_FICTICIOS`); no realiza llamadas de red ni persiste cambios. Al recargar la aplicación, los datos provienen nuevamente de esa lista estática.

## Integración con una API y persistencia

La integración real no está definida en este proyecto: no se conocen URL, autenticación, contrato del servicio ni requisitos de almacenamiento. Para conectarla, implementar un adaptador que extienda `PagosRepository`, inyectar el cliente HTTP de Angular y convertir/validar la respuesta remota como `readonly Pago[]`; después sustituir en `app.config.ts` el proveedor `useClass: PagosMockRepository` por el adaptador HTTP. El adaptador debe manejar errores de transporte y respuestas inválidas; la página ya presenta un estado de error y ofrece reintento.

Si se requiere persistencia, debe especificarse e implementarse en el servicio/backend correspondiente. Esta interfaz es de solo consulta y la aplicación no contiene base de datos, almacenamiento local ni credenciales. No se deben incluir secretos en el frontend; cualquier configuración pública de URL debe gestionarse según el entorno y la política del despliegue.
