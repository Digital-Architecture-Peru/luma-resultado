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

# DESIGN — Refinamiento: Consulta de Tarjetas (Banca por Internet · Vue 3 + TS)

> Complementa el diseño base y mantiene sus Hechos y su Aceptación. Contexto SGC en **fallback**: nada de este documento se sustenta en estándares corporativos confirmados.

## Decisiones de arquitectura

| # | Decisión | Justificación |
|---|---|---|
| D1 | Vite + Vue 3 SFC (`<script setup lang="ts">`), TS `strict` y `vue-tsc` | Es el toolchain idiomático de Vue 3. El tipado estricto detecta errores sin ejecutar la app. |
| D2 | Carpetas Atomic Design: `atoms → molecules → organisms → templates → pages` | Es el patrón pedido. Regla de dependencia: cada nivel solo importa niveles inferiores. |
| D3 | Sin Pinia ni vue-router. El estado vive en el composable `useCardQuery`. | Una consulta de una sola vista no justifica esas dependencias (anti-patrón: dependencias sin motivo). |
| D4 | Puerto `CardRepository` con adaptador `InMemoryCardRepository` (datos ficticios), inyectado vía `provide/inject` | Integración = Ninguna, pero se deja la costura para una API futura. Las pruebas usan el mismo puerto. |
| D5 | Solo lectura y sin almacenamiento: no se usa `localStorage`, `sessionStorage` ni cookies | Persistencia = No requiere. Además reduce la exposición de datos de tarjeta. |
| D6 | El PAN nunca se modela completo. El dominio solo tiene `last4`; la UI muestra `•••• 1234`. | Minimiza datos sensibles desde el tipo, no solo desde la vista. |
| D7 | Montos y fechas se formatean con `Intl` y locale/moneda tomados de `VITE_LOCALE` y `VITE_CURRENCY` | Así no se fija el país en el código. Se configura por entorno y sin secretos. |
| D8 | Cuatro estados explícitos: `loading`, `empty`, `error`, `success`, con `aria-live` | La UX es predecible y accesible. Cada estado es comprobable en las pruebas. |
| D9 | Pruebas con Vitest + @vue/test-utils + jsdom | Es el stack de pruebas nativo de Vite y no requiere navegador real. |

## Estructura de módulos

```
src/
  domain/        card.ts (Card, CardStatus, CardType), cardRepository.ts (puerto)
  infrastructure/ inMemoryCardRepository.ts, fixtures/cards.ts (ficticios)
  composables/   useCardQuery.ts, useFormatters.ts
  components/
    atoms/       BaseBadge, BaseAmount, MaskedPan, BaseSpinner
    molecules/   CardSummaryItem, BalanceRow, StatusMessage
    organisms/   CardList, CardDetailPanel
    templates/   QueryLayout
  pages/         CardsQueryPage.vue
  App.vue, main.ts, env.d.ts
tests/unit/ · tests/component/ · tests/integration/
package.json, vite.config.ts, tsconfig.json, .env.example, README.md
```

**Contrato de dominio** (hipótesis de campos):

```ts
Card {
  id, last4, brand, type: 'CREDITO'|'DEBITO', status: 'ACTIVA'|'BLOQUEADA'|'CANCELADA',
  holderName, creditLimit?, availableBalance, statementBalance?, dueDate?
}
```

## Riesgos

| Riesgo | Mitigación |
|---|---|
| No hay compilación ni ejecución en este host; las versiones de las dependencias no se verifican | Usar versiones con rango `^` documentadas y exigir `npm ci && vue-tsc && vitest` en CI. Resultado: **candidate**. |
| Se desconoce el design system o los tokens del banco | Estilos con variables CSS en un único archivo de tokens, reemplazable. |
| Se desconoce cómo se integra con el shell de Banca por Internet (micro-frontend, iframe o monolito) | La página es autocontenida y `main.ts` es el único punto de montaje. |
| Datos sensibles mostrados por error | Se cubre con D6 y una prueba que verifica que ningún render contenga más de 4 dígitos consecutivos del PAN. |
| La interpretación de "Estándar completo" no coincide con la esperada | Se explicita la hipótesis H3 y queda para validar con el solicitante. |

## Hipótesis (no confirmadas)

- **H1.** El alcance de "Consulta" es el listado de tarjetas del cliente más el detalle de saldo y estado. Movimientos, bloqueo y pagos quedan fuera.
- **H2.** La vista es una sola página dentro de una sesión ya autenticada por el shell. La autenticación queda fuera de alcance.
- **H3.** "Estándar completo" significa:
  - pruebas unitarias de formateadores y composable;
  - pruebas de componentes para átomos y organismos;
  - una prueba de integración de la página con el repositorio en memoria.

  E2E y umbral de cobertura quedan como recomendación para CI.
- **H4.** El locale por defecto es `es-PE` / `PEN`, sobrescribible por entorno. El país no está confirmado.
- **H5.** El objetivo de accesibilidad es WCAG 2.1 AA y no está validado con auditoría.

## Trazabilidad con los todos

- **T01:** Hechos, Contexto SGC (fallback) y H1–H5 citados en el resumen final.
- **T02:** Archivos de la estructura de módulos anterior.
- **T03:** Verificación sintáctica de `.ts`/`.json` con el validador local. Los `.vue` quedan **sin verificar** si no hay parser disponible.
- **T04:** Contenido de `tests/unit`, `tests/component` y `tests/integration`.
- **T05:** README con instalación, `dev`/`build`/`test`, variables de `.env.example`, una nota de "Integración: Ninguna (puerto D4)" y otra de "Persistencia: No requiere (D5)".
- **T06:** Resumen candidate que lista lo no verificado: build, ejecución de pruebas, compatibilidad de versiones y H1–H5.
