# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? App móvil
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Frontend
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Svelte
- ¿Qué integración? Ninguna
- ¿Persistencia? No requiere
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Svelte (capa Frontend) para "Notificación" sobre Tarjetas en App móvil, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración Ninguna y persistencia No requiere detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Svelte sin compilarlo ni ejecutarlo en este host: solo se verifica sintaxis donde hay validador local; el resto queda sin verificar.
- Integración (Ninguna), persistencia (No requiere) y pruebas (Unitarias) se implementan como candidate y requieren build real en CI.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento: Notificaciones de Tarjetas (Svelte)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Svelte + Vite como SPA *mobile-first* (viewport móvil, sin SvelteKit) | Es una sola vista de notificaciones, sin SSR ni rutas complejas. Así se reduce el manifiesto. |
| D2 | Atomic Design en `src/lib/components/{atoms,molecules,organisms,templates}` y páginas en `src/pages` | Cumple el patrón pedido y aísla la UI reutilizable. |
| D3 | Dominio puro en `src/lib/domain`, sin dependencias de Svelte | La lógica (no leídas, orden, enmascarado) se prueba en unitarias sin montar componentes. |
| D4 | Puerto `NotificationSource` con un adaptador `mockSource` en memoria | La integración es "Ninguna". Un cambio futuro a API solo requiere un adaptador nuevo. |
| D5 | Estado en un store de Svelte (`writable`) en memoria | La persistencia es "No requiere". El estado se pierde al recargar y así queda documentado. |
| D6 | Tarjeta siempre enmascarada (`•••• 1234`) mediante `maskCard()` | Se evita exponer PAN, incluso con datos ficticios. |
| D7 | Vitest + @testing-library/svelte + jsdom | Herramienta nativa del ecosistema Vite para pruebas unitarias. |
| D8 | Configuración solo con `VITE_*` (p. ej. `VITE_MAX_ITEMS`), con `.env.example` sin valores sensibles | No hay secretos en el cliente. |
| D9 | Accesibilidad: `aria-live="polite"` en el banner, objetivos táctiles ≥44px y contraste AA | Requisitos de UX móvil. |

## Estructura de módulos
```
package.json  vite.config.js  vitest.config.js  index.html  .env.example  README.md
src/
  main.js  App.svelte
  pages/NotificationsPage.svelte
  lib/
    domain/notification.js      # tipos JSDoc, maskCard, sortByDate, unreadCount, markRead
    ports/notificationSource.js # contrato list(): Promise<Notification[]>
    adapters/mockSource.js      # datos ficticios
    stores/notifications.js     # load, markRead, markAllRead
    components/
      atoms/       Badge, Icon, Button, Timestamp
      molecules/   NotificationItem, CardChip
      organisms/   NotificationList, NotificationBanner
      templates/   NotificationsTemplate
tests/
  domain.test.js  store.test.js  NotificationItem.test.js  NotificationList.test.js
```
**Modelo:** `{ id, type: 'compra'|'pago_proximo'|'bloqueo'|'limite', cardLast4, title, body, amount?, createdAt, read }`.

## Hipótesis
- **H1.** "App móvil" se interpreta como web móvil o PWA. Empaquetarla como app nativa (Capacitor) queda fuera de alcance.
- **H2.** Se usa Svelte 4 (`writable`, `export let`). Si se exige Svelte 5 con runes, hay que ajustar la sintaxis.
- **H3.** "Notificación" significa notificaciones *in-app* (lista y banner), no push del sistema operativo.
- **H4.** Los tipos de notificación y los textos son ficticios y están en español. Sin i18n.
- **H5.** Se usa JavaScript con JSDoc, no TypeScript, para reducir la configuración.
- **H6.** Las versiones de dependencias se fijan sin poder comprobarlas en el registro npm.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| El validador local no analiza `.svelte`, así que solo se verifican `.js` y `.json` | Declarar los `.svelte` como no verificados y exigir `vite build` en CI |
| Las pruebas no se ejecutan en este host | Marcarlas como candidate y ejecutar `npm test` en CI |
| Incompatibilidad entre versiones de Svelte, testing-library y Vitest | Fijar rangos compatibles y documentarlos en el README |
| Fuga de datos sensibles en el futuro, al conectar una fuente real | Mantener D6 y la revisión de PCI en el nuevo adaptador |
| Expectativa de una app nativa (H1) | Validar H1 con el solicitante antes de pasar a producción |

## Trazabilidad con la aceptación (sin cambios)
- **Sintaxis:** se verifican los `.js` y `.json`. Los `.svelte` quedan reportados como no verificados.
- **Pruebas presentes:** 4 archivos en `tests/` que cubren dominio, store y componentes.
- **README presente:** incluye build y ejecución, integración (Ninguna, con puerto y mock) y persistencia (No requiere, store en memoria).
- **Publicación con commit:** el resumen es candidate y no afirma compilación ni que esté listo para producción.
