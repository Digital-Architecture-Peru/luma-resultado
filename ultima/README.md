# Banca por Internet · Consulta de tarjetas

Aplicación Angular 17 para consultar tarjetas ficticias. Es una capacidad de solo lectura: no realiza llamadas de red ni guarda datos en el navegador. El PAN se enmascara en la interfaz.

## Requisitos

- Node.js 18.19+ o 20+ y npm.
- Chrome o Chromium disponible para ejecutar las pruebas Karma en modo headless.

## Instalar, ejecutar y compilar

```sh
npm install
npm start
```

Abre <http://localhost:4200/tarjetas>. La ruta raíz y las rutas desconocidas redirigen a la consulta.

```sh
npm run build                 # compilación de producción (Angular CLI)
npm test                      # Jasmine/Karma, una pasada en ChromeHeadlessCI
```

`npm test` utiliza el lanzador `ChromeHeadless` configurado en `karma.conf.js`, con `--no-sandbox` y `--disable-gpu`; requiere un Chrome/Chromium compatible en el entorno. Las pruebas existentes cubren el repositorio ficticio, el enmascaramiento del PAN, el resumen de tarjeta y los estados de la página (carga, datos, vacío, error y selección). Para compilar o probar en CI sin navegador instalado, provisiona Chrome/Chromium; el proyecto no define un ejecutor alternativo.

## Organización

La funcionalidad vive en `src/app/features/tarjetas/`:

- `domain/`: modelo `Tarjeta` y tipos de estado/tipo.
- `data/`: contrato `TarjetasRepository` y `TarjetasMockRepository`.
- `pipes/`: enmascaramiento del PAN.
- `ui/`: componentes standalone organizados en átomos, moléculas, organismos, plantilla y página.

`src/app/app.config.ts` es el punto de composición: configura la ruta y vincula `TARJETAS_REPOSITORY` con el repositorio mock. El consumidor de datos depende del contrato abstracto, no directamente del mock.

## Integración con un servicio real

**No está implementada ni verificada.** No existe adaptador HTTP ni hay llamadas a un backend; `APP_CONFIG.apiBaseUrl` está vacío en ambos archivos de entorno y `useMock` es `true`. La página consume `TarjetasRepository.listar(): Observable<Tarjeta[]>`.

Como propuesta de integración, se podría implementar un `TarjetasHttpRepository` usando `HttpClient`, decodificar y validar la respuesta externa antes de convertirla al modelo `Tarjeta`, e intercambiar el proveedor en `app.config.ts`. El contrato tentativo descrito anteriormente sería `GET {apiBaseUrl}/tarjetas` con una respuesta JSON de tarjetas, pero aún debe acordarse con el backend (formato, errores, paginación y moneda). `APP_CONFIG` aporta `apiBaseUrl` y `useMock`, aunque actualmente la selección del proveedor no está condicionada por `useMock`.

La autenticación, autorización, sesión, renovación de credenciales, manejo de errores de transporte, CORS y política de reintentos no forman parte de esta aplicación: deberán integrarse con las convenciones y controles del shell/plataforma bancaria. No guardar credenciales en los archivos de entorno ni registrar PAN o información sensible. El PAN ficticio del modelo debe sustituirse por un identificador/token seguro del backend si ese dato no debe llegar al cliente.

## Persistencia y datos

No hay persistencia. El repositorio mock expone tres registros ficticios en memoria con una demora simulada; cada consulta devuelve copias para evitar modificar los datos de origen. No hay base de datos, `localStorage`, `sessionStorage` ni escrituras desde la interfaz. El dominio representa consulta únicamente.

Si se requiere almacenamiento en el futuro, definirlo con el backend y su contrato de seguridad; no persistir PAN ni datos de autenticación en el cliente. El modelo y la implementación mock actuales no constituyen un esquema ni una garantía de persistencia.

## Estado de verificación

La documentación refleja la inspección del código y sus scripts. No se ejecutaron `npm install`, `npm run build` ni `npm test` en este entorno; validar esos comandos en el entorno de desarrollo/CI antes de publicar.
