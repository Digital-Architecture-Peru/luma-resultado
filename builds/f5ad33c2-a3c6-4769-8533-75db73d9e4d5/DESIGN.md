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

> Complementa el diseño base. No sustituye sus Hechos ni su Aceptación.

## Decisiones de arquitectura

| ID | Decisión | Justificación |
|---|---|---|
| AD-01 | Vite + Vue 3 SFC con `<script setup lang="ts">` y `strict: true` | Es la estructura idiomática de Vue 3 y aporta tipado estricto sin configuración extra. |
| AD-02 | Atomic Design en `components/` (atoms → molecules → organisms → templates) y vistas en `pages/` | Aplica el patrón pedido. Regla: un nivel solo importa niveles inferiores. |
| AD-03 | Puerto `CardsGateway` con dos adaptadores: `MockCardsGateway` (datos ficticios, activo por defecto) y `HttpCardsGateway` (stub que no se invoca) | La integración está sin definir, así que se aísla detrás de una interfaz. |
| AD-04 | Selección del adaptador con `VITE_CARDS_ADAPTER=mock\|http` y `VITE_API_BASE_URL` | Se configura por entorno, sin secretos. Solo se usan variables públicas `VITE_*`. |
| AD-05 | Estado mediante composables (`useCards`, `useCardDetail`) en lugar de Pinia | Es una consulta de solo lectura con alcance acotado, y así se evita una dependencia sin motivo. |
| AD-06 | `vue-router` con las rutas `/tarjetas` y `/tarjetas/:id` | Navegación entre listado y detalle. Es la única dependencia de runtime adicional. |
| AD-07 | Sin persistencia en el cliente: no se usa `localStorage` ni `sessionStorage` para datos de tarjeta | La persistencia está sin definir y los datos de tarjeta son sensibles. |
| AD-08 | El PAN se muestra siempre enmascarado (`•••• 1234`) y el formato de montos usa `Intl.NumberFormat` | Seguridad de datos de tarjeta y formato monetario correcto. |
| AD-09 | Pruebas con Vitest + `@vue/test-utils` + jsdom | Es el runner nativo del ecosistema Vite. |

## Estructura de módulos

```
src/
  domain/        card.ts (tipos Card, CardSummary, Movement), mask.ts, money.ts
  services/      CardsGateway.ts, MockCardsGateway.ts, HttpCardsGateway.ts, gatewayFactory.ts
  mocks/         cards.fixture.ts (datos ficticios)
  composables/   useCards.ts, useCardDetail.ts
  components/
    atoms/       BaseBadge, MoneyAmount, MaskedPan, BaseSpinner
    molecules/   CardSummaryItem, BalanceRow, MovementItem
    organisms/   CardList, CardDetailPanel, MovementList, ErrorState
    templates/   ConsultaLayout
  pages/         CardsListPage.vue, CardDetailPage.vue
  router/        index.ts
tests/unit/ · tests/components/ · tests/integration/
package.json · vite.config.ts · tsconfig.json · .env.example · README.md
```

## Pruebas ("Estándar completo", interpretación)
- **Unitarias:** enmascarado, formato de montos y la factory del gateway.
- **Componentes:** atoms, molecules y organisms con estados de carga, vacío y error.
- **Integración:** página completa con `MockCardsGateway` y router en memoria.
- **Accesibilidad básica:** roles y etiquetas en listas y estados de error.
- **Fuera de alcance:** E2E con navegador real (ver hipótesis H-04).

## Hipótesis
- **H-01:** La "Consulta" comprende listado de tarjetas, detalle (límite, disponible, saldo, fecha de corte, pago mínimo) y últimos movimientos. Ningún dato del guion lo confirma.
- **H-02:** Moneda y locale por defecto son `es` y una moneda configurable. No se confirmó país.
- **H-03:** La autenticación la provee el shell de Banca por Internet. No se implementa login.
- **H-04:** "Estándar completo" no exige E2E en este host.
- **H-05:** Las versiones de dependencias se fijan con rangos `^` y no se resuelven aquí, porque no se ejecuta `npm install`.
- **H-06:** La verificación de sintaxis cubre `.ts` y `.json`. Los `.vue` pueden quedar sin verificar si no hay un validador local de SFC.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| SGC en modo fallback, sin estándares corporativos | Se marca como candidate y se revisa contra el SGC real antes de CI. |
| Contrato HTTP desconocido | El stub tipado queda aislado. El contrato real requiere AD posterior. |
| Exposición de PAN u otros datos sensibles | AD-07 y AD-08, más pruebas que verifican el enmascarado. |
| Atomic Design violado (imports ascendentes) | Regla documentada en el README y revisión en PR. |
| Compilación y tests no ejecutados | El handoff declara el estado no verificado (T06). |

## Aceptación adicional
Estos criterios son compatibles con la aceptación base:
- `MaskedPan` nunca muestra más de 4 dígitos en ninguna prueba.
- Con `VITE_CARDS_ADAPTER=mock` no hay llamadas de red. El test de integración verifica que no se invoca `fetch`.
- El README documenta las variables de entorno, la regla de imports de Atomic Design y que la integración y la persistencia están sin definir.
