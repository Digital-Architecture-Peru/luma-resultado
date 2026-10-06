# DESIGN

## Hechos (respuestas del guion)
- ¿Qué necesitas construir? frontend
- ¿Qué stack? react

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Microapp React/TypeScript para "sin definir" sobre sin definir en sin definir, capa frontend.
- Datos ficticios en memoria; sin red, BD ni dependencias nuevas.
- Pantalla principal con el botón "Probar capacidad" visible al cargar; al pulsarlo muestra "Capacidad simulada" en un elemento role=status.
- Accesible (etiquetas, foco, contraste) y responsive.

## Hipótesis
- Stack (react), patrón (sin definir), integración (sin definir) y persistencia (sin definir) se documentan; React/TypeScript se valida con build y navegador.

## Aceptación
- tsc y build correctos, interacción real en navegador y smoke HTTP 200 del preview.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento

> Complementa el diseño base y no cambia sus criterios de aceptación. Los dominios marcados como "sin definir" se tratan como **hipótesis**.

## Decisiones de arquitectura

| ID | Decisión | Justificación |
|---|---|---|
| AD1 | Usar el scaffold existente de React + TypeScript + Vite, sin dependencias nuevas | La aceptación exige `tsc` y `vite build`. Añadir librerías no aporta valor a una sola interacción y aumenta el riesgo de que el build falle. |
| AD2 | Gestionar el estado con `useState` dentro de `App`, sin store global ni router | Solo existe un flujo (botón → estado). Redux, Context o un router serían sobreingeniería. |
| AD3 | Mantener los datos ficticios en un módulo constante y usar una función pura `simulateCapability()` | No hay red ni BD. La función es determinista, fácil de razonar y de sustituir más adelante por una integración real. |
| AD4 | Montar el contenedor `role="status"` (con `aria-live="polite"`) **siempre**, vacío al inicio, y rellenarlo al pulsar | Si la región viva se monta en el mismo render que su contenido, algunos lectores de pantalla no anuncian el cambio. |
| AD5 | Usar `<button type="button">` nativo con `:focus-visible` explícito | El botón nativo ya ofrece teclado, foco y rol. Evitar `div` clicables. |
| AD6 | Definir los textos "Probar capacidad" y "Capacidad simulada" como constantes exportadas | La aceptación valida las cadenas exactas. Una única fuente evita divergencias entre la UI, las pruebas y la documentación. |
| AD7 | Escribir CSS plano en `src/styles.css`, *mobile-first*, con custom properties de color y contraste AA (≥ 4.5:1) | Cumple "responsive y accesible" sin depender de una librería de UI. |
| AD8 | Hacer la interacción idempotente: pulsar varias veces mantiene "Capacidad simulada" | El resultado es predecible para la validación en navegador. |

## Estructura de módulos

```
src/
├─ main.tsx              # punto de entrada (existente, sin cambios salvo import de styles.css si falta)
├─ App.tsx               # T02/T03: layout, botón, región role=status, useState
├─ styles.css            # T02: tokens, layout responsive, foco visible, contraste
└─ data/
   └─ capability.ts      # datos ficticios + constantes de texto + simulateCapability()
```

- `App.tsx` solo importa de `data/capability.ts`. No hay dependencias cruzadas adicionales.
- Si el builder prefiere no crear `data/`, el contenido puede vivir en `App.tsx`. Las tareas T02 y T03 se cumplen igualmente.

## Hipótesis explícitas

- **H1:** Ya existe un scaffold Vite + React + TS con scripts `build` (tsc + vite build) y `preview`.
- **H2:** La capacidad, el patrón, la integración y la persistencia siguen **sin definir**. Por eso la UI es genérica: título neutro, descripción breve y el botón. Las etiquetas de dominio se centralizan en `capability.ts` para reemplazarlas sin tocar la lógica.
- **H3:** La integración es nula, simulada en memoria. La persistencia también: el estado se pierde al recargar y eso es aceptable.
- **H4:** El SGC está en *fallback*. No se han verificado restricciones organizativas (marca, librerías aprobadas, normas de accesibilidad internas). Aplican WCAG 2.1 AA como referencia por defecto.
- **H5:** El idioma de la UI es español y `lang="es"` se declara en `index.html`.
- **H6:** El plan de pruebas (T05) es manual o basado en evidencias: build, smoke HTTP 200 del preview e interacción en navegador. No se añade un framework de test para no introducir dependencias.

## Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El dominio está sin definir y la UI no representa la capacidad real | Medio | Documentar H2 en el README (T06). Las etiquetas son parametrizables. |
| La región `role=status` se monta de forma condicional y el cambio no se anuncia | Medio | Aplicar AD4 y verificar que el nodo existe en el DOM antes del clic. |
| Una diferencia de texto (mayúsculas, espacios, tildes) hace fallar la validación | Alto | Usar las constantes de AD6 y copiar las cadenas del criterio de aceptación literalmente. |
| `tsc` en modo estricto falla por tipos implícitos | Medio | Tipar explícitamente el estado (`string \| null`) y los handlers. |
| El preview no devuelve 200 por `base` o puerto | Medio | No modificar `base` de Vite. El smoke se ejecuta contra la URL que imprime `vite preview`. |
| El handoff se presenta como apto para producción | Alto | T07 declara el estado `candidate` y deja explícito que los datos son ficticios y no hay integración real. |

## Trazabilidad con las tareas

- **T01:** recoger H1–H6 y el estado *fallback* del SGC en el resumen final.
- **T02 y T03:** AD2 a AD8 en `App.tsx`, `styles.css` y `capability.ts`.
- **T04:** AD1.
- **T05:** H6 y los riesgos de la tabla como checklist en `TODOS.json` y `handoff-result.json`.
- **T06:** documentar capa frontend, patrón, stack react, integración y persistencia, con H2 y H3 en el README.
- **T07:** cierre como `candidate`.
