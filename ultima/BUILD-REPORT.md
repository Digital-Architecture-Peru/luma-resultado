# Build b5ef561c-82ea-412c-a37e-512b3e005a89

Stack: Angular + Java + Quarkus · capa Full Stack

Candidate generada por Microapp Builder; no es producción.

52 archivos; sintaxis verificada en 25/25; sin validador local: 27; pruebas incluidas; README incluido. Verificado de verdad: build correcto; pruebas unitarias correctas (11); [backend] maven build correcto; [backend] maven pruebas correctas (22); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática. (candidate).

Verificación: OK · build · pruebas unitarias (33) · dist/ incluido
Detalle de verificación: build correcto; pruebas unitarias correctas (11); [backend] maven build correcto; [backend] maven pruebas correctas (22); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática
Correcciones aplicadas: 1

Recursos incrustados en el builder (hash SHA-256):
- .github/agents/builder.agent.md 657aec3ce422
- .github/skills/stack-agnostic-blueprint/SKILL.md 185483967f7e

- backend/pom.xml: sin verificar (sin validador local)
- backend/src/main/java/com/banco/pagos/api/ErrorMapper.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/pagos/api/PagoRequest.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/pagos/api/PagoResource.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/pagos/api/PagoResponse.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/pagos/application/ConsultarPagoUseCase.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/pagos/application/RegistrarPagoUseCase.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/pagos/domain/EstadoPago.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/pagos/domain/Pago.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/pagos/domain/PagoException.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/pagos/domain/PagoRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/pagos/domain/PasarelaPagoPort.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/pagos/domain/ReglasPago.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/pagos/infrastructure/PagoEntity.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/pagos/infrastructure/PagoJpaRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/pagos/infrastructure/PasarelaPagoStub.java: sin verificar (sin validador local)
- backend/src/main/resources/application.properties: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V1__esquema.sql: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V2__datos_ficticios.sql: sin verificar (sin validador local)
- backend/src/test/java/com/banco/pagos/api/PagoResourceTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/banco/pagos/application/RegistrarPagoUseCaseTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/banco/pagos/domain/ReglasPagoTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/banco/pagos/infrastructure/PasarelaPagoStubTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/banco/pagos/support/InMemoryPagoRepository.java: sin verificar (sin validador local)
- frontend/angular.json: sintaxis OK (JSON.parse)
- frontend/package.json: sintaxis OK (JSON.parse)
- frontend/proxy.conf.json: sintaxis OK (JSON.parse)
- frontend/src/app/app.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/app.config.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/app.routes.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/pagos/atoms/boton.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/pagos/atoms/etiqueta-estado.component.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/pagos/atoms/etiqueta-estado.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/pagos/atoms/input-monto.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/pagos/molecules/campo-cuenta.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/pagos/molecules/resumen-importe.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/pagos/organisms/detalle-pago.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/pagos/organisms/formulario-pago.component.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/pagos/organisms/formulario-pago.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/pagos/pages/confirmacion.page.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/pagos/pages/nuevo-pago.page.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/pagos/pago.model.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/pagos/services/pagos-api.service.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/pagos/services/pagos-api.service.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/pagos/templates/layout-transaccion.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/index.html: sin verificar (sin validador local)
- frontend/src/main.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/styles.css: sin verificar (sin validador local)
- frontend/tsconfig.app.json: sintaxis OK (JSON.parse)
- frontend/tsconfig.json: sintaxis OK (JSON.parse)
- frontend/tsconfig.spec.json: sintaxis OK (JSON.parse)
- README.md: sin verificar (sin validador local)
