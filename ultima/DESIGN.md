# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Frontend
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Vue 3 + TypeScript
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Vue 3 + TypeScript (capa Frontend) para "Consulta" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia sin definir detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Vue 3 + TypeScript sin compilarlo ni ejecutarlo en este host: solo se verifica sintaxis donde hay validador local; el resto queda sin verificar.
- Integración (sin definir), persistencia (sin definir) y pruebas (Unitarias) se implementan como candidate y requieren build real en CI.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento: Consulta de Tarjetas (Vue 3 + TypeScript)

> Complementa el diseño base. Mantiene sus Hechos y su Aceptación sin cambios.

## Decisiones de arquitectura

| # | Decisión | Justificación |
|---|---|---|
| D1 | Vite + Vue 3 SFC con `<script setup lang="ts">` | Es la estructura idiomática de Vue 3 y da tipado estricto sin configuración extra. |
| D2 | Atomic Design en `src/components/{atoms,molecules,organisms,templates}` y la página en `src/pages` | Es el patrón pedido. Separa la UI reutilizable de la composición de la vista. |
| D3 | Interfaz `CardsGateway` con un único adaptador `MockCardsGateway` | La integración no está definida. La UI depende del contrato, no del backend. |
| D4 | Estado con un composable (`useCardsQuery`) y sin Pinia | La consulta es de solo lectura y de alcance acotado. Evita una dependencia sin motivo. |
| D5 | Sin persistencia: estado solo en memoria y sin `localStorage` | La persistencia no está definida. Además, guardar datos de tarjetas en el navegador es un riesgo. |
| D6 | PAN siempre enmascarado (`**** 1234`) desde el tipo de dominio | Los datos ficticios nunca contienen el PAN completo. Así se previene la exposición por diseño. |
| D7 | Vitest + `@vue/test-utils` | Es el runner nativo del ecosistema Vite y cubre las pruebas unitarias pedidas. |
| D8 | Configuración mediante `import.meta.env.VITE_*` y un `.env.example` sin valores sensibles | Cumple la regla de no incluir secretos y deja preparado el adaptador real. |
| D9 | Página exportable, sin `vue-router` | Se desconoce cómo integra el shell de Banca por Internet (ver H2). |

## Estructura de módulos

```
src/
  domain/card.ts                 # Card, CardMovement, CardStatus (tipos)
  services/cards-gateway.ts      # interface CardsGateway
  services/mock-cards-gateway.ts # datos ficticios con latencia simulada
  composables/useCardsQuery.ts   # loading / error / data
  components/
    atoms/      BaseBadge.vue, MaskedPan.vue, AmountText.vue
    molecules/  CardSummaryItem.vue, MovementRow.vue
    organisms/  CardList.vue, CardDetail.vue, MovementTable.vue
    templates/  CardsConsultTemplate.vue
  pages/CardsConsultPage.vue
  main.ts, App.vue
tests/unit/  *.spec.ts (átomos, organismo, composable, mock)
package.json, vite.config.ts, tsconfig.json, .env.example, README.md
```

## UX (frontend)
- La vista tiene tres estados explícitos: cargando (skeleton), vacío y error con opción de reintentar.
- Los montos se formatean con `Intl.NumberFormat`, usando la moneda que llega en el dato.
- Accesibilidad:
  - Las tablas usan `<th scope>`.
  - El estado de la tarjeta se comunica con texto y color, no solo con color.
  - Todos los controles son navegables con teclado.

## Hipótesis
- H1: El SGC está en fallback, así que no hay design system corporativo. Se usan estilos propios y mínimos.
- H2: La capacidad se integra como página o componente montable en el shell existente. Se desconoce si es microfrontend o monolito.
- H3: El alcance de la consulta es: listado de tarjetas, detalle (línea, disponible, estado) y últimos movimientos. No incluye operaciones transaccionales.
- H4: El idioma es español. La moneda y el locale se toman del dato o de la configuración, sin fijar un país.
- H5: Las versiones de las dependencias son las estables más recientes conocidas. No se instalan ni se resuelven en este host.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| El contrato real de la API puede diferir del tipo `Card` | El adaptador real mapea al dominio y la UI no cambia. |
| Exposición de datos sensibles de tarjeta | Aplicar D6, no hacer logs de datos y no persistir (D5). |
| Compilación y pruebas no verificadas aquí | Se entrega como candidate. Requiere `npm ci && npm run build && npm test` en CI. |
| Desalineación con el estándar visual del banco | Los átomos aíslan los estilos, lo que facilita reemplazarlos. |
| Estado de autenticación y sesión desconocido | Queda fuera de alcance. Se documenta en el README como punto de integración. |

## Trazabilidad con la Aceptación base

| Todo | Evidencia |
|---|---|
| T02 | Fuentes en `src/` |
| T03 | Validación de sintaxis de `.ts`, `.json` y `.vue` donde exista un validador local. Lo no validable se reporta como no verificado. |
| T04 | `tests/unit/*.spec.ts` |
| T05 | `README.md` con build, ejecución, integración (sin definir) y persistencia (sin definir) |
| T06 | Resumen candidate que no afirma compilación ni producción |
