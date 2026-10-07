# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Frontend
- Patrones disponibles Micro-frontends
- ¿Qué stack? React + TypeScript
- ¿Qué integración? Ninguna
- ¿Persistencia? No requiere
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Microapp React/TypeScript para "Consulta" sobre Cuentas en Banca por Internet, capa Frontend.
- Datos ficticios en memoria; sin red, BD ni dependencias nuevas.
- Pantalla principal con el botón "Probar capacidad" visible al cargar; al pulsarlo muestra "Capacidad simulada" en un elemento role=status.
- Accesible (etiquetas, foco, contraste) y responsive.

## Hipótesis
- Stack (React + TypeScript), patrón (Micro-frontends), integración (Ninguna) y persistencia (No requiere) se documentan; React/TypeScript se valida con build y navegador.

## Aceptación
- tsc y build correctos, interacción real en navegador y smoke HTTP 200 del preview.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento: Consulta de Cuentas (Banca por Internet)

> Complementa el diseño base. Mantiene sus criterios de aceptación: botón **"Probar capacidad"** visible al cargar, texto **"Capacidad simulada"** en `role="status"`, tsc/build correctos y smoke HTTP 200.

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Microapp autocontenida, un solo punto de entrada (`App`), sin estado global | Encaja con Micro-frontends: el host podría montarla sin acoplarse. No se agrega Module Federation porque la base prohíbe dependencias nuevas. |
| D2 | Estilos con prefijo raíz `.mf-cuentas` y sin selectores globales | Evita que el CSS afecte al host. |
| D3 | Datos ficticios en un módulo tipado aparte (`mockData.ts`) | Aísla la fuente de datos para sustituirla luego por un contrato real, que hoy no existe (integración: Ninguna). |
| D4 | Lógica de presentación en funciones puras (`format.ts`): enmascarar número de cuenta y formatear saldo con `Intl.NumberFormat` | Se puede probar de forma unitaria sin DOM y sin dependencias nuevas. |
| D5 | Estado solo con `useState`: cuenta seleccionada y estado de la simulación | Consulta de solo lectura sin persistencia; no justifica un store. |
| D6 | Banner visible "Datos ficticios" | Evita que se confunda con información bancaria real. |

## Estructura de módulos
```
src/
  main.tsx              (existente, sin cambios)
  App.tsx               raíz: lista de cuentas, detalle, botón y status   [T02/T03]
  styles.css            estilos con prefijo .mf-cuentas, responsive, foco visible [T02]
  cuentas/
    types.ts            Cuenta { id, tipo, numero, moneda, saldo }
    mockData.ts         3–4 cuentas ficticias en memoria
    format.ts           maskAccount(), formatBalance()
```
Si el builder prefiere el cambio mínimo, también es válido dejar todo en `App.tsx`. Lo obligatorio es modificar `App.tsx` y `styles.css`.

## Interacción y accesibilidad
- Lista de cuentas como `<ul>` con botones seleccionables (`aria-pressed`). El detalle va en una `<section>` con encabezado.
- Los números de cuenta solo se muestran enmascarados (`•••• 1234`).
- El botón "Probar capacidad" está fuera de cualquier condicional para que sea visible al cargar. El `role="status"` existe desde el inicio vacío y recibe el texto al pulsar.
- Foco visible, contraste AA, layout de una columna por debajo de 640 px.

## Plan de pruebas unitarias (T05, se documenta en TODOS.json)
1. `maskAccount` conserva solo los últimos 4 dígitos.
2. `formatBalance` respeta la moneda y los decimales.
3. `mockData` tiene ids únicos y saldos numéricos.
4. Interacción botón → status: se ejecuta solo si el proyecto ya incluye un runner. Si no, queda documentada y se cubre con la validación en navegador.

## Hipótesis
- H1: el host de Micro-frontends y su mecanismo de montaje están fuera de alcance. Solo se garantiza el aislamiento (D1, D2).
- H2: no se sabe si la plantilla trae Vitest o Testing Library. No se agregan.
- H3: las monedas ficticias (p. ej. PEN/USD) y el locale `es` son supuestos, no requisitos.
- H4: SGC está en fallback, así que no se aplican lineamientos institucionales de UI ni de seguridad. Deben revisarse cuando SGC esté disponible.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Texto o rol del criterio de aceptación alterado | Usar los literales exactos y verificarlos en navegador (T03). |
| Fuga de CSS al host | Prefijo `.mf-cuentas` y sin reset global. |
| Pruebas unitarias no ejecutables | Funciones puras más el plan en TODOS.json, declarando la limitación en el handoff. |
| Datos percibidos como reales | Banner fijo y números enmascarados. |
| Presentar el resultado como apto para producción | El handoff se cierra como **candidate** (T07). |
