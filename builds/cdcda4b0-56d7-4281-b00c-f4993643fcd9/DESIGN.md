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

# DESIGN · Refinamiento (Vue 3 + TypeScript, Frontend)

> Complementa el diseño base. No modifica sus criterios de aceptación. El dominio, la integración, la persistencia y el patrón llegan **sin definir** y SGC está en **fallback**, así que las decisiones que dependen de esos datos se marcan como hipótesis.

## Decisiones de arquitectura
| ID | Decisión | Justificación |
|---|---|---|
| D1 | Vite + Vue 3 SFC con `<script setup lang="ts">` y TS `strict` | Es el toolchain oficial e idiomático. Su configuración es mínima. |
| D2 | Puertos y adaptadores ligeros: `domain/`, `ports/`, `adapters/`, `composables/`, `components/` | Integración y persistencia están sin definir. Las interfaces permiten cambiarlas sin tocar la UI. |
| D3 | Estado con composables (`useItems`) y sin Pinia ni Router | Evita dependencias sin motivo. Se añaden solo si aparecen varias vistas o estado compartido complejo. |
| D4 | La lógica de dominio y validación vive en `.ts` puros, no en `.vue` | Así hay más archivos que el validador local puede revisar (T03). Además, esa lógica se prueba sin montar componentes. |
| D5 | Adaptador por defecto `MockItemGateway` con fixtures ficticios | Cumple el requisito de no llamar a sistemas reales. |
| D6 | Configuración con `import.meta.env.VITE_*` y un `.env.example` | Las variables `VITE_*` se exponen al navegador. Por eso nunca contienen secretos. |
| D7 | Pruebas con Vitest y `@vue/test-utils` | Se integran de forma nativa con Vite. Cubren dominio, composable y un componente. |
| D8 | UI accesible: labels, roles y estados de carga, vacío y error | Da una UX moderna y comprobable por el tester. |

## Estructura de módulos
```
package.json · tsconfig.json · vite.config.ts · index.html · .env.example · README.md
src/main.ts · src/App.vue
src/domain/item.ts              # tipos + validateItem() puro
src/ports/ItemGateway.ts        # interface list/get/create
src/adapters/mockItemGateway.ts # en memoria, fixtures
src/adapters/httpItemGateway.ts # candidate, contrato documentado, no usado por defecto
src/composables/useItems.ts     # estado, loading, error
src/components/ItemList.vue · ItemForm.vue
src/fixtures/items.ts           # datos ficticios
tests/domain.spec.ts · tests/useItems.spec.ts · tests/ItemList.spec.ts
```

## Hipótesis
- **H1.** El dominio es genérico ("items" con listado, detalle y alta) porque falta definirlo. Se renombra al conocer el caso real.
- **H2.** La persistencia es en memoria. `localStorage` u otra opción se implementaría como adaptador nuevo detrás de `ItemGateway`.
- **H3.** La integración es REST JSON vía `httpItemGateway` con contrato documentado en el README. Queda como candidate y sin probar contra un backend real.
- **H4.** Hay una sola vista, por lo que no se usa Router.
- **H5.** Las versiones de dependencias son rangos `^` actuales y no se instalan en este host.

## Riesgos y mitigación
| Riesgo | Mitigación |
|---|---|
| El dominio indefinido produce una UI poco útil | Mantener el dominio aislado en `domain/` para renombrarlo con bajo costo. |
| Los `.vue` y los imports no se validan localmente | Aplicar D4 y declarar en el handoff qué archivos quedaron sin verificar. |
| No hay build ni ejecución de tests en el host | Declarar el estado candidate y documentar `npm ci && npm run build && npm test` para CI. |
| Fuga de secretos por variables `VITE_*` | Usar `.env.example` solo con URLs ficticias y añadir una advertencia en el README. |
| Desfase de versiones de dependencias | Recomendar un lockfile generado en CI. |

## Trazabilidad con la aceptación base
- **Sintaxis (T03).** Se valida en `.ts` y `.json`. Los `.vue` se listan como no verificados.
- **Pruebas (T04).** Se entregan tres `*.spec.ts` en `tests/`.
- **README (T05).** Incluye build, ejecución, el contrato de H3 y la persistencia de H2.
- **Handoff (T06).** Lista H1–H5 y lo no verificado. No afirma compilación ni producción.
