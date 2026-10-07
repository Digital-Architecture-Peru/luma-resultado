# Consulta de Cuentas · Banca por Internet

Aplicación de consulta **solo lectura** construida con Vue 3, TypeScript y Vite. Presenta cuentas ficticias, permite filtrarlas por tipo y consultar su detalle. Estado de entrega: **candidate**; no se ejecutaron instalación, compilación ni pruebas en este entorno.

## Requisitos

- Node.js 18.18 o posterior (recomendado: Node.js 20 LTS).
- npm compatible con la versión de Node instalada.

## Instalar, ejecutar y verificar

Desde la raíz del proyecto:

```bash
npm install       # instalar dependencias; generar y versionar package-lock.json
npm run dev       # iniciar Vite para desarrollo (la terminal muestra la URL local)
npm run typecheck # comprobar tipos TypeScript y componentes Vue
npm test          # ejecutar pruebas unitarias y de componentes con Vitest
npm run build     # typecheck y bundle de producción en dist/
npm run preview   # previsualizar localmente el bundle de dist/
```

`npm run test:watch` inicia Vitest en modo de observación. No se incluye prueba E2E.

## Configuración

`env.example.txt` es la plantilla de entorno disponible en el repositorio; cópiela a `.env` para desarrollo local. `VITE_APP_LOCALE` configura el locale BCP 47 usado para formatear montos y fechas; su valor predeterminado es `es` (por ejemplo, `es-EC` o `en-US`). Reinicie Vite después de modificar variables.

**Toda variable `VITE_*` queda expuesta en el bundle del navegador. No incluya secretos, credenciales ni tokens.** La plantilla de ignore está en `gitignore.txt`; en el repositorio de publicación deberá usarse como `.gitignore`. Los nombres alternativos se conservan por las restricciones del workspace.

## Arquitectura y recorrido de datos

La interfaz sigue una estructura por componentes inspirada en Atomic Design:

- `src/domain/`: tipos de cuenta y utilidades de formato/etiquetas.
- `src/ports/AccountRepository.ts`: contrato asíncrono de solo lectura (`list` y `getById`).
- `src/adapters/InMemoryAccountRepository.ts` y `src/fixtures/`: adaptador local con datos ficticios.
- `src/composables/useAccounts.ts`: carga, filtro, selección y estados de lista/detalle.
- `src/components/`: átomos, moléculas, organismos, plantilla y página.
- `tests/`: pruebas unitarias y de componentes con Vitest.

`App.vue` proporciona la implementación del repositorio mediante la clave de inyección; la página consume el puerto, de modo que un adaptador futuro puede sustituirse sin acoplar los componentes a la persistencia. Los saldos se representan como enteros en unidades menores y se formatean usando moneda ISO 4217. Los números de cuenta deben mostrarse enmascarados.

## Integración

Actualmente **no hay integración de red** ni conexión con un host bancario. El adaptador en memoria utiliza únicamente datos ilustrativos. La autenticación, la sesión y la autorización pertenecen al host/backend y no están implementadas en esta aplicación.

Para integrar un backend, implemente `AccountRepository` con un adaptador HTTP y provea esa implementación desde `App.vue`. Contrato sugerido, sujeto a acuerdo con el backend:

| Operación | Ruta sugerida | Resultado |
|---|---|---|
| Listar | `GET /cuentas?tipo=SAVINGS` (tipo opcional) | Colección de cuentas del titular autenticado |
| Detalle | `GET /cuentas/{id}` | Cuenta autorizada o respuesta 404 |

El cliente no debe poder elegir el titular en la petición. El servidor debe derivar la identidad de una sesión autenticada, autorizar cada detalle y limitar los campos devueltos. No registrar respuestas con datos personales o números completos de cuenta. La UI no se debe considerar una frontera de autorización.

## Persistencia

No se persiste información en el navegador: no hay `localStorage`, base de datos ni llamadas remotas. El puerto desacopla la UI de la fuente de datos. La persistencia futura debe implementarse exclusivamente en un backend/BFF; el navegador **nunca** debe conectarse directamente a PostgreSQL.

`docs/postgresql-reference.sql` documenta un esquema y consultas de referencia, no es una migración ni se ejecuta desde este proyecto, y no fue validado contra una instancia de PostgreSQL. Antes de adoptarlo, el equipo de backend debe definir migraciones, retención y controles de acceso. Como mínimo, las consultas deben parametrizar valores y filtrar siempre por el titular autenticado, incluso al buscar por ID. El número de cuenta requiere controles de almacenamiento y exposición acordes a la política de datos; la máscara visual no protege el valor recibido por el navegador.

## Pruebas

- `tests/unit/`: formato, adaptador en memoria y composable.
- `tests/components/`: componentes y página con repositorios de prueba; incluye estados de carga, éxito, vacío y error, filtro y detalle.
- Ejecutar con `npm test`; las pruebas no requieren servicios externos ni red.

## Accesibilidad y seguridad consideradas

La interfaz incluye estados accesibles y mensajes de estado, controles etiquetados, foco visible y diseño adaptable. Se evita renderizado HTML arbitrario y se enmascara el número en la presentación. Son medidas de implementación, no una certificación de seguridad o accesibilidad; deben revisarse en el shell integrado y con datos reales.

## Límites de verificación

No se ejecutaron `npm install`, `npm run typecheck`, `npm test` ni `npm run build`; por tanto, no se afirma que compile ni que las pruebas pasen. No hay lockfile, integración con el host, backend, base de datos ni pruebas E2E. El esquema SQL es solo una referencia y no está verificado en PostgreSQL.
