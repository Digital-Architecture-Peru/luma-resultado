# Build 16ac5efa-2519-4c90-a0f1-c8436249f7f6

Stack: Angular + Java + Quarkus · capa Full Stack

Candidate generada por Microapp Builder; no es producción.

55 archivos; sintaxis verificada en 28/28; sin validador local: 27; pruebas incluidas; README incluido. Verificado de verdad: build correcto; pruebas unitarias correctas (25); [backend] maven build correcto; [backend] maven pruebas correctas (16); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática. (candidate).

Verificación: OK · build · pruebas unitarias (41) · dist/ incluido
Detalle de verificación: build correcto; pruebas unitarias correctas (25); [backend] maven build correcto; [backend] maven pruebas correctas (16); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática
Correcciones aplicadas: 0

Recursos incrustados en el builder (hash SHA-256):
- .github/agents/builder.agent.md 657aec3ce422
- .github/skills/stack-agnostic-blueprint/SKILL.md 185483967f7e

- backend/pom.xml: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/api/AccountResource.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/api/ApiDtos.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/api/DomainExceptionMapper.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/api/TransferResource.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/domain/Account.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/domain/AccountService.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/domain/DomainException.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/domain/Movement.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/domain/Transfer.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/domain/TransferCommand.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/domain/TransferService.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/persistence/AccountRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/persistence/pg/PgAccountRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/persistence/pg/PgTransferRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/persistence/TransferRepository.java: sin verificar (sin validador local)
- backend/src/main/resources/application.properties: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V1__schema.sql: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V2__seed_ficticio.sql: sin verificar (sin validador local)
- backend/src/test/java/com/banco/cuentas/domain/AccountServiceTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/banco/cuentas/domain/TransferServiceTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/banco/cuentas/fakes/InMemoryAccountRepository.java: sin verificar (sin validador local)
- backend/src/test/java/com/banco/cuentas/fakes/InMemoryTransferRepository.java: sin verificar (sin validador local)
- docs/ENV.md: sin verificar (sin validador local)
- frontend/angular.json: sintaxis OK (JSON.parse)
- frontend/package.json: sintaxis OK (JSON.parse)
- frontend/proxy.conf.json: sintaxis OK (JSON.parse)
- frontend/setup-jest.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/app.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/app.config.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/atoms/amount-input.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/atoms/amount-input.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/atoms/amount.validator.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/atoms/app-button.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/atoms/field-error.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/core/accounts.service.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/core/api-config.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/core/idempotency.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/core/models.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/core/services.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/core/transfers.service.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/molecules/account-selector.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/molecules/amount-field.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/organisms/movements-table.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/organisms/transfer-form.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/organisms/transfer-form.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/pages/transfer-page.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/templates/transaction-layout.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/index.html: sin verificar (sin validador local)
- frontend/src/main.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/styles.css: sin verificar (sin validador local)
- frontend/tsconfig.app.json: sintaxis OK (JSON.parse)
- frontend/tsconfig.json: sintaxis OK (JSON.parse)
- frontend/tsconfig.spec.json: sintaxis OK (JSON.parse)
- README.md: sin verificar (sin validador local)
