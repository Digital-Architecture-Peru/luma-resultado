# Build e471f66d-8fee-437a-aef5-cbd190fc5b38

Stack: Angular + Java + Spring Boot · capa Full Stack

Candidate generada por Microapp Builder; no es producción.

56 archivos; sintaxis verificada en 28/28; sin validador local: 28; pruebas incluidas; README incluido. Verificado de verdad: build correcto; pruebas unitarias correctas (10); [backend] maven build correcto; [backend] maven pruebas correctas (18); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática. (candidate).

Verificación: OK · build · pruebas unitarias (28) · dist/ incluido
Detalle de verificación: build correcto; pruebas unitarias correctas (10); [backend] maven build correcto; [backend] maven pruebas correctas (18); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática
Correcciones aplicadas: 0

Recursos incrustados en el builder (hash SHA-256):
- .github/agents/builder.agent.md 657aec3ce422
- .github/skills/stack-agnostic-blueprint/SKILL.md 185483967f7e

- backend/pom.xml: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/api/AccountController.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/api/ApiDtos.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/api/GlobalExceptionHandler.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/api/TransferController.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/application/AccountQueryService.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/application/TransferService.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/CuentasApplication.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/domain/Account.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/domain/AccountRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/domain/DomainException.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/domain/Movement.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/domain/MovementRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/domain/Transfer.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/domain/TransferRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/infrastructure/JpaAccountRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/infrastructure/JpaMovementRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/infrastructure/JpaTransferRepository.java: sin verificar (sin validador local)
- backend/src/main/resources/application.yml: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V1__schema.sql: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V2__seed_ficticio.sql: sin verificar (sin validador local)
- backend/src/test/java/com/example/cuentas/api/TransferControllerTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/example/cuentas/application/TransferServiceTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/example/cuentas/domain/AccountTest.java: sin verificar (sin validador local)
- docker-compose.yml: sin verificar (sin validador local)
- frontend/angular.json: sintaxis OK (JSON.parse)
- frontend/jest.config.js: sintaxis OK (node --check)
- frontend/package.json: sintaxis OK (JSON.parse)
- frontend/proxy.conf.json: sintaxis OK (JSON.parse)
- frontend/setup-jest.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/app.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/app.config.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/atoms/amount-input.component.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/atoms/amount-input.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/atoms/app-badge.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/atoms/app-button.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/core/account.service.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/core/customer.interceptor.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/core/models.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/core/transaction.store.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/core/transfer.service.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/core/transfer.service.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/molecules/account-select.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/molecules/form-field.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/organisms/movement-list.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/organisms/transfer-form.component.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/organisms/transfer-form.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/pages/transfer-page.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/templates/transaction-layout.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/index.html: sin verificar (sin validador local)
- frontend/src/main.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/styles.css: sin verificar (sin validador local)
- frontend/tsconfig.app.json: sintaxis OK (JSON.parse)
- frontend/tsconfig.json: sintaxis OK (JSON.parse)
- frontend/tsconfig.spec.json: sintaxis OK (JSON.parse)
- README.md: sin verificar (sin validador local)
