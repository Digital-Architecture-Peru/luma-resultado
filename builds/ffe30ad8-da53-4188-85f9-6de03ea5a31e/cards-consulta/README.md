# Consulta de Tarjetas (Banca por Internet) · Vue 3 + TypeScript

Capa Frontend, solo lectura, patrón Atomic Design. Estado: **candidate**.

## Comandos
```
npm ci        # o npm install (no hay lockfile en el repo)
npm run dev
npm run build # vue-tsc + vite build
npm test      # vitest (unitarias)
```

## Estructura
`src/components/{atoms,molecules,organisms,templates}`, `src/pages/CardsConsultaPage.vue`, `src/composables/useCards.ts`, `src/services/` (puerto `CardsRepository` + mock), `src/domain/`.

## Configuración
Copiar `.env.example` a `.env`. `VITE_CARDS_DATA_SOURCE=mock` (único valor soportado). Las variables `VITE_*` son públicas: no incluir secretos.

## Integración (sin definir)
No existe contrato de API. Implementar un `HttpCardsRepository` que cumpla `CardsRepository` y registrarlo en `repositoryFactory.ts`. Autenticación, enrutamiento y layout global los aporta la app host; se expone `CardsConsultaPage`.

## Persistencia (sin definir)
Solo lectura. No se guarda nada en almacenamiento local. El modelo solo contiene `last4`; nunca el PAN completo. Datos ficticios en `src/mocks`.

## Alcance e hipótesis
Listado y detalle (estado, límite, disponible). Movimientos fuera de alcance. Moneda por registro con `Intl.NumberFormat`. Estilos locales sin design system corporativo.

## No verificado
No se ejecutó instalación, compilación, `vue-tsc` ni pruebas en este host.
