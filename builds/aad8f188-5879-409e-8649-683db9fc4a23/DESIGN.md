# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Portal web
- ¿Qué tipo de capacidad? Formulario
- ¿Sobre qué dominio? Clientes
- ¿Qué necesitas construir? Frontend
- Patrones disponibles Componentes
- ¿Qué stack? React + TypeScript
- ¿Qué integración? Datos mock
- ¿Persistencia? En memoria
- ¿Qué pruebas? Navegador

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Microapp React/TypeScript para "Formulario" sobre Clientes en Portal web, capa Frontend.
- Datos ficticios en memoria; sin red, BD ni dependencias nuevas.
- Pantalla principal con el botón "Probar capacidad" visible al cargar; al pulsarlo muestra "Capacidad simulada" en un elemento role=status.
- Accesible (etiquetas, foco, contraste) y responsive.

## Hipótesis
- Stack (React + TypeScript), patrón (Componentes), integración (Datos mock) y persistencia (En memoria) se documentan; solo React/TypeScript se valida aquí.

## Aceptación
- tsc y build correctos, interacción real en navegador y smoke HTTP 200 del preview.
