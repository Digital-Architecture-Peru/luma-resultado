# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Frontend
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Vue 3 + TypeScript
- ¿Qué integración? Ninguna
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Estándar completo

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Vue 3 + TypeScript (capa Frontend) para "Consulta" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración Ninguna y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Vue 3 + TypeScript sin compilarlo ni ejecutarlo en este host: solo se verifica sintaxis donde hay validador local; el resto queda sin verificar.
- Integración (Ninguna), persistencia (PostgreSQL) y pruebas (Estándar completo) se implementan como candidate y requieren build real en CI.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN · Refinamiento: Consulta de Cuentas (Vue 3 + TypeScript)

> Complementa el diseño base. Mantiene sus Hechos, su Contexto SGC (fallback) y sus criterios de Aceptación.

## 1. Decisiones de arquitectura

| # | Decisión | Justificación |
|---|---|---|
| D1 | Vite + Vue 3 SFC con `<script setup lang="ts">` y TS `strict` | Es la cadena idiomática de Vue 3. Con tipado estricto, los errores aparecen en CI. |
| D2 | Atomic Design en `components/atoms → molecules → organisms → templates → pages` | Es el patrón elegido. Regla: solo la *page* conoce el dominio y los datos. Átomos y moléculas reciben únicamente props y emiten eventos. |
| D3 | **El frontend no accede a PostgreSQL.** La persistencia queda detrás del puerto `AccountRepository` (solo lectura: `list(filter)`, `getById(id)`). | Un navegador no debe conectarse a una BD. PostgreSQL vive detrás de un backend/BFF que está fuera de alcance. |
| D4 | Adaptador único `InMemoryAccountRepository` con datos ficticios | La integración elegida es "Ninguna". El contrato HTTP futuro solo se documenta en el README y no se implementa. |
| D5 | Inyección del repositorio con `provide/inject` y un `InjectionKey` tipado | Permite cambiar de adaptador sin tocar componentes y simplifica las pruebas con repositorios falsos. |
| D6 | Estado con el composable `useAccounts`, sin Pinia ni vue-router | Hay una sola vista: lista con filtro y detalle. Menos dependencias implica menos superficie de riesgo. |
| D7 | Montos en unidades menores (enteros) + código ISO 4217, formateados con `Intl.NumberFormat` | Evita errores de punto flotante en saldos. |
| D8 | Seguridad UI: número de cuenta enmascarado (solo los últimos 4 dígitos), sin `v-html`, sin `localStorage`, `.env.example` solo con variables `VITE_*` no sensibles | Contexto bancario. Las variables `VITE_*` son públicas en el bundle. |
| D9 | Estados explícitos `loading / empty / error / success`, con `aria-live` en loading y error | Ofrece una UX predecible y accesible. Cada estado es comprobable por el tester. |
| D10 | Vitest + jsdom + `@vue/test-utils` | Es el runner nativo del ecosistema Vite y cubre el nivel "Estándar completo" (ver H5). |

## 2. Estructura de módulos

```
consulta-cuentas/
├─ package.json · tsconfig.json · vite.config.ts · index.html
├─ .env.example                 # VITE_APP_LOCALE, sin secretos
├─ README.md                    # build, ejecución, integración, persistencia
├─ docs/postgresql-reference.sql  # esquema de referencia, no ejecutado
├─ src/
│  ├─ main.ts · App.vue         # provide(AccountRepositoryKey, new InMemory…)
│  ├─ domain/account.ts         # Account, AccountType, Money, AccountFilter
│  ├─ domain/format.ts          # maskAccountNumber, formatMoney
│  ├─ ports/AccountRepository.ts
│  ├─ adapters/InMemoryAccountRepository.ts
│  ├─ fixtures/accounts.ts      # datos ficticios
│  ├─ composables/useAccounts.ts
│  └─ components/
│     ├─ atoms/      BaseAmount · MaskedNumber · BaseBadge · BaseSpinner
│     ├─ molecules/  AccountCard · AccountTypeFilter · StatusMessage
│     ├─ organisms/  AccountList · AccountDetailPanel
│     ├─ templates/  ConsultaLayout
│     └─ pages/      ConsultaCuentasPage
└─ tests/
   ├─ unit/        format · InMemoryAccountRepository · useAccounts
   └─ components/  atoms · AccountList · ConsultaCuentasPage (4 estados)
```

## 3. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Interpretar "PostgreSQL" como acceso directo desde el frontend | Alto (seguridad) | Aplicar D3. Verificar que no haya dependencias `pg` o ORM en `src/`. |
| Archivos `.vue` sin un validador local de sintaxis | Medio | Validar los `.ts` en local. La validación de SFC con `vue-tsc` queda en CI y se declara como no verificada. |
| Dependencias no instaladas ni resueltas en este host | Medio | Usar rangos de versión conservadores. Se requiere `npm install` y build en CI. |
| SGC en fallback: no se aplica el design system ni la normativa corporativa | Medio | Usar estilos mínimos y aislados, fáciles de sustituir. Revisión posterior con SGC. |
| Formas de integración con el host de Banca por Internet desconocidas | Medio | La page queda autocontenida y el repositorio es inyectable (ver H3). |
| Supuestos de locale y moneda incorrectos | Bajo | Locale configurable por `VITE_APP_LOCALE` (ver H4). |

## 4. Hipótesis explícitas

- **H1.** "Consulta" significa solo lectura: listar cuentas, filtrar por tipo y ver el detalle. No hay operaciones de escritura.
- **H2.** La persistencia PostgreSQL pertenece a un backend futuro. Aquí solo se entregan el puerto, el contrato documentado (`GET /cuentas`, `GET /cuentas/{id}`) y el esquema de referencia, sin ejecutarlos.
- **H3.** La capacidad se entrega como app Vite independiente. Su encaje en el shell de Banca por Internet (ruta, micro-frontend o librería) está por definir.
- **H4.** El locale y las monedas son configurables. Los fixtures usan códigos ISO 4217 genéricos, sin suponer un país.
- **H5.** "Estándar completo" equivale a pruebas unitarias, de componente y de integración de la page con un repositorio falso. Las pruebas E2E quedan documentadas como pendientes.
- **H6.** Los tipos de cuenta en los fixtures (p. ej. ahorro y corriente) son ilustrativos y no catálogo oficial.
- **H7.** La autenticación y la sesión las provee el host y están fuera de alcance.

## 5. Criterios complementarios de verificación

Estos criterios no reemplazan la Aceptación base:
- `ConsultaCuentasPage` muestra los 4 estados (D9) y una prueba cubre cada uno.
- Ningún número de cuenta se renderiza completo. Lo verifican pruebas de `MaskedNumber` y `AccountCard`.
- `src/` no importa drivers de base de datos ni contiene URLs reales o secretos.
- El README declara qué se verificó (sintaxis `.ts`) y qué no (build, `vue-tsc`, ejecución de pruebas, integración con el host).
