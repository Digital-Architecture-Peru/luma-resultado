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

# DESIGN · Refinamiento (Consulta de Tarjetas · Vue 3 + TS)

> Complementa el diseño base. Conserva sus Hechos y su Aceptación. Contexto SGC en **fallback**: ninguna convención corporativa está confirmada.

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Vite + Vue 3 (`<script setup lang="ts">`) | Toolchain idiomático de Vue 3, con tipado estricto |
| D2 | Atomic Design en `components/{atoms,molecules,organisms,templates}` + `pages/` | Es el patrón pedido; la capa es visible en la ruta |
| D3 | Puerto `CardsRepository` + `MockCardsRepository` | La integración está sin definir; la UI no depende del origen de los datos |
| D4 | Estado con el composable `useCards` (sin Pinia) | Una sola vista de consulta; se evita una dependencia sin motivo |
| D5 | Sin vue-router; se expone `CardsConsultaPage` | El enrutamiento corresponde a la app host (H2) |
| D6 | Solo PAN enmascarado (`last4`) en el modelo | El front nunca recibe ni muestra el PAN completo |
| D7 | Vitest + @vue/test-utils + jsdom | Pruebas unitarias nativas del ecosistema Vite |
| D8 | `VITE_CARDS_DATA_SOURCE=mock` en `.env.example` | Configuración por entorno; las `VITE_*` son públicas, así que no llevan secretos |

## Estructura de módulos
```
cards-consulta/
  package.json  vite.config.ts  tsconfig.json  .env.example  index.html  README.md
  src/
    main.ts  App.vue
    domain/      card.ts (tipos)  format.ts (moneda, máscara)
    services/    CardsRepository.ts  MockCardsRepository.ts  repositoryFactory.ts
    mocks/       cards.fixture.ts (ficticios)
    composables/ useCards.ts (loading/error/empty/data)
    components/
      atoms/     MoneyAmount.vue  MaskedCardNumber.vue  StatusBadge.vue
      molecules/ CardSummaryItem.vue  BalanceRow.vue
      organisms/ CardList.vue  CardDetailPanel.vue
      templates/ ConsultaLayout.vue
    pages/       CardsConsultaPage.vue
  tests/unit/    format.spec.ts  useCards.spec.ts  CardList.spec.ts  MaskedCardNumber.spec.ts
```

## Hipótesis (no confirmadas)
- **H1.** El alcance cubre el listado de tarjetas y el detalle (estado, límite, disponible). Los movimientos quedan fuera.
- **H2.** La app host de Banca por Internet aporta la autenticación, el enrutamiento y el layout global.
- **H3.** La moneda viene en cada registro y se formatea con `Intl.NumberFormat`. No se fija país ni locale de negocio.
- **H4.** El contrato del API real es desconocido. `HttpCardsRepository` no se implementa.
- **H5.** No hay design system corporativo. Se usan estilos locales accesibles (contraste AA, foco visible, roles ARIA).

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Exposición de datos sensibles | D6. Fixtures ficticios y ningún PAN completo |
| Secretos en variables `VITE_*` | Usar solo flags, documentado en el README |
| La build no se verifica en este host | Estado *candidate*; requiere `npm ci && npm run build && npm test` en CI |
| Divergencia con el API real (H4) | Puerto aislado; el cambio queda acotado a `services/` |
| Fallback SGC sin estándares corporativos | Revisar el diseño cuando SGC esté disponible |

## Aceptación (complementa la base, no la reemplaza)
- `useCards` expone los estados `loading`, `error`, `empty` y `data`, y las pruebas cubren al menos `data` y `error`.
- `MaskedCardNumber` muestra solo `•••• 1234`, y una prueba lo verifica.
- El README documenta la build y la ejecución, la integración (sin definir), la persistencia (sin definir: solo lectura, sin almacenamiento local de datos de tarjeta) y lo que no se verificó.
