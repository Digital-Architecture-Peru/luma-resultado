# Banca por Internet · Transferencias entre cuentas

Aplicación frontend de transferencias entre cuentas propias, construida con Angular 18 standalone components y signals. La interfaz usa Atomic Design y `TransferStore` como fachada de estado. El proyecto usa datos ficticios; **no es un sistema bancario real** y no debe recibir datos personales ni credenciales.

## Requisitos

- Node.js 18.19+ o 20+.
- npm (incluido con Node.js).

## Instalar, compilar y ejecutar

Desde la raíz del repositorio:

```sh
npm install
npm run build
npm start
```

`npm run build` ejecuta Angular CLI con compilación AOT/type-check; la configuración predeterminada es producción. `npm start` inicia el servidor de desarrollo Angular en `http://localhost:4200/`.

## Pruebas

```sh
npm test
```

El script ejecuta Jest en modo no interactivo (`jest --ci`). Los tests cubren la validación de transferencias, el adaptador en memoria, el estado/fachada y el formulario. Para ejecutar un archivo concreto se puede usar, por ejemplo, `npx jest src/app/core/models/transfer.validator.spec.ts --runInBand`.

## Organización

- `src/app/atoms`: controles UI básicos.
- `src/app/molecules`: tarjeta de cuenta y elemento de movimiento.
- `src/app/organisms`: lista de cuentas, formulario y lista de movimientos.
- `src/app/core/models`: modelos de cuenta, movimiento y solicitud; validación de negocio.
- `src/app/core/ports/accounts.gateway.ts`: contrato de acceso a cuentas y transferencias.
- `src/app/core/adapters/in-memory-accounts.gateway.ts`: adaptador actual con cuentas semilla ficticias.
- `src/app/core/state/transfer.store.ts`: carga y actualización del estado mediante signals.
- `src/app/app.config.ts`: composición de dependencias; vincula el puerto al adaptador en memoria.

## Integración

Actualmente no hay backend, llamadas de red ni integración externa. La UI/estado depende de la abstracción `AccountsGateway`; el provider de `app.config.ts` selecciona `InMemoryAccountsGateway`. Para integrar un backend:

1. Implementar `AccountsGateway` en un adaptador separado, usando `HttpClient` y DTOs explícitos. Registrar `provideHttpClient()` y sustituir el provider en `app.config.ts`.
2. Acordar y documentar el contrato de API: carga de cuentas y movimientos, solicitud de transferencia, respuesta y errores. El servidor debe volver a validar autorización, cuentas, saldo, límites y duplicidad de la operación; las validaciones del navegador son solo experiencia de usuario y no constituyen seguridad.
3. Obtener la URL base desde configuración de despliegue apropiada para Angular (la configuración incluida en el bundle es pública, no un secreto). No incluir tokens, contraseñas ni credenciales en el repositorio o en el código cliente. La autenticación/autorización y gestión de sesión deben resolverse con el backend y los mecanismos corporativos correspondientes.
4. Mantener los tests unitarios del adaptador ficticio y agregar pruebas del adaptador HTTP y del contrato ante éxitos, errores y fallos de red.

## Persistencia y reglas de negocio

El adaptador usa tres cuentas ficticias denominadas en PEN y mantiene saldos y movimientos **solo en memoria**. La recarga reinicia los datos; no hay almacenamiento local, base de datos ni persistencia entre sesiones. No se deben considerar las operaciones como reales.

La validación de interfaz exige origen y destino seleccionados y distintos; monto positivo, hasta dos decimales, no mayor de S/ 50 000 ni del saldo de origen; y concepto de hasta 60 caracteres. El adaptador vuelve a comprobar las cuentas y el saldo antes de aplicar la transferencia. Si se añade persistencia real, debe residir detrás de un backend: transacción atómica para débito/crédito, control de concurrencia/idempotencia y auditoría, con políticas de acceso y retención definidas. Nunca confiar en el estado o saldo enviados por el cliente.

## Estado de verificación

Los comandos anteriores describen cómo compilar y probar. No se ejecutaron build ni pruebas durante la preparación de esta documentación.
