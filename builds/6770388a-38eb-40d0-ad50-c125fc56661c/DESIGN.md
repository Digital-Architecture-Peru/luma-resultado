# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Frontend
- Patrones disponibles API + eventos
- ¿Qué stack? React + TypeScript
- ¿Qué integración? Ninguna
- ¿Persistencia? No requiere
- ¿Qué pruebas? Estándar completo

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Microapp React/TypeScript para "Transacción" sobre Cuentas en Banca por Internet, capa Frontend.
- Datos ficticios en memoria; sin red, BD ni dependencias nuevas.
- Pantalla principal con el botón "Probar capacidad" visible al cargar; al pulsarlo muestra "Capacidad simulada" en un elemento role=status.
- Accesible (etiquetas, foco, contraste) y responsive.

## Hipótesis
- Stack (React + TypeScript), patrón (API + eventos), integración (Ninguna) y persistencia (No requiere) se documentan; React/TypeScript se valida con build y navegador.

## Aceptación
- tsc y build correctos, interacción real en navegador y smoke HTTP 200 del preview.
