# DESIGN

## Hechos (respuestas del guion)
- ¿Qué necesitas construir? Frontend
- ¿Qué stack? Vue 3 + TypeScript

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Vue 3 + TypeScript (capa Frontend) para "sin definir" sobre sin definir en sin definir, patrón sin definir.
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia sin definir detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Vue 3 + TypeScript sin compilarlo ni ejecutarlo en este host: solo se verifica sintaxis donde hay validador local; el resto queda sin verificar.
- Integración (sin definir), persistencia (sin definir) y pruebas (sin definir) se implementan como candidate y requieren build real en CI.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento (Vue 3 + TypeScript · Frontend)

> Complementa el diseño base y no cambia sus criterios de aceptación. SGC está en *fallback*, así que no hay restricciones corporativas confirmadas. Todo lo que el guion no confirma figura como hipótesis (H#).

## Decisiones de arquitectura

| # | Decisión | Justificación |
|---|---|---|
| D1 | Proyecto Vite con SFC `<script setup lang="ts">` | Es la estructura oficial de `create-vue`. Da builds rápidos y tipado nativo en componentes. |
| D2 | Puertos y adaptadores ligero: `ports/` para interfaces y `adapters/` para implementaciones | Integración y persistencia están sin definir. Aislarlas permite cambiarlas sin tocar la UI (H3, H4). |
| D3 | Estado con composables (`useItems`), sin Pinia | No hay evidencia de estado compartido entre vistas. Se evita una dependencia sin motivo; Pinia se reevalúa si aparecen más vistas. |
| D4 | Sin `vue-router` | Se asume una sola vista (H2). Añadirlo después no rompe la estructura. |
| D5 | Vitest + `@vue/test-utils` + `jsdom` | Se integra con la configuración de Vite y no requiere toolchain extra. |
| D6 | Configuración por `import.meta.env` (`VITE_DATA_SOURCE`, `VITE_API_BASE_URL`) más `.env.example` sin valores reales | Cumple "sin secretos". El adaptador se elige en una única factory. |
| D7 | UI accesible: HTML semántico, `label` asociados, `aria-live` para estados, foco visible | La UX debe cubrir estados de carga, vacío y error sin depender de librerías UI. |
| D8 | Dependencias mínimas: `vue`, más `vite`, `@vitejs/plugin-vue`, `typescript`, `vue-tsc`, `vitest`, `@vue/test-utils` y `jsdom` en dev | Cada una cubre un rol concreto de build, tipado o pruebas. |

## Estructura de módulos

```
package.json            # scripts: dev, build (vue-tsc --noEmit && vite build), test (vitest run)
tsconfig.json
vite.config.ts          # incluye bloque test (jsdom)
index.html
.env.example
README.md
src/
  main.ts
  App.vue
  env.d.ts              # tipos de ImportMetaEnv
  domain/item.ts        # tipo Item + validación pura
  ports/ItemRepository.ts
  adapters/InMemoryItemRepository.ts   # usa fixtures ficticias
  adapters/HttpItemRepository.ts       # fetch a VITE_API_BASE_URL (candidate)
  adapters/index.ts     # factory según VITE_DATA_SOURCE (default: mock)
  composables/useItems.ts              # loading / error / items / create
  components/ItemList.vue
  components/ItemForm.vue
  components/StatusMessage.vue
  fixtures/items.ts
tests/
  domain/item.spec.ts
  composables/useItems.spec.ts
  components/ItemList.spec.ts
```

## Hipótesis explícitas
- **H1. Dominio:** está "sin definir". Se usa una entidad genérica `Item { id, name, status, createdAt }` con un caso de uso para listar y crear. Hay que renombrarla cuando se defina el dominio.
- **H2. Alcance de UI:** una sola vista con listado y formulario.
- **H3. Integración:** está "sin definir". Por defecto se usa el adaptador en memoria. `HttpItemRepository` asume REST JSON (`GET`/`POST /items`), sin contrato confirmado.
- **H4. Persistencia:** está "sin definir". Se usa memoria volátil; no hay `localStorage` ni backend real.
- **H5. Tipo de pruebas:** está "sin definir". Se asumen pruebas unitarias de dominio y composable, y pruebas de componente. No se incluyen e2e.
- **H6. Validador local (T03):** probablemente solo puede verificar JSON (`package.json`, `tsconfig.json`). Los `.ts` y `.vue` quedan sin verificar hasta ejecutar `vue-tsc` en CI.

## Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Dominio genérico no útil para el negocio | Retrabajo de nombres y campos | Aislarlo en `domain/` y listarlo como pregunta abierta en el README |
| Contrato HTTP inventado | El adaptador falla contra la API real | Marcarlo como candidate. La UI depende solo del puerto. |
| TS/SFC no verificables localmente | Errores de tipos ocultos | Declararlo en el handoff. `build` ejecuta `vue-tsc --noEmit` en CI. |
| Versiones de dependencias sin lockfile | Builds no reproducibles | Usar rangos `^` explícitos y recomendar generar el lockfile en CI |
| Datos ficticios confundidos con reales | Riesgo de confianza | Usar nombres evidentemente ficticios y dejar constancia en el README |

## Trazabilidad con las tareas
- **T02:** `src/**`, D1 a D4 y D6 a D8.
- **T03:** archivos JSON más los que admita el validador (H6).
- **T04:** `tests/**`, D5 y H5.
- **T05:** README con build, ejecución, H3/H4 y variables de entorno.
- **T06:** el handoff lista H1 a H6 como no verificados y no afirma compilación ni producción.

## Preguntas abiertas
1. ¿Cuál es el dominio y su entidad principal?
2. ¿Existe una API y un contrato (OpenAPI)?
3. ¿Se requiere persistencia en el cliente?
4. ¿Se necesitan pruebas e2e?
