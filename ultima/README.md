# Portal empresas · Consulta de tarjetas

Aplicación frontend Angular 18 standalone para consultar tarjetas empresariales ficticias. La interfaz permite buscar por titular, marca o últimos cuatro dígitos, y filtrar por estado. Los componentes siguen una organización Atomic Design; los datos se obtienen a través del puerto `CardRepository`.

## Requisitos

- Node.js compatible con Angular 18 (por ejemplo, Node.js 20).
- npm.

## Instalar, ejecutar y compilar

Desde la raíz del proyecto:

```sh
npm install
npm start
```

El servidor de desarrollo de Angular queda disponible normalmente en `http://localhost:4200/` y recarga los cambios. Para generar el bundle de producción:

```sh
npm run build
```

La salida se genera en `dist/consulta-tarjetas/`. El build utiliza la configuración de producción predeterminada de `angular.json`.

## Pruebas

Ejecuta la suite Jest en modo CI, sin modo interactivo:

```sh
npm test
```

Las pruebas cubren el filtrado puro (texto, acentos, estado y últimos cuatro dígitos), el enmascaramiento del número y los estados principales de la página, incluida la respuesta vacía y el error del repositorio.

## Organización relevante

- `src/app/domain/`: modelo de tarjeta, consulta/filtros y puerto abstracto `CardRepository`.
- `src/app/infrastructure/in-memory-card.repository.ts`: adaptador actual con datos ficticios.
- `src/app/pages/`: página contenedora, carga y estado de la consulta.
- `src/app/atoms/`, `molecules/` y `organisms/`: componentes de presentación.
- `src/app/app.config.ts`: composición de dependencias; enlaza `CardRepository` con `InMemoryCardRepository`.

## Integración y persistencia

Actualmente no hay backend ni persistencia: el repositorio en memoria devuelve un conjunto estático ficticio y los cambios no sobreviven a una recarga. La interfaz depende de `CardRepository`, un puerto que expone `list(): Observable<Card[]>`; para conectar un servicio real:

1. Crear un adaptador HTTP que implemente `CardRepository`, usando `HttpClient` y transformando/validando la respuesta para ajustarla al modelo `Card`.
2. Habilitar `provideHttpClient()` en la configuración de Angular y sustituir en `src/app/app.config.ts` el proveedor en memoria por el adaptador HTTP.
3. Obtener la URL del servicio mediante configuración de despliegue adecuada para frontend (por ejemplo, configuración pública por entorno); las variables incluidas en un bundle de navegador no son secretas. No almacenar credenciales, tokens privados ni datos sensibles en el cliente.
4. Definir y documentar por separado el contrato del API, autenticación, autorización, manejo de errores y la estrategia de persistencia del lado servidor. Nada de esto está implementado en este proyecto.

Por seguridad, el modelo y los ejemplos contienen solo `last4`; no se debe enviar ni guardar el número completo de la tarjeta en esta aplicación. Los datos ficticios no representan datos de clientes.

## Estado de verificación

No se ejecutaron instalación, build ni pruebas al preparar este README; verifícalos en el entorno del proyecto con los comandos anteriores.
