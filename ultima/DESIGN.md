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

> Complementa el diseño base y no reemplaza sus Hechos ni su Aceptación. El SGC está en **fallback**, así que no se aplicaron estándares corporativos.

## Decisiones de arquitectura
| ID | Decisión | Justificación |
|---|---|---|
| D1 | Vite + SFC `<script setup lang="ts">` | Es la estructura idiomática de Vue 3 y ofrece tipado nativo con TS. |
| D2 | Atomic Design estricto: los átomos y moléculas son presentacionales (solo props y emits). Solo `pages` accede a datos. | Aplica el patrón pedido y permite probar los componentes sin mocks de red. |
| D3 | Puerto `CardQueryPort` con un adaptador `mockCardAdapter` por defecto | La integración está sin definir. El puerto aísla el contrato futuro y evita llamadas reales. |
| D4 | Estado mediante el composable `useCards` (sin Pinia) | Una sola consulta de lectura no justifica una dependencia extra. |
| D5 | Capacidad de solo lectura (listado + detalle) | El tipo de capacidad es "Consulta". Bloqueos, pagos y otras acciones quedan fuera de alcance. |
| D6 | El dominio expone solo `last4`. No hay PAN completo ni CVV en tipos ni en mocks. | Reduce la exposición de datos sensibles desde el diseño. |
| D7 | Moneda y locale configurables vía `import.meta.env` | El país y la moneda no están confirmados. |
| D8 | Vitest + @vue/test-utils + jsdom | Es el runner nativo del ecosistema Vite y cubre las pruebas unitarias pedidas. |
| D9 | Estados UI explícitos: `loading`, `empty`, `error` y `success`, con `aria-live` | La consulta debe ser observable y accesible. |

## Estructura de módulos
```
package.json · vite.config.ts · tsconfig.json · .env.example · README.md
src/
  main.ts · App.vue
  domain/card.ts                 # tipos: CardSummary, CardDetail, CardStatus
  services/CardQueryPort.ts      # interfaz: listCards(), getCard(id)
  services/mockCardAdapter.ts    # datos ficticios
  services/index.ts              # selecciona el adaptador según VITE_CARDS_ADAPTER
  composables/useCards.ts        # estado + carga + manejo de error
  utils/format.ts                # maskPan(last4), formatMoney()
  components/
    atoms/      MaskedPan · MoneyAmount · StatusBadge
    molecules/  CardSummaryItem · BalanceRow
    organisms/  CardList · CardDetailPanel
    templates/  CardsLayout
  pages/        CardsQueryPage.vue
tests/unit/     format · useCards (port falso) · atoms · molecules · CardList
```

## Riesgos
| Riesgo | Impacto | Mitigación |
|---|---|---|
| No se compila ni se ejecuta en este host | Pueden quedar errores de tipos o de build sin detectar | Se valida la sintaxis donde haya validador local. El build y los tests corren en CI. |
| Sin lockfile ni versiones resueltas | Builds no reproducibles | Se fijan rangos mayores en `package.json`. El lock se genera en CI. |
| Contrato de integración desconocido | Retrabajo del adaptador | Los cambios quedan confinados a `services/` gracias al puerto (D3). |
| Exposición de datos de tarjeta | Incumplimiento regulatorio | Se aplica D6, sin logs de datos y sin secretos en `.env.example`. |
| Design system corporativo desconocido (SGC en fallback) | Inconsistencia visual | Estilos mínimos y con scope, fáciles de sustituir. |

## Hipótesis
- **H1:** el usuario ya está autenticado por el shell de Banca por Internet. Auth y sesión quedan fuera de alcance.
- **H2:** los campos de la consulta son tipo, marca, `last4`, estado, línea, disponible, saldo, fecha de corte y fecha de pago.
- **H3:** no se incluyen movimientos en esta iteración.
- **H4:** el locale y la moneda por defecto son placeholders configurables (D7).
- **H5:** la persistencia es innecesaria en el cliente y queda sin definir. No se usa `localStorage`.
- **H6:** se usa Node LTS vigente en CI. El repositorio no lo confirma.
- **H7:** la app es standalone y no se asume integración como microfrontend.

## Aceptación (complementa la base, sin reemplazarla)
- `maskPan` nunca devuelve más de 4 dígitos visibles.
- `useCards` expone `error` cuando el puerto falla y `empty` cuando la lista está vacía.
- `CardList` renderiza un `CardSummaryItem` por cada tarjeta del mock.
- Ningún archivo contiene PAN completo, CVV ni secretos.
