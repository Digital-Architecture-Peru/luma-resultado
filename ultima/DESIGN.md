# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Frontend
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Vue 3 + TypeScript
- ¿Qué pruebas? Estándar completo

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Vue 3 + TypeScript (capa Frontend) para "Consulta" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia sin definir detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Vue 3 + TypeScript sin compilarlo ni ejecutarlo en este host: solo se verifica sintaxis donde hay validador local; el resto queda sin verificar.
- Integración (sin definir), persistencia (sin definir) y pruebas (Estándar completo) se implementan como candidate y requieren build real en CI.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento: Consulta de Tarjetas (Vue 3 + TypeScript)

> Complementa el diseño base y no reemplaza sus Hechos ni sus criterios de Aceptación. El código lo escribe el builder (T02 a T05). Este documento solo define el diseño.

## Contexto SGC
- **Hecho:** estado `fallback` (SGC no configurado). No se citan estándares corporativos, sistema de diseño ni contratos reales.

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Vite + SFC `<script setup lang="ts">`, chequeo de tipos con `vue-tsc` | Es la toolchain idiomática de Vue 3 y tiene tipado estricto en las plantillas. |
| D2 | Atomic Design en `components/{atoms,molecules,organisms,templates}` y `pages/` | Es el patrón elegido en el guion. Permite reutilizar componentes y probarlos por nivel. |
| D3 | Puerto `CardsRepository` con adaptador `MockCardsRepository` | La integración está sin definir. El puerto aísla la UI del origen de datos. |
| D4 | Selección del adaptador por `VITE_CARDS_SOURCE` (`mock` por defecto) | La configuración va por entorno, sin secretos. El adaptador HTTP queda para cuando exista contrato. |
| D5 | Composable `useCardsQuery` en lugar de Pinia | Es una sola vista de consulta. Se evita una dependencia sin motivo. |
| D6 | Sin vue-router: página única con lista y panel de detalle | Se asume que el enrutamiento lo maneja la app host de Banca por Internet. |
| D7 | El modelo solo contiene `last4`; la UI muestra `•••• 1234` | Minimiza datos sensibles. El PAN completo no existe en el front. |
| D8 | Sin persistencia en el cliente (ni `localStorage` ni `sessionStorage`) | La persistencia está sin definir y los datos de tarjeta son sensibles. |
| D9 | Montos con `Intl.NumberFormat` y locale configurable por `VITE_LOCALE` | No hay país confirmado. Se evita fijar moneda o formato en el código. |
| D10 | Estados explícitos: `loading`, `empty`, `error`, `ready`, con `aria-live` | Accesibilidad y criterios observables por el tester. |

## Modelo de dominio (tipos)
- `Card`: `id`, `alias`, `brand`, `kind: 'credito' | 'debito'`, `last4`, `status: 'activa' | 'bloqueada' | 'vencida'`, `currency`, `availableBalance`, `creditLimit?`, `expiry: 'MM/AA'`.
- `Movement`: `id`, `cardId`, `date` (ISO), `description`, `amount`, `currency`, `status: 'procesado' | 'pendiente'`.
- `CardsRepository`: `listCards(): Promise<Card[]>` y `listMovements(cardId, { from?, to? }): Promise<Movement[]>`.

## Estructura de módulos
```
package.json · vite.config.ts · tsconfig.json · vitest.config.ts · .env.example · README.md
src/
  main.ts · App.vue
  domain/        card.ts · movement.ts · cards-repository.ts
  infrastructure/ mock-cards-repository.ts · fixtures.ts · repository-factory.ts
  composables/   useCardsQuery.ts · useMoneyFormat.ts
  components/
    atoms/       MaskedPan.vue · StatusBadge.vue · MoneyText.vue · BaseButton.vue
    molecules/   CardSummaryItem.vue · MovementRow.vue · DateRangeFilter.vue
    organisms/   CardList.vue · CardDetailPanel.vue · MovementsTable.vue
    templates/   ConsultaLayout.vue
  pages/         TarjetasConsultaPage.vue
tests/
  unit/          atoms, molecules, composables, mock repository
  component/     organisms y página (cuatro estados)
  e2e/           consulta.spec.ts (Playwright, no ejecutado)
```

## Pruebas: alcance de "Estándar completo"
- **Unit (Vitest):** formateo de montos, enmascarado y filtros del composable.
- **Componente (@vue/test-utils):** render de cada organismo; los estados `loading`, `empty`, `error` y `ready` de la página; selección de tarjeta y carga de movimientos.
- **Accesibilidad básica:** roles y etiquetas (`table`, `aria-live`, `aria-label` en botones).
- **E2E:** archivo presente como plantilla. Su ejecución queda pendiente de CI.

## Hipótesis
- H1: "Estándar completo" significa unit + componente + a11y básica + e2e plantilla. No está confirmado.
- H2: la app host integra este módulo como página o vista. No se define si es micro-frontend.
- H3: el locale por defecto es `es` y la moneda viene en los datos. El país no está confirmado.
- H4: las versiones de dependencias son las últimas estables (`^`), sin lockfile verificado.
- H5: los fixtures son ficticios, con `last4` y montos inventados.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sin SGC, la UI puede no alinearse al sistema de diseño corporativo | Los átomos aíslan los estilos y facilitan sustituirlos por el sistema de diseño real. |
| El contrato real de integración puede diferir del puerto | El puerto es mínimo y el adaptador HTTP se implementa después del contrato. |
| Datos sensibles (PCI) | Solo se usa `last4`, sin almacenamiento local y sin logs de datos. |
| Sin compilación local, los errores de tipos no se detectan | `vue-tsc` y las pruebas se ejecutan en CI. La entrega queda en estado candidate. |
| Dependencias sin fijar | Generar el lockfile en CI. |

## Aceptación complementaria
Los criterios del diseño base se mantienen. Se añaden estos, observables por el tester:
- Cada nivel atómico (`atoms`, `molecules`, `organisms`, `templates`, `pages`) tiene al menos un componente.
- Ningún archivo contiene secuencias de 13 a 19 dígitos ni secretos. `.env.example` solo trae claves sin valores sensibles.
- Hay pruebas para `useCardsQuery` y para los cuatro estados de la página.
- El README incluye las secciones Build/Ejecución, Integración (sin definir) y Persistencia (sin definir).
- El resumen final (T06) declara qué se verificó (sintaxis) y qué no (build, tests, e2e).
