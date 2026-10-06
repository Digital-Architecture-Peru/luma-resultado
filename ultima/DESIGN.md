# DESIGN

## Hechos (respuestas del guion)
- ¿Qué necesitas construir? frontend
- ¿Qué stack? vue

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en vue (capa frontend) para "sin definir" sobre sin definir en sin definir, patrón sin definir.
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia sin definir detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en vue sin compilarlo ni ejecutarlo en este host: solo se verifica sintaxis donde hay validador local; el resto queda sin verificar.
- Integración (sin definir), persistencia (sin definir) y pruebas (sin definir) se implementan como candidate y requieren build real en CI.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento (vue · frontend)

> Complementa el diseño base y no sustituye sus criterios de aceptación. Dominio, patrón, integración, persistencia y tipo de pruebas siguen **sin definir**. Todo lo que se elige abajo es **hipótesis** y se puede revisar.

## Decisiones de arquitectura

| # | Decisión | Justificación |
|---|---|---|
| D1 | Vue 3 (Composition API, SFC) + Vite | Es el stack idiomático actual. Vite cubre dev, build y test con poca configuración. |
| D2 | JavaScript ESM + JSDoc, sin TypeScript | Permite verificar la sintaxis de los `.js` con un validador local (T03). Los `.vue` no se pueden verificar así, por eso se mantienen delgados. |
| D3 | Lógica en módulos `.js` puros y composables. Las SFC solo presentan | Concentra el código verificable y testeable fuera de las plantillas. |
| D4 | Puertos y adaptadores para los datos (`ItemRepository`) | Aísla la integración y la persistencia, que están sin definir. Hoy se usa un mock y mañana HTTP, sin tocar la UI. |
| D5 | El adaptador se elige con `VITE_DATA_MODE` (`mock` por defecto) | La configuración va por entorno, sin secretos. El modo por defecto no hace llamadas reales. |
| D6 | Sin Pinia ni vue-router inicialmente | No se añaden dependencias sin motivo. Con una sola vista basta con composables. |
| D7 | Vitest + @vue/test-utils + jsdom | Es el ecosistema nativo de Vite. Prueba la lógica pura y el montaje de componentes. |
| D8 | UX con estados explícitos (cargando, vacío, error), labels y navegación por teclado | Accesibilidad básica y comportamiento observable para el tester. |

## Estructura de módulos

```
package.json            # scripts dev/build/test; versiones fijadas
vite.config.js          # plugin vue + config vitest (jsdom)
index.html
.env.example            # VITE_DATA_MODE=mock, VITE_API_BASE_URL=
README.md
src/
  main.js               # createApp
  App.vue
  config/env.js         # lectura y validación de import.meta.env
  ports/itemRepository.js        # contrato JSDoc: list, create
  adapters/
    mockItemRepository.js        # memoria + fixtures ficticios
    httpItemRepository.js        # fetch, candidate
    createRepository.js          # fábrica según VITE_DATA_MODE
  features/items/
    itemModel.js        # validación y mapeo puros
    useItems.js         # estado, carga, errores
    ItemListView.vue
    ItemForm.vue
  fixtures/items.js     # datos ficticios
  shared/ui/EmptyState.vue
tests/
  itemModel.spec.js
  useItems.spec.js      # con mock repository
  ItemListView.spec.js  # montaje y estados
```

## Hipótesis
- **H1.** El dominio se modela como un recurso genérico `items` (lista + alta) porque el brief no lo define.
- **H2.** El validador local es `node --check` sobre los `.js`. Los `.vue` y el build quedan **sin verificar**.
- **H3.** La persistencia es solo en memoria (mock). `httpItemRepository` es un candidate sin backend real.
- **H4.** Las pruebas son unitarias y de componente. No se ejecutan en este host y requieren `npm ci && npm test` en CI.
- **H5.** Se asume una sola vista. Si el alcance crece, se añaden router y store, cada uno con justificación.

## Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El dominio real difiere de H1 | Hay que retrabajar features | Lógica aislada en `features/` y puerto estable |
| SFC con errores no detectados localmente | El build falla en CI | Plantillas mínimas; README indica el build pendiente |
| Versiones de dependencias incompatibles | Falla la instalación | Versiones fijadas en `package.json`; se valida en CI |
| Contrato HTTP inventado | Integración incorrecta | Marcado como candidate en código y README |
| Se cuelan datos reales o secretos | Exposición | Solo fixtures ficticios; `.env.example` sin valores sensibles |

## Trazabilidad con aceptación
- **T02:** fuentes en `src/`.
- **T03:** `node --check` sobre `src/**/*.js` y `tests/**/*.js`.
- **T04:** `tests/*.spec.js` presentes.
- **T05:** el README cubre instalación, scripts, `VITE_DATA_MODE`, integración y persistencia (candidate).
- **T06:** el resumen lista lo no verificado: `.vue`, build, ejecución de pruebas y adaptador HTTP.
