# DESIGN

## Hechos (respuestas del guion)
- ¿Qué necesitas construir? frontend
- ¿Qué stack? angular

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en angular (capa frontend) para "sin definir" sobre sin definir en sin definir, patrón sin definir.
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia sin definir detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en angular sin compilarlo ni ejecutarlo en este host: solo se verifica sintaxis donde hay validador local; el resto queda sin verificar.
- Integración (sin definir), persistencia (sin definir) y pruebas (sin definir) se implementan como candidate y requieren build real en CI.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento (Angular, capa frontend)

> Complementa el diseño base y respeta sus criterios de aceptación.

## Decisiones de arquitectura

| ID | Decisión | Justificación |
|---|---|---|
| D1 | Componentes *standalone* con `app.config.ts` y `provideRouter`/`provideHttpClient`, sin NgModules | Es el modelo idiomático del Angular actual y reduce el código repetitivo. |
| D2 | Estado local con *signals* en un store por feature, sin NgRx | El alcance es pequeño e indefinido. NgRx añadiría una dependencia sin justificación. |
| D3 | Patrón Repository: interfaz más `InjectionToken`. Implementación por defecto `InMemory…Repository`; adaptador HTTP opcional | La integración y la persistencia están sin definir. El adaptador se cambia sin tocar las páginas. |
| D4 | Rutas *lazy* por feature (`loadComponent`) | Aísla las features y facilita añadir dominio después. |
| D5 | Configuración no sensible en `environments/*.ts` (build) o `assets/config.json` (runtime) | Angular no lee variables de entorno en el navegador. Así se cumple "configuración por entorno" sin secretos, porque todo lo que va al bundle es público. |
| D6 | TypeScript `strict` y plantillas con control flow (`@if`/`@for`) | Detecta más errores en el futuro build de CI y mantiene la sintaxis moderna. |
| D7 | Specs junto al código (`*.spec.ts`) con el runner por defecto del CLI fijado | No introduce herramientas extra (ver H4). |
| D8 | UI accesible con HTML semántico, estados vacío/carga/error y CSS propio, sin librería de componentes | No hay requisito de diseño. Evita dependencias pesadas. |

## Estructura de módulos

```
package.json · angular.json · tsconfig*.json · README.md
src/
  main.ts · index.html · styles.css
  environments/environment.ts · environment.development.ts
  app/
    app.config.ts · app.routes.ts · app.component.ts
    core/            # config, manejo de errores, interceptor HTTP (no-op)
    shared/ui/       # componentes presentacionales (empty-state, spinner)
    features/items/  # feature ejemplo (H1)
      models/item.model.ts
      data/items.repository.ts            # interfaz + InjectionToken
      data/in-memory-items.repository.ts  # datos ficticios (por defecto)
      data/http-items.repository.ts       # candidate, no conectado
      state/items.store.ts                # signals
      pages/items-list.page.ts · item-detail.page.ts
      *.spec.ts
  testing/fixtures/items.fixture.ts       # datos ficticios marcados como tales
```

## Hipótesis explícitas

- **H1 Dominio:** como está sin definir, se usa una feature genérica `items` (listar y ver detalle; CRUD solo en memoria). Debe renombrarse cuando se defina el dominio.
- **H2 Integración:** no hay backend. `http-items.repository.ts` queda como contrato candidate, apuntando a una `apiBaseUrl` ficticia y sin uso por defecto.
- **H3 Persistencia:** memoria de sesión, con `localStorage` opcional detrás de la misma interfaz. No hay persistencia real.
- **H4 Versión y runner:** se usa la versión estable vigente del CLI, que se fijará en `package.json`. El runner de pruebas será el que traiga ese CLI por defecto (Vitest o Karma/Jasmine según versión). No está verificado.
- **H5 Patrón:** como no se definió, se aplica *feature-sliced* con presentación separada de datos (D3/D4).

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Sin `ng build` ni `node_modules` en el host: los errores de tipos y de plantillas no se detectan | Solo se valida sintaxis (T03). El resumen de T06 lista lo no verificado y exige build en CI. |
| Dominio indefinido: posible retrabajo | Los cambios se aíslan en `features/items` y el repositorio es intercambiable. |
| Desfase de versiones entre `package.json` y las APIs usadas | Usar solo APIs estables. Documentar la versión en el README. |
| Que se filtren secretos al bundle | Prohibir claves en `environments`. Advertirlo en el README. |
| Confundir fixtures con datos reales | Nombres y datos claramente ficticios, en `testing/fixtures`. |

## Trazabilidad con las tareas

- **T02:** D1–D6, D8.
- **T04:** D7, con specs de store, repositorio en memoria y página de lista.
- **T05:** el README documenta `npm install`, `ng serve`, `ng test`, `ng build` y explica H2/H3 como candidate.
- **T06:** el resumen se entrega como candidate, sin afirmar compilación ni producción.
