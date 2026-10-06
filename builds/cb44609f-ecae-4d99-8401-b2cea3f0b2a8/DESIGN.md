# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Frontend
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular
- ¿Qué integración? Ninguna
- ¿Persistencia? No requiere
- ¿Qué pruebas? Estándar completo

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular (capa Frontend) para "Transacción" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración Ninguna y persistencia No requiere detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular sin compilarlo ni ejecutarlo en este host: solo se verifica sintaxis donde hay validador local; el resto queda sin verificar.
- Integración (Ninguna), persistencia (No requiere) y pruebas (Estándar completo) se implementan como candidate y requieren build real en CI.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Componentes *standalone* y rutas *lazy* (`loadComponent`) | Es el estándar actual de Angular, evita NgModules y aísla la capacidad. |
| D2 | Atomic Design: atoms → molecules → organisms → templates → pages | Es el patrón pedido. Solo las *pages* inyectan servicios y el resto es presentacional (`input`/`output`). |
| D3 | Puerto `AccountsGateway` (InjectionToken) con adaptador `InMemoryAccountsGateway` | La integración es Ninguna. El cambio a un backend real solo requiere otro proveedor y no toca la UI. |
| D4 | Estado en un servicio de *feature* con `signal`/`computed`, sin almacenamiento | La persistencia es No requiere. El estado se pierde al recargar. |
| D5 | Formularios reactivos tipados con validadores puros | Las reglas se pueden probar sin DOM: saldo suficiente, monto > 0 y cuenta origen distinta de destino. |
| D6 | Montos en céntimos (`number` entero) y formato con `CurrencyPipe` | Evita errores de coma flotante. |
| D7 | Flujo en 3 pasos: captura → confirmación → comprobante | Patrón habitual en banca. Reduce errores y permite bloquear el doble envío. |
| D8 | Config en `environments/*.ts` sin secretos | Sustituye a las variables de entorno en el front. Solo incluye flags como `useMockGateway`. |

## Estructura de módulos
```
src/app/
  core/accounts/        # model.ts, accounts.gateway.ts (token), in-memory.gateway.ts
  shared/ui/
    atoms/              # button, input-amount, label, badge
    molecules/          # form-field, account-option, amount-summary
    organisms/          # transfer-form, confirmation-panel, receipt-card
    templates/          # stepper-layout
  features/transfer/
    pages/transfer.page.ts
    state/transfer.store.ts
    validators/transfer.validators.ts
    transfer.routes.ts
  app.config.ts · app.routes.ts
src/environments/       # environment.ts, environment.development.ts
README.md · package.json · angular.json · tsconfig*.json
```
Cada archivo de UI, store y validador tiene su `*.spec.ts` al lado.

## Hipótesis adicionales
- **H1.** "Transacción sobre Cuentas" se interpreta como **transferencia entre cuentas propias** del cliente. Pagos a terceros quedan fuera de alcance.
- **H2.** Se usa Angular ≥ 17 con Jasmine/Karma, el runner por defecto del CLI.
- **H3.** "Estándar completo" se cubre con tres niveles:
  - pruebas unitarias de validadores, store y gateway;
  - pruebas de componentes con `TestBed` en atoms, molecules y organisms;
  - una prueba de integración de la *page*.

  Las pruebas E2E se documentan como pendientes.
- **H4.** No se implementan autenticación ni sesión. Se usa un cliente ficticio (`CLI-0001`) con 3 cuentas de datos inventados.
- **H5.** La moneda única es PEN, con locale `es-PE`. Es configurable.
- **H6.** La latencia y los errores del gateway se simulan para probar los estados de carga y de error.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| No se compila ni se ejecutan pruebas en este host | Estado *candidate*. La validación queda solo en sintaxis local y el build real en CI se documenta en el README. |
| Versiones de dependencias no resueltas | Rangos fijados en `package.json` y lockfile pendiente de generar en CI. |
| Interpretación errónea de "Transacción" (H1) | El puerto `AccountsGateway` permite añadir otros tipos sin rehacer la UI. |
| Doble envío o confirmación accidental | Botón deshabilitado durante el envío e id de operación idempotente en el mock. |
| Accesibilidad deficiente | Labels asociados, `aria-live` en errores y comprobante, foco gestionado entre pasos. |
| Sobrefragmentación de Atomic Design | Crear un atom solo si se reutiliza 2 o más veces. |

## Trazabilidad
- **T02:** D1 a D8.
- **T03:** archivos `.ts`, `.json` y `.html` verificables.
- **T04:** H3.
- **T05:** README con build, ejecución, integración Ninguna y persistencia No requiere.
- **T06:** el resumen declara lo no verificado (H2, compilación y pruebas sin ejecutar).

Los criterios de aceptación base no cambian.
