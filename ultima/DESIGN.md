# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Frontend
- Patrones disponibles Feature-Sliced Design
- ¿Qué stack? React + TypeScript
- ¿Qué integración? Ninguna
- ¿Persistencia? No requiere
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Microapp React/TypeScript para "Consulta" sobre Tarjetas en Banca por Internet, capa Frontend.
- Datos ficticios en memoria; sin red, BD ni dependencias nuevas.
- Pantalla principal con el botón "Probar capacidad" visible al cargar; al pulsarlo muestra "Capacidad simulada" en un elemento role=status.
- Accesible (etiquetas, foco, contraste) y responsive.

## Hipótesis
- Stack (React + TypeScript), patrón (Feature-Sliced Design), integración (Ninguna) y persistencia (No requiere) se documentan; React/TypeScript se valida con build y navegador.

## Aceptación
- tsc y build correctos, interacción real en navegador y smoke HTTP 200 del preview.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento: Consulta de Tarjetas (Banca por Internet)

> Complementa el diseño base y respeta sus criterios de aceptación: botón "Probar capacidad" visible al cargar, texto "Capacidad simulada" en `role=status`, tsc/build correctos, interacción en navegador y smoke HTTP 200.

## Decisiones de arquitectura
| ID | Decisión | Justificación |
|---|---|---|
| AD-01 | FSD *lite*: `app`, `pages`, `features`, `entities`, `shared`; se omite `widgets` | Mantiene el patrón pedido con tamaño proporcional a la microapp |
| AD-02 | `src/App.tsx` actúa como capa `app` (composición) y `src/styles.css` contiene tokens y estilos globales | T02 exige modificar estos dos archivos |
| AD-03 | Imports relativos, sin alias `@/` | Evita tocar tsconfig/vite y reduce el riesgo de build |
| AD-04 | Cada slice expone una API pública en `index.ts` e importa solo de capas inferiores | Es la regla central de FSD y facilita la revisión |
| AD-05 | Datos ficticios en `entities/card/model/mock.ts` y estado local con `useState` | Integración y persistencia son "Ninguna"; no hace falta store |
| AD-06 | La lógica pura (enmascarar, formatear, seleccionar) vive en `shared/lib` y en `entities/*/model` | Facilita las pruebas unitarias sin DOM |
| AD-07 | Nunca se muestra el PAN completo; solo `•••• 1234` | Seguridad por diseño, aunque los datos sean ficticios |
| AD-08 | Sin dependencias nuevas | Restricción del diseño base |

## Estructura de módulos
```
src/
  main.tsx                      # existente; monta <App/>
  App.tsx                       # capa app: compone CardInquiryPage
  styles.css                    # tokens, foco visible, layout responsive
  pages/card-inquiry/
    ui/CardInquiryPage.tsx      # h1, lista, detalle, feature
    index.ts
  features/
    select-card/ui/CardSelector.tsx       # radiogroup/botones accesibles
    try-capability/
      model/useTryCapability.ts           # idle -> simulated
      ui/TryCapabilityButton.tsx          # "Probar capacidad" + role=status
      index.ts
  entities/card/
    model/types.ts  mock.ts  selectors.ts # Card, 3 tarjetas, getById
    ui/CardSummary.tsx                    # cupo, saldo, fecha de corte
    index.ts
  shared/lib/format.ts                    # maskPan, formatCurrency, formatDate
```

## Comportamiento y accesibilidad
- Al cargar se ve la lista con 3 tarjetas ficticias (débito, crédito y una bloqueada). La primera aparece seleccionada.
- El detalle muestra estado, cupo disponible, saldo y fecha de corte.
- El contenedor `role=status` existe vacío desde el inicio. Al pulsar el botón recibe "Capacidad simulada", para que el lector de pantalla lo anuncie.
- La app usa HTML semántico, `aria-pressed` o `aria-checked` en la selección, foco visible, contraste AA y layout de una columna en anchos menores a 640 px.

## Hipótesis
- H1: la plantilla usa Vite + React 18 + TS strict y `main.tsx` importa `App` por defecto.
- H2: locale `es-CO` y moneda COP. Se puede cambiar en `format.ts`.
- H3: puede que no haya runner de pruebas (Vitest) instalado. En ese caso, el plan de pruebas unitarias se documenta en TODOS.json (T05) sin añadir dependencias.
- H4: el contexto SGC está en fallback, así que no se asumen lineamientos corporativos de marca. Se usan tokens neutros.
- H5: el estado "bloqueada" es un dato ficticio y solo se muestra; no permite acciones.

## Plan de pruebas unitarias (T05)
- `maskPan('4111111111111234')` devuelve `•••• 1234` y nunca expone más de 4 dígitos.
- `formatCurrency` y `formatDate` dan una salida estable para el locale de H2.
- `getCardById` devuelve la tarjeta correcta o `undefined` si el id no existe.
- `useTryCapability` pasa de `idle` a `simulated` y expone el texto "Capacidad simulada".

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sobreestructurar FSD en una microapp | Aplicar AD-01 y no crear slices vacíos |
| Romper el build por alias o rutas | Aplicar AD-03 y ejecutar `tsc` antes de `vite build` |
| El status no se anuncia | Montar el contenedor vacío antes de pulsar |
| Exponer datos sensibles | Aplicar AD-07; no guardar el PAN completo en mocks |
| Diferencias de `Intl` entre entornos | Las pruebas comparan patrones, no strings exactos |
| Presentar el resultado como listo para producción | El handoff se cierra como **candidate** (T07) |
