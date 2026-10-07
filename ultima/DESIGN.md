# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? App móvil
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Frontend
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular
- ¿Qué integración? Ninguna
- ¿Persistencia? No requiere
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular (capa Frontend) para "Consulta" sobre Cuentas en App móvil, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración Ninguna y persistencia No requiere detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular sin compilarlo ni ejecutarlo en este host: solo se verifica sintaxis donde hay validador local; el resto queda sin verificar.
- Integración (Ninguna), persistencia (No requiere) y pruebas (Unitarias) se implementan como candidate y requieren build real en CI.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento (Consulta de Cuentas · Angular · App móvil)

> Complementa el diseño base y no altera sus criterios de aceptación.

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Componentes *standalone* y ruta *lazy* `cuentas` | Es el estilo idiomático actual de Angular. Reduce el boilerplate de NgModules y aísla la feature. |
| D2 | Atomic Design: `shared/ui/{atoms,molecules,organisms}`; *templates* y *pages* dentro de la feature | Cumple el patrón pedido y separa la UI reutilizable de la composición propia del dominio. |
| D3 | Puerto `ACCOUNTS_QUERY` (InjectionToken) con el adaptador `InMemoryAccountsAdapter` | La integración es "Ninguna", pero el adaptador se puede reemplazar por HTTP sin tocar componentes. |
| D4 | Estado local con `signal`/`computed` en la página, sin NgRx | La consulta es de solo lectura y no hay persistencia, así que un store global no está justificado. |
| D5 | CSS mobile-first propio, sin librería de UI | Evita dependencias sin motivo. Áreas táctiles ≥44px y contraste AA. |
| D6 | El número de cuenta se expone siempre enmascarado (`•••• 1234`) | Es un dominio sensible: se adopta la buena práctica aunque los datos sean ficticios. |
| D7 | Pruebas unitarias con Jasmine/Karma (CLI por defecto) y TestBed; cada `*.spec.ts` junto a su archivo | Es el estándar del CLI y no requiere configuración adicional. |
| D8 | `environment.ts` sin secretos; `locale` y `currency` configurables | Atiende la regla de configuración por entorno. Los montos se formatean con los pipes de Angular. |

## Estructura de módulos
```
src/app/
  app.config.ts · app.routes.ts · app.component.ts
  core/accounts/
    account.model.ts            # Account, AccountType, AccountStatus
    accounts-query.port.ts      # InjectionToken + interfaz
    in-memory-accounts.adapter.ts (+ .spec)   # datos ficticios
    mask-account.pipe.ts (+ .spec)
  shared/ui/
    atoms/      badge, amount, icon-button (+ .spec)
    molecules/  account-card, search-field (+ .spec)
    organisms/  account-list (+ .spec)
  features/accounts/
    templates/  mobile-list-detail.template.ts
    pages/      accounts-list.page.ts, account-detail.page.ts (+ .spec)
    accounts.routes.ts
src/environments/environment.ts
package.json · angular.json · tsconfig*.json · karma.conf.js · README.md
```

**Contrato del puerto:**
- `list(filter?: {type?}): Observable<Account[]>`
- `getById(id): Observable<Account | undefined>`

**Modelo `Account`:** `id`, `alias`, `maskedNumber`, `type` (ahorros/corriente), `currency`, `availableBalance`, `status`.

## Hipótesis (no confirmadas)
- **H1:** "App móvil" significa una SPA Angular responsive (o PWA), no Ionic/Capacitor. Si es nativa híbrida, cambian el empaquetado y la navegación.
- **H2:** "Consulta" incluye el listado de cuentas, el filtro por tipo y el detalle de solo lectura. No incluye movimientos ni operaciones.
- **H3:** Se usa la versión estable vigente de Angular, fijada en `package.json`, sin verificar contra un registro real.
- **H4:** El usuario ya está autenticado, por lo que la autenticación queda fuera de alcance.
- **H5:** `locale` y `currency` por defecto son `es` y `USD`, configurables. Pendiente de confirmar con negocio.
- **H6:** El estado del SGC es *fallback*, por lo que no se heredan lineamientos corporativos.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| No se compila ni se ejecutan pruebas en el host | Entrega *candidate* y build/test obligatorios en CI (`ng build`, `ng test --watch=false`). |
| Desfase de versiones de dependencias | Versiones fijadas y documentadas en el README. |
| Sobre-fragmentación con Atomic Design | Solo se crean átomos con al menos un reuso o una responsabilidad clara. |
| Exposición de datos sensibles al conectar un backend real | Enmascarado en el modelo y la UI (D6). Nunca se registra el número completo en logs. |
| Ambigüedad en H1/H2 | Se registran en el README como supuestos pendientes. |

## Comprobaciones para el tester (refinan, no sustituyen)
- Existe al menos un `*.spec.ts` por átomo, molécula, organismo, adaptador y pipe.
- Ningún componente importa `InMemoryAccountsAdapter` directamente; solo lo usa `app.config.ts`.
- Ningún archivo contiene un número de cuenta sin enmascarar fuera del adaptador de datos ficticios.
- El README documenta el build, la ejecución, la integración "Ninguna", la persistencia "No requiere" y lo que no se verificó.
