# Banca por Internet · Transacciones de tarjetas

Aplicación frontend Angular 20 (componentes standalone, signals y zoneless) para registrar consumos y pagos de tarjetas. Presenta tarjetas y transacciones ficticias; no se conecta a un banco ni realiza llamadas de red. La arquitectura separa dominio, aplicación, infraestructura y UI con Atomic Design.

## Requisitos

- Node.js compatible con Angular 20 (Node.js 20.19+ o 22.12+).
- npm.

## Instalar, ejecutar y probar

Desde la raíz del proyecto:

```sh
npm install
npm start
```

Abre la URL local que informe Angular CLI (normalmente `http://localhost:4200`). Para generar la compilación de producción y ejecutar las pruebas unitarias en una sola pasada:

```sh
npm run build
npm test
```

`npm run build` ejecuta `ng build` con la configuración de producción por defecto y comprobación de tipos/plantillas Angular. `npm test` usa el builder unit-test de Angular con Vitest y jsdom en modo no interactivo. Las pruebas se encuentran junto a las capas bajo `src/app` y cubren validación, store, controles, formulario y página. No se requiere servicio externo para desarrollar o probar.

## Organización

- `src/app/domain`: modelos, validación pura y puerto abstracto `CardsGateway`.
- `src/app/application/transactions.store.ts`: casos de uso/estado de la feature con señales.
- `src/app/infrastructure/in-memory-cards.gateway.ts`: adaptador con datos ficticios.
- `src/app/atoms`, `molecules`, `organisms`, `pages`: componentes de presentación.
- `src/app/app.config.ts`: composición de dependencias Angular.

Las reglas de dominio validan importes positivos con hasta dos decimales, consumo dentro del crédito disponible y límite operativo, pago que no exceda la deuda, tarjeta activa y descripción de 3 a 60 caracteres. La validación del cliente mejora la experiencia; cualquier integración real debe repetir las reglas en el servidor.

## Integración

Actualmente no hay integración backend: `CardsGateway` define el puerto de lectura de tarjetas, consulta de historial y envío de transacciones. Para conectar un servicio real, implementar un adaptador (por ejemplo, `HttpCardsGateway`) que extienda/implemente ese contrato, traduzca el contrato HTTP y los errores a modelos de dominio —incluido `TransactionRejectedError` para rechazos de negocio— y reemplazar el provider `InMemoryCardsGateway` en `src/app/app.config.ts`. Configurar `provideHttpClient()` al añadir `HttpClient`. Mantener validación/autorización y límites de crédito en el servidor; no confiar en el estado del navegador. La URL del servicio debe configurarse mediante configuración de despliegue apropiada, sin incluir credenciales ni secretos en el bundle; esta plantilla no define endpoint ni configuración de entorno porque no existe integración implementada.

## Persistencia y datos

El adaptador mantiene tarjetas e historial únicamente en memoria. Los cambios se pierden al recargar o reiniciar; no hay base de datos, almacenamiento local ni persistencia entre sesiones. Los datos semilla son ficticios. Una futura persistencia pertenece al backend; si se introduce, definir almacenamiento y migraciones allí, proteger datos sensibles y conservar `CardsGateway` como frontera para desacoplar UI y dominio.

## Estado de verificación

Este documento describe los scripts y la estructura configurada en el repositorio. No se afirma que build o pruebas hayan sido ejecutados en el entorno de generación.
