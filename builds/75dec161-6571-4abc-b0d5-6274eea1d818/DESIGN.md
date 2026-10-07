# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Frontend
- Patrones disponibles Micro-frontends
- ¿Qué stack? Angular
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular (capa Frontend) para "Consulta" sobre Tarjetas en Banca por Internet, patrón Micro-frontends.
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia sin definir detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular sin compilarlo ni ejecutarlo en este host: solo se verifica sintaxis donde hay validador local; el resto queda sin verificar.
- Integración (sin definir), persistencia (sin definir) y pruebas (Unitarias) se implementan como candidate y requieren build real en CI.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento: Consulta de Tarjetas (MFE Angular)

> Complementa el diseño base sin modificar sus criterios de aceptación. El estado SGC es **fallback (no configurado)**, por lo que no hay restricciones corporativas confirmadas. Todo lo que no proviene del guion se registra como hipótesis.

## Decisiones de arquitectura

| ID | Decisión | Justificación |
|---|---|---|
| AD1 | **Remote** Angular que expone `./routes` mediante federación de módulos (H1). También puede ejecutarse de forma aislada con datos mock. | Cumple el patrón Micro-frontends y permite probar el remote sin depender del shell. |
| AD2 | Componentes *standalone* con *signals* y sin NgModules. | Es el estilo idiomático actual de Angular y reduce la superficie que se expone al shell. |
| AD3 | Patrón puerto/adaptador: `CardsGateway` (clase abstracta usada como token DI), con `MockCardsGateway` activo y `HttpCardsGateway` como stub no cableado. | La integración está sin definir. El contrato queda aislado y se puede sustituir sin tocar la UI. |
| AD4 | **Sin persistencia.** El estado vive en memoria (`CardsStore` con signals). No se guarda nada en `localStorage` ni en `sessionStorage`. | La persistencia está sin definir y almacenar datos de tarjeta en el navegador implica riesgo. |
| AD5 | Alcance de solo lectura: listado de tarjetas y detalle (saldo, línea, disponible, fecha de corte). | La capacidad pedida es "Consulta". No incluye operaciones transaccionales. |
| AD6 | El PAN siempre se muestra enmascarado (`**** 1234`) mediante la función pura `maskPan`. Los datos son ficticios. | Reduce la exposición de datos sensibles y permite probarlo de forma unitaria y determinista. |
| AD7 | La sesión y la autenticación se delegan al shell. El remote no maneja tokens. | Evita incluir secretos y mantiene una única responsabilidad (H3). |
| AD8 | La configuración se lee de `environment.ts` (`useMock`, `apiBaseUrl` vacío y `currency`). | Permite configurar por entorno sin incluir secretos. |
| AD9 | La UI contempla los estados *cargando*, *vacío* y *error*. Usa roles ARIA y una tabla o lista semántica. | Hace la UX verificable y accesible. |

## Estructura de módulos

```
cards-query-mfe/
  package.json · angular.json · tsconfig*.json · federation.config.js
  src/main.ts            (initFederation → bootstrap)
  src/bootstrap.ts
  src/environments/environment.ts
  src/app/app.config.ts · app.routes.ts
  src/app/cards/
    cards.routes.ts                 (expuesto: ./routes)
    domain/card.model.ts · mask-pan.ts
    data/cards.gateway.ts · mock-cards.gateway.ts · mock-cards.data.ts · http-cards.gateway.ts
    state/cards.store.ts
    ui/card-list/ · ui/card-detail/ (ts, html, scss)
  *.spec.ts junto a mask-pan, mock gateway, store y card-list
  README.md
```

## Hipótesis
- **H1:** La federación usa Native Federation (`@angular-architects/native-federation`), compatible con el builder esbuild. Si el shell usa Webpack Module Federation, hay que ajustar `federation.config.js`.
- **H2:** La versión de Angular y el runner de pruebas (Jasmine/Karma o Vitest) se fijan en el manifiesto y se confirman en CI. Los specs se escriben con TestBed y `expect` estándar para minimizar dependencias del runner.
- **H3:** El shell provee el enrutamiento raíz y la sesión, y monta el remote en `/tarjetas`.
- **H4:** La moneda y el idioma son configurables. Por defecto se usa `es` y la moneda definida en `environment`.
- **H5:** No existe un contrato de API. El modelo `Card` es una propuesta que debe validarse con el backend.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Versiones de `@angular/*` compartidas incompatibles entre shell y remote | Declarar `shared` como singleton con `strictVersion` y documentarlo en el README. |
| Estilos del remote que afectan al shell | Usar encapsulación por defecto y no incluir estilos globales. |
| Exposición del PAN o de datos reales | Mantener datos ficticios, aplicar `maskPan` y prohibir el almacenamiento en el navegador. |
| El validador local no cubre TS ni plantillas HTML | Reportar esos archivos como **no verificados**. La compilación real queda para CI. |
| Contrato del gateway distinto al backend real | El adaptador aislado (AD3) limita el cambio a la capa `data/`. |

## Notas para builder y tester
- El orden de ejecución es T01 a T06. En el resumen final se deben citar el estado SGC *fallback* y las hipótesis H1 a H5.
- El README debe cubrir: `npm install`, el modo standalone, el registro del remote en el shell, la integración (sin definir, mock activo) y la persistencia (sin definir, solo en memoria).
- El cierre se marca como **candidate**: sin compilación, sin ejecución de pruebas y sin afirmar que está listo para producción.
