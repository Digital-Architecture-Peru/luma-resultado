# Banca por Internet · Consulta de cuentas

Aplicación frontend Angular 17 para consultar cuentas: resumen de saldos activos por moneda, listado, búsqueda por alias o número enmascarado y filtro por tipo. Interfaz en español y datos de demostración ficticios; no realiza operaciones bancarias ni llamadas de red.

## Requisitos

- Node.js 18.19+ o 20+.
- npm compatible con la versión de Node.

## Instalar, ejecutar y compilar

Desde la raíz del proyecto:

```sh
npm install
npm start
```

Abre <http://localhost:4200>. El servidor de desarrollo recarga al cambiar fuentes. Para generar el bundle de producción y realizar el chequeo TypeScript configurado:

```sh
npm run build
```

El resultado de Angular se genera bajo `dist/consulta-cuentas/`. No se incluye configuración de despliegue; servir ese artefacto requiere el hosting estático elegido y su configuración para rutas SPA si se incorporan rutas.

## Pruebas

```sh
npm test
```

El script ejecuta Jest en modo no interactivo (`--ci`), con `jest-preset-angular` y entorno jsdom. Las pruebas unitarias cubren el pipe monetario, insignias de estado, consultas y página de cuentas. Para ejecutar una prueba concreta, por ejemplo:

```sh
npx jest src/app/core/account-query.spec.ts --runInBand
```

## Estructura y flujo de datos

La aplicación usa componentes standalone y Angular 17. `src/app/app.config.ts` es el punto de composición de dependencias y actualmente enlaza el puerto abstracto `AccountRepository` con `InMemoryAccountRepository`. La página `AccountsPageComponent` carga cuentas, mantiene estado de carga/error y filtros mediante signals; `account-query.ts` contiene las funciones puras para filtrar y sumar saldos activos sin mezclar monedas. Los componentes se agrupan por responsabilidad en `atoms/`, `molecules/`, `organisms/` y `pages/`.

El adaptador de memoria devuelve los seis registros ficticios definidos en `src/app/core/in-memory-account.repository.ts`, con latencia simulada de 300 ms. No existe API configurada ni persistencia local o remota: los filtros y datos viven solo durante la sesión; al recargar se vuelven a cargar las muestras. No se almacenan datos en localStorage, cookies ni base de datos.

## Integración futura

La integración con backend está pendiente de definir. Para conectarla, implementar un adaptador que extienda `AccountRepository`, solicite datos mediante `HttpClient` y mapear/validar la respuesta al modelo `Account`; cambiar el proveedor en `app.config.ts` para usar ese adaptador. Configurar el origen del servicio por entorno/build, no incrustar credenciales o tokens en el frontend (los secretos no pueden protegerse en código entregado al navegador). Acordar con el backend autenticación, autorización, contrato y manejo de errores antes de habilitar datos reales. La aplicación presente es solo de consulta y no debe considerarse un canal bancario real.

## Estado de verificación

La documentación describe los scripts y archivos existentes. Build y pruebas no se han ejecutado en esta sesión.
