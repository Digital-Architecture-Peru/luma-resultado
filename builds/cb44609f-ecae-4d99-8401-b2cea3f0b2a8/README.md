# Banca por Internet · Transferencias entre cuentas propias

Aplicación Angular standalone que demuestra un flujo de transferencia en tres pasos: captura, confirmación y comprobante. El estado y los datos son ficticios y solo viven en memoria. Estado de entrega: **candidate**; no se ejecutaron compilación ni pruebas en este entorno.

## Requisitos

- Node.js 18.19+ o 20+ y npm (compatible con Angular 18).
- Chrome/Chromium para Karma en modo `ChromeHeadless`.

## Instalar, ejecutar y compilar

```bash
npm install
npm start                 # servidor de desarrollo: http://localhost:4200
npm run build             # build Angular
npm test                  # suite de Jasmine/Karma, una ejecución headless
```

La ruta inicial redirige a `/transferencias`. La instalación genera `package-lock.json`; se recomienda versionarlo para fijar las dependencias efectivamente resueltas. El script `test` requiere Chrome/Chromium disponible en el entorno.

## Flujo y validaciones

- Carga cuentas ficticias; captura origen, destino, importe y concepto, revisa y confirma.
- Exige cuentas distintas, importe positivo con hasta dos decimales y saldo suficiente.
- Los importes se representan como enteros en céntimos; la moneda y locale son PEN y `es-PE`.
- El gateway vuelve a validar antes de aplicar el movimiento. Un `operationId` evita duplicar una operación ya completada y se conserva al reintentar.
- Para comprobar el estado de error simulado, incluye `simular-error` en el concepto.

## Arquitectura e integración

El código está separado por responsabilidad en `src/app/core/accounts` (modelo, puerto y adaptador), `features/transfer` (página, estado y validadores) y `shared/ui` (componentes presentacionales organizados como Atomic Design). La página es la única que coordina el store; el acceso a datos se realiza por `AccountsGateway`, token `ACCOUNTS_GATEWAY`.

**Integración actual: ninguna.** `InMemoryAccountsGateway` responde con tres cuentas inventadas y latencia configurable; no hay HTTP, autenticación, sesión ni conexión a un backend. `app.config.ts` enlaza el token al adaptador en memoria. Para integrar un servicio real, implementa el puerto `AccountsGateway` con `HttpClient`, registra ese adaptador en el proveedor `ACCOUNTS_GATEWAY` y define el contrato de errores, autenticación/autorización, manejo de reintentos e idempotencia en servidor. No cambies la UI para sustituir el adaptador. La validación del cliente no sustituye la validación autoritativa del backend.

## Persistencia y configuración

**Persistencia: ninguna.** Las cuentas y comprobantes se conservan solo en memoria mientras vive la instancia de la aplicación; recargar reinicia los saldos y el historial. No se usa `localStorage`, IndexedDB ni base de datos. El repositorio en memoria es sustituible detrás del puerto; una persistencia real debe definirse e implementarse en el backend, sin tratar el estado del navegador como fuente confiable.

La configuración de muestra está en `src/environments/environment.ts` y `environment.development.ts`: `useMockGateway`, `simulatedLatencyMs`, `locale` y `currency`. No hay secretos ni variables sensibles. Si se desactiva el mock sin registrar otro adaptador, el arranque falla explícitamente: actualmente no existe una implementación real.

## Pruebas

`npm test` ejecuta pruebas unitarias del gateway, store y validadores; pruebas de componentes con TestBed; y una prueba de página para el flujo y estados de error. No se incluyen pruebas E2E ni se requiere servicio externo. Para una integración real, agregar pruebas del adaptador con `HttpTestingController` y pruebas de contrato; las pruebas de navegador E2E pueden añadirse con Playwright o Cypress.

## Accesibilidad y límites

La interfaz incluye etiquetas, mensajes de error anunciados, estados accesibles y foco gestionado en los pasos. No se verificaron en este entorno la compilación, ejecución, resultado de la suite, compatibilidad visual en navegadores ni la integración con servicios reales. La aplicación es demostrativa y no debe utilizarse para operaciones financieras reales.
