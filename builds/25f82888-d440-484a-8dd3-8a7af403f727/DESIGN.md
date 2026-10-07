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

> Complementa el diseño base y respeta sus criterios de aceptación: botón "Probar capacidad" visible al cargar, texto "Capacidad simulada" en `role=status`, tsc y build correctos, y preview con HTTP 200.

## Decisiones de arquitectura (ADR breves)
| # | Decisión | Justificación |
|---|---|---|
| D1 | Atomic Design en `src/components/{atoms,molecules,organisms,templates}` y `src/pages` | Es el patrón elegido. Permite reutilizar las piezas visuales y probarlas de forma aislada. |
| D2 | `App.tsx` solo compone `ConsultaTarjetasPage` | Cumple T02 sin mezclar lógica en el punto de entrada. |
| D3 | Contrato `TarjetasRepository` (`listar()` y `obtener(id)`) con implementación `InMemoryTarjetasRepository` | La integración no está definida. El adaptador permite cambiar la fuente después sin tocar la UI. |
| D4 | Estado local con `useState` (tarjeta seleccionada y mensaje de estado), sin router ni librería de estado | Es una sola vista de solo lectura. Se evita añadir dependencias. |
| D5 | Un único `styles.css` con variables CSS y clases por capa (`a-`, `m-`, `o-`) | Lo exige T02 y no requiere tooling adicional. |
| D6 | Formato con `Intl.NumberFormat` y `Intl.DateTimeFormat` | Es nativo, no añade dependencias y facilita cambiar el locale. |
| D7 | PAN siempre enmascarado (`•••• 4821`), sin campo de PAN completo en el modelo | Aplica el principio de mínimo dato (estilo PCI), aunque los datos sean ficticios. |
| D8 | El contenedor `role="status"` se renderiza vacío desde la carga | Los lectores de pantalla anuncian los cambios solo si la región viva ya existe en el DOM. |

## Estructura de módulos
```
src/
  App.tsx                      # compone la página
  styles.css                   # tokens + estilos por capa
  domain/tarjeta.ts            # tipos Tarjeta, EstadoTarjeta
  data/tarjetas.mock.ts        # 3 tarjetas ficticias
  services/tarjetasRepository.ts  # contrato + InMemory
  lib/format.ts                # moneda, fecha, enmascarado
  components/
    atoms/      Button, Badge, Amount, MaskedPan
    molecules/  CardSummary, DetailRow
    organisms/  CardList, CardDetail, StatusRegion
    templates/  ConsultaLayout
  pages/ConsultaTarjetasPage.tsx  # estado + botón "Probar capacidad"
```

Modelo `Tarjeta`: `id`, `alias`, `marca`, `ultimos4`, `tipo` (crédito/débito), `estado`, `limite?`, `disponible`, `deudaActual?`, `fechaCorte?`, `fechaPago?`.

## Hipótesis explícitas
- **H1.** El SGC está en fallback, así que no hay restricciones corporativas verificadas (design system, tokens, políticas). Se usan tokens propios y neutros.
- **H2.** "Consulta" es solo lectura. Quedan fuera bloquear la tarjeta, pagar o ver movimientos detallados.
- **H3.** Locale `es-PE` y moneda PEN, inferidos de la zona horaria -05:00. Son configurables en `format.ts`.
- **H4.** Usuario ya autenticado y simulado; no hay login.
- **H5.** Si Vitest o Testing Library no están instalados, no se añaden. El plan de pruebas unitarias se documenta en `TODOS.json` (T05) y se ejecutan las pruebas que la base permita.
- **H6.** Integración y persistencia siguen sin definir. D3 deja el punto de extensión preparado.

## Riesgos y mitigación
| Riesgo | Mitigación |
|---|---|
| Confundir los datos ficticios con datos reales | Etiqueta visible "Datos de demostración" y valores claramente ficticios |
| Exponer números de tarjeta | Solo se guardan los `ultimos4` (D7) |
| Que la región viva no anuncie el mensaje | Aplicar D8 y verificarlo en el navegador (T03) |
| Sobreingeniería de Atomic Design para una sola vista | Componentes mínimos; no crear átomos sin uso |
| Falta de runner de pruebas | Aplicar H5 y reportarlo como limitación en el handoff |
| Accesibilidad | Lista navegable con teclado (`button` y `aria-pressed`), foco visible, contraste AA y montos con texto legible |

## Plan de pruebas unitarias (T05)
- `format.ts`: moneda, fecha y enmascarado con casos borde (`limite` undefined).
- `InMemoryTarjetasRepository`: `listar()` devuelve 3 tarjetas; `obtener(id)` con un id inexistente devuelve `undefined`.
- Página: el botón "Probar capacidad" existe al cargar. Al hacer clic, `role=status` contiene "Capacidad simulada".
- Selección: al elegir una tarjeta se actualiza el detalle.

## Trazabilidad
| Tarea | Cubierta por |
|---|---|
| T01 | Hechos y H1 |
| T02 | D1, D2 y D5 |
| T03 | D8 y la página |
| T04 | D4 y D6 (sin dependencias nuevas) |
| T05 | Plan de pruebas y H5 |
| T06 | Decisiones D1–D7 y H6 |
| T07 | Estado *candidate*; no se afirma que esté listo para producción |
