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

# DESIGN: refinamiento (Vue, capa frontend)

## Hechos adicionales
- El SGC está en modo *fallback*. No hay restricciones corporativas confirmadas.
- Faltan por definir el dominio, el patrón, la integración, la persistencia y el tipo de pruebas. Todo lo que sigue sobre esos puntos es **hipótesis**.

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Vue 3, Composition API y `<script setup>` | Es el estándar actual de Vue y facilita extraer lógica pura a *composables* que se pueden probar. |
| D2 | Vite como manifiesto de build (`package.json` y `vite.config.ts`) | Es la herramienta oficial del ecosistema y requiere poca configuración. |
| D3 | TypeScript en `.ts` y lógica de dominio fuera de los `.vue` | Los contratos quedan tipados. Además, la lógica en `.ts` es verificable por el validador local (T03), mientras que los SFC tienen menor cobertura de verificación. |
| D4 | Organización por *feature* con puertos y adaptadores | Sustituye al patrón "sin definir". La integración queda detrás de la interfaz `ItemGateway`, de modo que cambiar de backend no afecta a la UI. |
| D5 | Adaptador en memoria por defecto y adaptador HTTP opcional | Evita llamadas a sistemas reales. El adaptador HTTP se activa con `VITE_API_BASE_URL` y `VITE_USE_MOCK=false`. |
| D6 | Pinia solo para el estado de la feature | Hay estado compartido entre la lista y el formulario. Si el usuario no lo necesita, se puede retirar. |
| D7 | Vitest y @vue/test-utils | Son nativos de Vite y cubren pruebas unitarias y de componente (T04). |
| D8 | UX accesible: estados de carga, vacío y error, etiquetas en formularios, foco visible y diseño responsive | Son mínimos de una UI moderna y se pueden comprobar en las pruebas de componente. |

## Estructura de módulos
```
package.json · vite.config.ts · tsconfig.json · index.html · .env.example · README.md
src/
  main.ts · App.vue · router/index.ts
  app/config.ts                 # lee import.meta.env, sin secretos
  shared/ui/                    # BaseButton.vue, BaseInput.vue, EmptyState.vue
  features/items/
    domain/item.ts              # tipos y validación pura
    ports/ItemGateway.ts        # interfaz list/get/create/update/remove
    adapters/inMemoryItemGateway.ts
    adapters/httpItemGateway.ts # candidate, sin probar contra un API real
    store/useItemsStore.ts
    components/ItemForm.vue
    views/ItemsListView.vue
  mocks/items.fixture.ts        # datos ficticios
tests/
  unit/item.spec.ts
  unit/inMemoryItemGateway.spec.ts
  components/ItemForm.spec.ts
```

## Hipótesis explícitas
- **H1.** El dominio se modela de forma genérica como "Ítems" (id, nombre, estado, fecha) con CRUD. Habrá que renombrarlo cuando se defina el dominio real.
- **H2.** La persistencia es responsabilidad del backend. En el frontend solo existe el adaptador en memoria y no hay `localStorage`.
- **H3.** El contrato HTTP se asume REST/JSON en `/items`. Es candidate y no se ha validado.
- **H4.** Las versiones de las dependencias se fijan en `package.json` pero no se instalan en este host. No se ha ejecutado ni `npm install` ni el build.
- **H5.** La UI se presenta en un solo idioma (es) y no incluye autenticación.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| El dominio indefinido obliga a rehacer trabajo | El dominio está aislado en `features/items`, por lo que el cambio se limita a un único módulo. |
| El validador local no cubre los SFC `.vue` | La lógica se mueve a `.ts` y el README indica la verificación pendiente en CI (`vue-tsc`, `vitest`). |
| Las dependencias o versiones son incompatibles al instalar | Se fijan rangos *caret* conocidos y la compilación se marca como no verificada en el handoff. |
| El adaptador HTTP no coincide con el API real | Se usa el mock por defecto y el contrato se documenta en el README como hipótesis. |
| Se filtran secretos por variables de entorno | Solo se usa `.env.example` con valores ficticios y `.env` se añade a `.gitignore`. |

## Trazabilidad con la aceptación (sin cambios)
- **T03:** la sintaxis se verifica en `.ts`, `.json` y `.js`. Los `.vue` se reportan como no verificados si no hay validador.
- **T04:** los archivos de `tests/` deben estar presentes. Su ejecución no se afirma.
- **T05:** el README documenta `npm install`, `npm run dev`, `npm run build` y `npm test`, además de las variables de entorno, la integración (D5/H3) y la persistencia (H2).
- **T06:** el resumen candidate lista H1–H5 y los riesgos como pendientes, sin afirmar compilación ni producción. El resultado se publica con un commit.
