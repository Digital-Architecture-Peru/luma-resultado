# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Frontend
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Vue 3 + TypeScript
- ¿Qué integración? Ninguna
- ¿Persistencia? No requiere
- ¿Qué pruebas? Estándar completo

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Vue 3 + TypeScript (capa Frontend) para "Consulta" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración Ninguna y persistencia No requiere detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Vue 3 + TypeScript sin compilarlo ni ejecutarlo en este host: solo se verifica sintaxis donde hay validador local; el resto queda sin verificar.
- Integración (Ninguna), persistencia (No requiere) y pruebas (Estándar completo) se implementan como candidate y requieren build real en CI.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento: Consulta de Tarjetas (Vue 3 + TypeScript)

## Decisiones de arquitectura

| # | Decisión | Justificación |
|---|---|---|
| D1 | Vite + SFC `<script setup lang="ts">`, `vue-tsc` para tipado | Es la plantilla oficial de Vue 3 y permite chequeo estático en CI. |
| D2 | Capas Atomic Design: atoms → molecules → organisms → templates → pages | Es el patrón pedido. Los atoms son solo presentacionales y la lógica de dominio queda fuera de los componentes. |
| D3 | Sin `vue-router` ni Pinia | Hay una sola vista con selección local, así que no se necesitan. Además evita chocar con el router del host de Banca por Internet. |
| D4 | Puerto `CardsRepository` con implementación `InMemoryCardsRepository` y fixtures | La integración es Ninguna, pero la fuente de datos queda reemplazable sin tocar la UI. |
| D5 | Composable `useCards()` con estados `idle/loading/success/empty/error` | Centraliza el flujo de consulta y se puede probar sin montar componentes. |
| D6 | El dominio solo guarda `last4`; nunca hay PAN completo | Minimiza la exposición de datos sensibles. Todos los datos son ficticios. |
| D7 | Formato con `Intl.NumberFormat`/`DateTimeFormat`; locale y moneda vía `VITE_*` | Evita dependencias extra. Sin secretos. |
| D8 | Estilos con CSS scoped y tokens en custom properties, sin librería de UI | El design system del host es desconocido y los tokens son fáciles de remapear. |
| D9 | Vitest + `@vue/test-utils` + jsdom | Integración nativa con Vite. Es la única dependencia de pruebas. |

## Estructura de módulos
```
cards-consulta/
  package.json · tsconfig.json · vite.config.ts · index.html · .env.example · README.md
  src/
    main.ts · App.vue
    domain/      card.ts (tipos) · cardFormat.ts (maskCard, formatMoney, utilization)
    data/        CardsRepository.ts · inMemoryCardsRepository.ts · fixtures/cards.ts
    composables/ useCards.ts
    components/
      atoms/     BaseBadge · MoneyAmount · MaskedCardNumber · ProgressBar
      molecules/ CardSummaryItem · BalanceRow · StatusMessage
      organisms/ CardList · CardDetailPanel
      templates/ ConsultaLayout
    pages/       CardsConsultaPage.vue
  tests/unit/    domain/ · data/ · composables/ · components/{atoms,molecules,organisms}/ · pages/
```

## Hipótesis
- **H1.** La consulta muestra un listado de tarjetas (crédito/débito, estado, número enmascarado) y el detalle de la tarjeta seleccionada: línea, disponible, saldo, fecha de corte y fecha de pago. Pendiente de confirmar con negocio.
- **H2.** Locale `es-PE` y moneda `PEN` por defecto. Ambos son configurables.
- **H3.** El módulo se embebe en el host como vista autónoma. El mecanismo concreto (micro-frontend o librería) no está definido.
- **H4.** "Estándar completo" significa pruebas unitarias de dominio, repositorio y composable, más pruebas de componentes por cada capa atómica. E2E queda fuera.
- **H5.** El validador local puede no soportar `.vue`. Esos archivos quedarían sin verificar.
- **H6.** Las versiones de dependencias son candidatas y no fueron resueltas contra un registry.

## Riesgos y mitigación

| Riesgo | Mitigación |
|---|---|
| Exposición de PAN o datos reales | D6, fixtures ficticios y un test que confirma que solo se renderizan 4 dígitos. |
| No compila: nada se ejecuta en este host | Estado *candidate*. Build, `vue-tsc` y `vitest` deben correr en CI. |
| Estilos inconsistentes con el host | Tokens CSS (D8) y validación posterior con UX. |
| Accesibilidad insuficiente | HTML semántico (`button`, `aria-live` en StatusMessage) y aserciones de roles en los tests. |
| Alcance funcional mal interpretado (H1) | Fixtures y tipos aislados en `domain/` y `data/` para ajustarlos rápido. |

## Aceptación (complementa la base, no la reemplaza)
- `maskCard` nunca devuelve más de 4 dígitos visibles.
- `useCards` expone los estados `loading`, `success`, `empty` y `error`, cada uno cubierto por un test.
- Existe al menos un test por capa atómica.
- El README documenta `npm install`, `npm run dev`, `npm test`, las variables de `.env.example`, la integración (Ninguna) y la persistencia (No requiere).
