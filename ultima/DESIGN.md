# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Frontend
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Microapp React/TypeScript para "Consulta" sobre Tarjetas en Banca por Internet, capa Frontend.
- Datos ficticios en memoria; sin red, BD ni dependencias nuevas.
- Pantalla principal con el botón "Probar capacidad" visible al cargar; al pulsarlo muestra "Capacidad simulada" en un elemento role=status.
- Accesible (etiquetas, foco, contraste) y responsive.

## Hipótesis
- Stack (React + TypeScript), patrón (Component-based (Atomic Design)), integración (sin definir) y persistencia (sin definir) se documentan; React/TypeScript se valida con build y navegador.

## Aceptación
- tsc y build correctos, interacción real en navegador y smoke HTTP 200 del preview.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento: Consulta de Tarjetas (Banca por Internet)

> Complementa el diseño base y no modifica sus criterios de aceptación: `tsc` y build correctos, interacción real en navegador y smoke HTTP 200 del preview.

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Separar la UI en `atoms/molecules/organisms`; `App.tsx` actúa como *template/page* | Aplica el patrón Atomic Design elegido y permite reutilizar componentes. |
| D2 | Poner la lógica de dominio en funciones puras (`domain/`), sin JSX | Se puede probar con pruebas unitarias sin DOM. |
| D3 | Usar datos ficticios en un módulo `data/` de solo lectura | La persistencia y la integración están sin definir. Sin red ni `localStorage`. |
| D4 | Mostrar el PAN siempre enmascarado (`•••• 1234`) | Buena práctica PCI aunque los datos sean ficticios. |
| D5 | Usar `useState` local, sin librería de estado | Alcance pequeño. No se agregan dependencias nuevas. |
| D6 | Mostrar el feedback en `<p role="status">` y usar `<button>` nativo | Cubre el criterio "Capacidad simulada" y da accesibilidad sin ARIA extra. |
| D7 | Formatear moneda y fechas con `Intl` | API nativa del navegador. El locale y la moneda vienen en los datos mock. |

## Estructura de módulos (React + TS)
```
src/
  App.tsx              # template: header, lista, detalle, botón de prueba
  styles.css           # tokens (color/espaciado), foco visible, responsive
  data/mockCards.ts    # tarjetas ficticias (id, alias, last4, tipo, límite, disponible, corte, moneda)
  domain/cards.ts      # maskPan, formatAmount, usagePercent
  components/
    atoms/             # Button, Badge, Amount
    molecules/         # CardSummary
    organisms/         # CardList, CardDetail, CapabilityProbe
```
Si el builder debe limitarse a `App.tsx` y `styles.css`, puede declarar los componentes dentro de `App.tsx` con la misma jerarquía y documentarlo en el README.

## Interacción
1. Al cargar se ven la lista de tarjetas y el botón "Probar capacidad".
2. Al seleccionar una tarjeta se muestra su detalle (disponible, límite, fecha de corte).
3. Al pulsar "Probar capacidad", el `role=status` muestra "Capacidad simulada".

## Hipótesis
- **H1:** el SGC está en *fallback*. No hay reglas corporativas de UI ni de seguridad confirmadas. Se aplican buenas prácticas genéricas.
- **H2:** "Consulta" significa solo lectura: listar tarjetas y ver su detalle. No incluye bloqueos, pagos ni movimientos transaccionales.
- **H3:** el locale y la moneda son configurables en los mock. El valor concreto no está confirmado.
- **H4:** las tarjetas mock usan números no válidos. Solo se exponen los últimos 4 dígitos.
- **H5:** puede no existir un runner de pruebas instalado y no se agregan dependencias. En ese caso, las unitarias se documentan como plan en `TODOS.json` sobre `domain/`.
- **H6:** la integración futura sería un API de tarjetas. No hay contrato definido.

## Plan de pruebas unitarias (T05)
- **U1:** `maskPan('4111')` devuelve `•••• 4111`.
- **U2:** `formatAmount` respeta la moneda del mock.
- **U3:** `usagePercent` maneja límite 0 sin `NaN`.
- **U4** (si hay runner con DOM): el clic en el botón muestra "Capacidad simulada" en `role=status`.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Se confunden los mock con datos reales | Etiqueta visible "Datos ficticios" y aviso en el README. |
| Sin runner de pruebas instalado | Aplicar H5 y reportarlo en `handoff-result.json`. |
| Restricciones SGC no aplicadas (fallback) | Registrarlo como pendiente en el handoff. |
| Contraste o foco insuficientes | Tokens con contraste AA y `:focus-visible` explícito. |
| Se interpreta como listo para producción | El handoff se marca como *candidate*. |

## Trazabilidad
| Tarea | Elementos de diseño |
|---|---|
| T01 | H1 |
| T02 | Estructura de módulos y D1 |
| T03 | D6 |
| T04 | D5 y D2 |
| T05 | U1–U4 |
| T06 | D1–D7 y H6 |
| T07 | Riesgo de "producción" |
