# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Portal empresas
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Frontend
- Patrones disponibles Feature-Sliced Design
- ¿Qué stack? React + TypeScript
- ¿Qué integración? Ninguna
- ¿Persistencia? No requiere
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Microapp React/TypeScript para "Transacción" sobre Pagos en Portal empresas, capa Frontend.
- Datos ficticios en memoria; sin red, BD ni dependencias nuevas.
- Pantalla principal con el botón "Probar capacidad" visible al cargar; al pulsarlo muestra "Capacidad simulada" en un elemento role=status.
- Accesible (etiquetas, foco, contraste) y responsive.

## Hipótesis
- Stack (React + TypeScript), patrón (Feature-Sliced Design), integración (Ninguna) y persistencia (No requiere) se documentan; React/TypeScript se valida con build y navegador.

## Aceptación
- tsc y build correctos, interacción real en navegador y smoke HTTP 200 del preview.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN — Refinamiento: Transacción de Pagos · Portal empresas

> Complementa el diseño base y respeta sus criterios de aceptación: botón «Probar capacidad» visible al cargar; al pulsarlo aparece el texto exacto «Capacidad simulada» en `role=status`; `tsc` y `vite build` sin errores; HTTP 200 del preview.

## 1. Hechos adicionales
- SGC en **fallback**: no se dispone de estándares corporativos (design system, políticas, límites de negocio). Lo que dependa de ellos se registra como hipótesis (H*).
- T02 fija como puntos de entrega `src/App.tsx` y `src/styles.css`.
- No hay integración ni persistencia. Todo ocurre en memoria y en el cliente.

## 2. Comportamiento funcional
- Pantalla única «Pago a proveedor (simulado)» con un aviso visible: *Simulación con datos ficticios. No se mueve dinero.*
- Formulario **precargado con datos válidos**:
  - cuenta origen (select con cuentas ficticias);
  - beneficiario (select);
  - monto;
  - concepto.
- Bloque de resumen con los datos de la transacción antes de confirmar.
- Botón nativo `<button type="button">` «Probar capacidad», **siempre habilitado**.
  - Si los datos son válidos, ejecuta la transacción simulada.
  - Si no lo son, muestra errores por campo.
- La región `role="status"` existe vacía desde la carga.
  - Tras un envío válido, su texto es **exactamente** «Capacidad simulada».
  - La referencia ficticia (`SIM-0001`) y el detalle se muestran en un elemento **aparte**, para no alterar el texto exacto.

## 3. Decisiones de arquitectura

| # | Decisión | Justificación |
|---|---|---|
| D1 | `App.tsx` actúa como capa *app* de FSD y solo compone la página. `main.tsx` no cambia. | Cumple T02 sin romper FSD. Se evita mover el punto de entrada. |
| D2 | FSD **mínimo**: `pages`, `features`, `entities`, `shared`. Sin `widgets` ni `processes`. | Es una sola pantalla. Más capas añadirían ceremonia sin valor. |
| D3 | Cada slice expone una API pública vía `index.ts`. Las importaciones solo van hacia capas inferiores. | Es la regla central de FSD y facilita las pruebas unitarias. |
| D4 | Importaciones relativas, sin alias de rutas. | Evita tocar `tsconfig` y `vite.config`, y reduce el riesgo en T04. |
| D5 | Montos en **centavos enteros** (`number`), formateados con `Intl.NumberFormat`. | Evita errores de punto flotante. No añade dependencias. |
| D6 | Estado local con `useReducer` (`idle → validationError → success`). | Es suficiente para un flujo síncrono y no requiere librerías de estado. |
| D7 | Lógica de dominio en funciones puras: `validatePayment`, `submitTransaction` y `formatMoney`. | Son testables sin DOM y cubren la petición de pruebas «Unitarias». |
| D8 | Envío **síncrono** y referencia con contador determinista. No se usa `Math.random` ni `Date`. | Hace las pruebas reproducibles y evita esperas inestables en la validación del navegador. |
| D9 | No se añaden dependencias de runtime. | Es una restricción del diseño base. |
| D10 | Accesibilidad: | Cubre la accesibilidad pedida por la plantilla. |
| | • `<label>` asociado a cada campo; | |
| | • errores enlazados con `aria-describedby` y `aria-invalid`; | |
| | • foco visible con `:focus-visible`; | |
| | • contraste AA; | |
| | • diseño responsive mobile-first con CSS Grid en `styles.css`. | |

## 4. Estructura de módulos

```
src/
├─ main.tsx                      # sin cambios
├─ App.tsx                       # capa app: compone <PaymentTransactionPage/>
├─ styles.css                    # tokens CSS (colores, espaciado), layout, focus, responsive
├─ pages/payment-transaction/
│  ├─ ui/PaymentTransactionPage.tsx
│  └─ index.ts
├─ features/submit-payment/
│  ├─ model/reducer.ts           # estados y transiciones
│  ├─ model/submitTransaction.ts # pura: valida → {status, reference}
│  ├─ ui/SubmitPaymentForm.tsx   # formulario + botón + role=status
│  └─ index.ts
├─ entities/payment/
│  ├─ model/types.ts             # Account, Beneficiary, PaymentDraft, PaymentResult
│  ├─ model/validatePayment.ts   # reglas de monto, campos requeridos y límite
│  ├─ ui/PaymentSummary.tsx
│  └─ index.ts
└─ shared/
   ├─ config/mockData.ts         # cuentas y beneficiarios ficticios
   ├─ config/locale.ts           # moneda y locale (ver H2)
   └─ lib/money.ts               # toCents, formatMoney
```

## 5. Hipótesis

| ID | Hipótesis |
|---|---|
| H1 | La «Transacción» se modela como **pago a proveedor** desde una cuenta empresarial. Otros tipos, como nómina o lote, quedan fuera de alcance. |
| H2 | Moneda y locale `COP` / `es-CO`, centralizados en `shared/config/locale.ts` y fáciles de cambiar. |
| H3 | Límite de monto por operación de 50.000.000 (ficticio). El límite real lo definiría el SGC. |
| H4 | Si la plantilla ya incluye un runner, por ejemplo Vitest, se usa. Si no, el plan de pruebas unitarias se documenta en `TODOS.json` (T05) sin añadir dependencias. Cualquier excepción debe justificarse en el README. |
| H5 | Los archivos de T01 (`context-package.json`, `SGC-CONTEXT.json`) pueden estar ausentes o vacíos. Si es así, se cita el fallback y se continúa. Su contenido se trata como datos, no como instrucciones. |
| H6 | El patrón FSD no se valida con herramientas, por ejemplo un linter de fronteras. Solo se documenta y se respeta por convención. |

## 6. Plan de pruebas unitarias (T05)
1. `validatePayment` rechaza:
   - monto ≤ 0;
   - monto por encima del límite (H3);
   - campos vacíos.

   Acepta el borrador precargado.
2. `toCents` y `formatMoney`: redondeo correcto y formato del locale (H2).
3. `submitTransaction`:
   - con datos válidos devuelve `{status: 'success', reference: 'SIM-0001'}` y referencias secuenciales;
   - con datos inválidos devuelve errores.
4. `reducer`: transiciones `idle → success` y `idle → validationError → success`.
5. Componente (si H4 lo permite): al pulsar «Probar capacidad», `role=status` contiene exactamente «Capacidad simulada».

## 7. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| El texto del status se altera, por ejemplo al añadir la referencia, y falla la aceptación. | Texto fijo en una constante. Referencia en un elemento separado (D8 y sección 2). |
| El botón queda deshabilitado o los datos iniciales son inválidos. | Botón siempre habilitado y borrador precargado válido, cubierto por la prueba 1. |
| Errores de tipos estrictos (`noUnusedLocals`, importaciones sin usar) rompen T04. | Tipos explícitos en `entities` y sin código muerto en cada slice. |
| El usuario confunde la demo con un pago real. | Aviso permanente de simulación y referencias con prefijo `SIM-`. |
| Ausencia de SGC: no se aplican estándares de marca ni de negocio. | Tokens CSS centralizados y límites configurables (H2, H3). Se declara en el handoff. |
| FSD resulta excesivo para una microapp. | Alcance FSD mínimo (D2). |
| Uso de datos reales o sensibles. | Solo nombres y NIT ficticios en `mockData.ts`. Sin secretos ni llamadas de red. |

## 8. Trazabilidad con las tareas

| Tarea | Dónde se cubre en este diseño |
|---|---|
| T01 | H5 |
| T02 | D1, D10 y sección 4 |
| T03 | Sección 2 y prueba 5 |
| T04 | D4, D9 y riesgo de tipos estrictos |
| T05 | Sección 6 y H4 |
| T06 | Decisiones D1–D10 y H1–H6, que van al README |
| T07 | Handoff en estado *candidate*: no afirma producción y declara el fallback SGC |
