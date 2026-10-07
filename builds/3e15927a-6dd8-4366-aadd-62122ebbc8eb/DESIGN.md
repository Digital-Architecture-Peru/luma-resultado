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

# DESIGN · Refinamiento: Consulta de Tarjetas (Angular, Atomic Design)

> Complementa el diseño base. No modifica sus Hechos ni su Aceptación. SGC en *fallback*: todo lo no confirmado por el guion figura como hipótesis.

## Decisiones de arquitectura

| # | Decisión | Justificación |
|---|---|---|
| D1 | Componentes *standalone* con `ChangeDetectionStrategy.OnPush` | Es el estilo idiomático actual de Angular. Reduce el *boilerplate* de NgModules y las re-renderizaciones. |
| D2 | Carpetas por nivel Atomic: `atoms/molecules/organisms/templates/pages` | Aplica literalmente el patrón del guion. Los átomos y moléculas se pueden reutilizar en otras capacidades de Banca por Internet. |
| D3 | Acceso a datos tras `TarjetasRepository` (clase abstracta) inyectado por `InjectionToken`. La implementación por defecto es `TarjetasMockRepository` | La integración está sin definir. La interfaz permite sustituir el mock por un cliente HTTP sin tocar la UI. |
| D4 | Estado con `Observable` y `async` pipe; la *page* orquesta y los niveles inferiores son presentacionales (`@Input`/`@Output`) | Separa la lógica de la vista y facilita las pruebas unitarias con TestBed. |
| D5 | El número de tarjeta se enmascara en el modelo de vista (`**** 1234`) mediante un pipe `maskPan` | Es una buena práctica de dominio en tarjetas, aunque los datos sean ficticios. Además, la lógica queda probada de forma unitaria. |
| D6 | Configuración en `environments/environment*.ts`, solo con valores no sensibles (`useMock`, `apiBaseUrl` vacío) | En Angular los entornos se resuelven al compilar. No se incluyen secretos. |
| D7 | Persistencia: ninguna en cliente (sin `localStorage`) | La persistencia está sin definir y una consulta es de solo lectura. Así se evita guardar datos de tarjeta en el navegador. |

## Estructura de módulos

```
src/app/
  core/config/app-config.token.ts
  features/tarjetas/
    domain/tarjeta.model.ts            # Tarjeta, EstadoTarjeta
    data/tarjetas.repository.ts        # abstracta + token
    data/tarjetas-mock.repository.ts   # datos ficticios
    ui/atoms/{badge-estado,monto}/
    ui/molecules/tarjeta-resumen/
    ui/organisms/lista-tarjetas/
    ui/templates/consulta-layout/
    ui/pages/consulta-tarjetas.page.ts
    pipes/mask-pan.pipe.ts
  app.routes.ts                        # ruta /tarjetas (lazy)
src/environments/
*.spec.ts junto a cada pieza
angular.json, package.json, tsconfig*.json, README.md
```

## Pruebas unitarias (mínimo)

- `mask-pan.pipe.spec.ts`: enmascara bien y tolera entradas vacías o cortas.
- `tarjetas-mock.repository.spec.ts`: devuelve la lista ficticia.
- `tarjeta-resumen.spec.ts`: renderiza los `@Input` y emite la selección.
- `consulta-tarjetas.page.spec.ts`: cubre los estados de carga, vacío y error usando un repositorio *stub*.

## Hipótesis

- **H1.** "Consulta" equivale a un listado de tarjetas del cliente con alias, PAN enmascarado, tipo, estado, saldo y límite. El detalle y los movimientos quedan fuera del alcance.
- **H2.** La versión de Angular es 17 o superior (standalone y control flow `@if/@for`). Si fuera menor, D1 requiere NgModules.
- **H3.** El runner de pruebas es Jasmine/Karma, el que trae por defecto el CLI. Se puede cambiar a Jest sin afectar el diseño.
- **H4.** La autenticación y la sesión las provee el *shell* de Banca por Internet y no forman parte de esta capacidad.
- **H5.** Moneda y formato `es-PE`/PEN como ejemplo. Debe confirmarse.
- **H6.** No existe una librería de diseño corporativa confirmada, por lo que se usa CSS propio y mínimo con foco en accesibilidad (roles y contraste).

## Riesgos

| Riesgo | Mitigación |
|---|---|
| No se compila ni se ejecutan las pruebas en este host | Se entrega como *candidate*. El build y `ng test` quedan pendientes en CI y se declaran como no verificados en el *handoff*. |
| Desalineación de versiones (H2/H3) | Fijar versiones en `package.json` y documentarlas en el README. |
| Contrato de API desconocido | Aislarlo en D3 y documentar el contrato supuesto como hipótesis en el README. |
| Exposición de datos sensibles | Usar el PAN ya enmascarado en el modelo de vista, no persistir nada y no escribir datos en logs. |
| Sobre-fragmentación del patrón Atomic | Limitarse a los componentes listados y no crear átomos sin uso. |
