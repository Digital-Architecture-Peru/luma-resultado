# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Frontend
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular (capa Frontend) para "Consulta" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia sin definir detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular sin compilarlo ni ejecutarlo en este host: solo se verifica sintaxis donde hay validador local; el resto queda sin verificar.
- Integración (sin definir), persistencia (sin definir) y pruebas (Unitarias) se implementan como candidate y requieren build real en CI.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento (Consulta de Tarjetas · Angular · Atomic Design)

> Complementa el diseño base y respeta sus criterios de aceptación. SGC está en **fallback**, así que no hay estándares corporativos confirmados.

## Decisiones de arquitectura

| ID | Decisión | Justificación |
|---|---|---|
| AD1 | Componentes standalone y `ChangeDetectionStrategy.OnPush` | Es idiomático en Angular moderno, evita NgModules y facilita las pruebas unitarias aisladas. |
| AD2 | Atomic Design en `shared/ui` (atoms, molecules, organisms, templates) y páginas en `features/cards/pages` | Cumple el patrón pedido y separa la UI reutilizable de la lógica de la feature. |
| AD3 | Puerto `CardsRepository` (clase abstracta) con `MockCardsAdapter` como único adaptador activo | La integración no está definida. Se podrá cambiar a HTTP sin tocar componentes. |
| AD4 | Solo lectura: listar tarjetas, ver el detalle y ver los movimientos | El tipo de capacidad es "Consulta" y no se diseñan mutaciones. |
| AD5 | Componentes de presentación (`@Input`/`@Output`) y página contenedora que inyecta `CardsFacade` | Los atoms, molecules y organisms se prueban sin dependencias. La página orquesta los datos. |
| AD6 | El número de tarjeta llega enmascarado (`**** 1234`) y el pipe `maskPan` actúa como defensa extra | Nunca se modela ni se muestra un PAN completo, ni siquiera en datos ficticios. |
| AD7 | `environment.ts` con `useMock: true` y `apiBaseUrl: ''` | Configuración sin secretos y lista para CI. |
| AD8 | Estados explícitos `loading`, `empty`, `error` y `data` en el template | La UX de una consulta debe ser predecible. Aplica el skill modern-ui-ux. |

## Estructura de módulos

```
src/app/
  core/cards/
    models/ card.model.ts, movement.model.ts
    ports/ cards.repository.ts
    adapters/ mock-cards.adapter.ts (+ mock-data.ts)
    cards.facade.ts
  shared/ui/
    atoms/ card-number, amount, status-badge
    molecules/ card-summary, movement-row
    organisms/ card-list, card-detail, movements-table
    templates/ consultation-layout
  shared/pipes/ mask-pan.pipe.ts
  features/cards/pages/ cards-page, card-detail-page
  app.routes.ts            # /tarjetas, /tarjetas/:id
environments/ environment.ts
```

Manifiestos: `package.json`, `angular.json`, `tsconfig*.json`. Cada unidad tiene su `*.spec.ts` junto al archivo.

## Pruebas unitarias (candidate)
- **Atoms y molecules:** renderizado según el input, por ejemplo el badge por estado y el formato de monto.
- **Pipe:** `maskPan` con un PAN completo, uno ya enmascarado y una entrada vacía.
- **Facade:** usa un `CardsRepository` falso y cubre los estados `data`, `empty` y `error`.
- **Página:** muestra la lista con datos mock y emite la navegación al detalle.

## Hipótesis
- **H1:** Angular 17 o superior con standalone. Si la versión es otra, se ajustan los manifiestos.
- **H2:** Se usa Jasmine/Karma (el runner por defecto del CLI). Si el estándar es Jest, solo cambia la configuración, no los specs.
- **H3:** Locale y moneda configurables. Se asume `es` con moneda por token `CURRENCY_CODE`, porque el país no está confirmado.
- **H4:** No existe un design system corporativo, así que se usan estilos propios mínimos y accesibles.
- **H5:** Autenticación y sesión de Banca por Internet quedan fuera del alcance (las provee el host).
- **H6:** No se compila ni ejecuta en este host. Solo se verifica sintaxis donde haya validador local.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Exposición de datos sensibles (PAN o CVV) | AD6, ningún campo CVV y datos solo ficticios. |
| Desalineación con estándares SGC (fallback) | Se documenta en el README y se revisa cuando SGC esté disponible. |
| Versión de Angular incompatible en CI | H1 queda explícita y se fijan las versiones en `package.json`. |
| Contrato de integración desconocido | Puerto AD3. El adaptador HTTP queda pendiente de contrato. |
| Brechas de accesibilidad | Roles y labels ARIA, tabla semántica y foco visible. |

## Trazabilidad con los todos
- **T01:** se citan Hechos, H1–H6 y el estado fallback.
- **T02:** se implementa la estructura de módulos anterior.
- **T03:** se valida la sintaxis de TS, JSON y HTML con el validador disponible.
- **T04:** specs por unidad.
- **T05:** el README cubre build, ejecución, integración y persistencia sin definir.
- **T06:** resumen candidate que no afirma compilación ni producción.
