# Consulta de tarjetas · Banca por Internet

Aplicación frontend en Angular 18 (standalone components y signals) para consultar, buscar y filtrar tarjetas con datos ficticios. No realiza operaciones financieras ni se conecta a servicios bancarios. Estado candidate: no se declara compilada ni lista para producción hasta ejecutar las comprobaciones localmente.

## Requisitos

- Node.js compatible con Angular 18 (Node.js 18.19.1+, 20.11.1+ o 22+).
- npm.

## Instalar, ejecutar y compilar

Desde la raíz del proyecto:

```sh
npm install
npm start
```

Abre la URL que indique Angular CLI (por defecto `http://localhost:4200`). El servidor de desarrollo recompila al guardar cambios; detenerlo con Ctrl+C.

Para crear el build de producción:

```sh
npm run build
```

El resultado se genera en `dist/consulta-tarjetas`. Para ejecutar las pruebas unitarias una sola vez, sin modo interactivo:

```sh
npm test
```

## Pruebas

Vitest ejecuta pruebas de dominio (`card-format`, `card-query`) y del adaptador en memoria. Cubren formateo/validaciones, filtrado y comportamiento del repositorio. No hay pruebas de componentes con Angular TestBed ni pruebas de extremo a extremo.

## Arquitectura e integración

La UI sigue una composición por componentes (atoms, molecules, organisms y pages). El dominio mantiene el modelo `Card`, las funciones puras de formato y filtrado, y el puerto `CardRepository`. La página consume ese puerto mediante el token de inyección `CARD_REPOSITORY`; `src/app/app.config.ts` es el punto de composición y actualmente enlaza `InMemoryCardRepository`.

La integración con backend no está implementada ni definida. Para añadirla, crear un adaptador que implemente `CardRepository` (por ejemplo, uno HTTP que implemente `list(): Promise<Card[]>`), configurar el cliente HTTP y sustituir el proveedor en `app.config.ts`. Validar y mapear la respuesta externa a `Card` antes de entregarla al dominio, tratar errores de red/HTTP y evitar exponer datos sensibles en logs. No hay endpoint, autenticación, contrato de API ni variables de entorno de backend configurados en este proyecto.

## Persistencia y datos

No existe persistencia: el repositorio sirve desde memoria cuatro registros de demostración definidos en `src/app/adapters/in-memory-card.repository.ts`, con una demora simulada. Los cambios desaparecen al recargar. No se usa base de datos, `localStorage` ni almacenamiento remoto. Los números completos no forman parte del modelo: la interfaz presenta solo los últimos cuatro dígitos.

## Organización relevante

- `src/app/domain`: modelo, contrato del repositorio, filtrado y formato.
- `src/app/adapters`: repositorio en memoria y datos ficticios.
- `src/app/atoms`, `molecules`, `organisms`, `pages`: presentación.
- `src/app/app.config.ts`: proveedor concreto del repositorio.
