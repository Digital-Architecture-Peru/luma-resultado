# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Frontend
- Patrones disponibles Feature-Sliced Design
- ¿Qué stack? React + TypeScript
- ¿Qué integración? Ninguna
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Microapp React/TypeScript para "Consulta" sobre Cuentas en Banca por Internet, capa Frontend.
- Datos ficticios en memoria; sin red, BD ni dependencias nuevas.
- Pantalla principal con el botón "Probar capacidad" visible al cargar; al pulsarlo muestra "Capacidad simulada" en un elemento role=status.
- Accesible (etiquetas, foco, contraste) y responsive.

## Hipótesis
- Stack (React + TypeScript), patrón (Feature-Sliced Design), integración (Ninguna) y persistencia (PostgreSQL) se documentan; React/TypeScript se valida con build y navegador.

## Aceptación
- tsc y build correctos, interacción real en navegador y smoke HTTP 200 del preview.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento: Consulta de Cuentas (Banca por Internet)

> Este documento complementa el diseño base y no lo reemplaza. Se mantienen sin cambios sus criterios de aceptación: `tsc` y build correctos, interacción real en navegador y smoke HTTP 200 del preview. El botón «Probar capacidad» es visible al cargar y, al pulsarlo, muestra «Capacidad simulada» en un elemento `role=status`.

## Alcance funcional refinado
- Listado de cuentas ficticias con tipo, número enmascarado (solo los últimos 4 dígitos), moneda y saldo disponible.
- Filtro por tipo de cuenta (ahorros / corriente) y búsqueda por alias. Todo ocurre en el cliente.
- Panel de detalle de la cuenta seleccionada (solo lectura, porque la capacidad es de consulta).
- Interacción de aceptación: botón «Probar capacidad» y región `role=status`.
- Aviso visible: «Datos de demostración».

## Decisiones de arquitectura
| ID | Decisión | Justificación | Alternativa descartada |
|---|---|---|---|
| D1 | Aplicar Feature-Sliced Design con las capas `app`, `pages`, `widgets`, `features`, `entities` y `shared` | Es el patrón indicado en el guion y separa el dominio Cuentas de la UI genérica | Estructura plana por tipo de archivo (`components/`, `utils/`) |
| D2 | `src/App.tsx` funciona como capa `app`: compone la página. Los estilos globales y los tokens van en `src/styles.css` | Cumple T02 (los dos archivos se modifican) sin romper FSD | Mover toda la lógica fuera de `App.tsx` |
| D3 | Estado local con `useState` o `useReducer`, sin store global ni router | Hay una sola pantalla de consulta, solo lectura | Redux o Zustand: sería una dependencia nueva sin motivo |
| D4 | Datos en memoria detrás de una función `getAccounts()` en `entities/account/api` que devuelve datos de forma síncrona | Aísla la fuente de datos para que un backend futuro la reemplace sin tocar la UI | Llamadas `fetch` simuladas: el diseño base prohíbe el acceso a red |
| D5 | PostgreSQL solo se documenta, como persistencia de un backend futuro | Un frontend no se conecta a PostgreSQL. El guion pide integración «Ninguna» | Cualquier cliente de base de datos en el navegador |
| D6 | Lógica de dominio en funciones puras (`maskAccountNumber`, `formatBalance`, `filterAccounts`) | Permite pruebas unitarias sin DOM ni red | Lógica embebida en los componentes |
| D7 | Formato con `Intl.NumberFormat` | Es nativo, no requiere dependencias y respeta la moneda de cada cuenta | Librería de formateo de moneda |

## Estructura de módulos (React + TypeScript, FSD)
```
src/
  main.tsx                         # entrada existente, sin cambios
  App.tsx                          # capa app: compone <AccountInquiryPage/>
  styles.css                       # tokens, foco visible, layout responsive
  pages/account-inquiry/
    ui/AccountInquiryPage.tsx      # orquesta widget + feature
    index.ts
  widgets/accounts-overview/
    ui/AccountsOverview.tsx        # lista + detalle
    index.ts
  features/
    filter-accounts/               # filtro por tipo y búsqueda por alias
      model/filterAccounts.ts
      ui/AccountFilters.tsx
      index.ts
    simulate-capability/           # botón "Probar capacidad" + role=status
      ui/SimulateCapability.tsx
      index.ts
  entities/account/
    model/types.ts                 # Account, AccountType, Currency
    api/getAccounts.ts             # datos ficticios en memoria
    lib/maskAccountNumber.ts
    lib/formatBalance.ts
    ui/AccountCard.tsx
    index.ts                       # API pública del slice
  shared/ui/                       # Button, VisuallyHidden
```
Reglas de dependencia:
- Cada capa importa solo de las capas inferiores, en este orden: `app → pages → widgets → features → entities → shared`.
- Los slices se consumen únicamente desde su `index.ts`.

## Accesibilidad y UX
- El elemento `role=status` existe vacío desde la carga, para que el anuncio de «Capacidad simulada» sea fiable.
- La lista usa `<ul>` y botones nativos para seleccionar cuentas. El filtro tiene `<label>` asociados.
- El foco es visible, el contraste es AA y el layout es de una columna en móvil y de dos en escritorio.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Pedir PostgreSQL puede leerse como una conexión desde el frontend | D5; se documenta en el README como fuera de alcance |
| La plantilla puede no incluir un runner de pruebas (por ejemplo, Vitest), y no se agregan dependencias | Las pruebas unitarias se documentan en TODOS.json (T05). Solo se ejecutan si el runner ya existe |
| La estructura FSD es excesiva para una sola pantalla | Slices mínimos, sin `processes`. La alternativa de colapsar todo se recoge en H4 |
| Ocultar el botón tras filtros o estados de carga rompería la aceptación | `SimulateCapability` se renderiza siempre, fuera de cualquier condición |
| Los datos ficticios pueden parecer reales | Números sintéticos y enmascarados, con la etiqueta «Datos de demostración» |
| Con SGC en fallback faltan lineamientos institucionales (marca, seguridad) | H3; la revisión queda pendiente antes de pasar de candidate |

## Hipótesis explícitas
- **H1.** No se conoce el país ni la moneda. Se asumen PEN y USD con locale `es`.
- **H2.** Los tipos de cuenta son ahorros y corriente. No se incluyen tarjetas ni créditos.
- **H3.** No hay contexto SGC (fallback). No se aplican guías de marca ni de seguridad corporativas, y `context-package.json` se cita solo si existe.
- **H4.** Si el pipeline restringe la edición a `App.tsx` y `styles.css`, FSD se representa con regiones comentadas por capa dentro de `App.tsx`, respetando las mismas reglas de dependencia.
- **H5.** Las pruebas unitarias cubren las funciones puras: enmascarado, formato, filtro y el reducer de estado. No incluyen pruebas e2e.

## Trazabilidad con aceptación
| Criterio | Cómo se cumple |
|---|---|
| T03: botón y texto | Slice `simulate-capability`, renderizado incondicional, con `role=status` |
| T04: tsc y build | `strict` de TypeScript, sin `any`, sin dependencias nuevas |
| T05: plan de pruebas | Funciones puras de D6 y casos listados en TODOS.json |
| T06: documentación | Decisiones D1 a D7 en el README |
| T07: cierre | Resultado declarado como candidate, sin afirmar que está listo para producción |
