# Build d3539007-1651-4570-8c36-1fc4403bc751

Stack: Angular + Java + Spring Boot · capa Full Stack

Candidate generada por Microapp Builder; no es producción.

51 archivos; sintaxis verificada en 23/23; sin validador local: 28; pruebas incluidas; README incluido. Verificado de verdad: build correcto; pruebas unitarias correctas (7); [backend] maven build correcto; [backend] maven pruebas correctas (15); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática. (candidate).

Verificación: OK · build · pruebas unitarias (22) · dist/ incluido
Detalle de verificación: build correcto; pruebas unitarias correctas (7); [backend] maven build correcto; [backend] maven pruebas correctas (15); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática
Correcciones aplicadas: 1

Recursos incrustados en el builder (hash SHA-256):
- .github/agents/builder.agent.md 657aec3ce422
- .github/skills/stack-agnostic-blueprint/SKILL.md 185483967f7e

- backend/pom.xml: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/adapters/in/web/CardTransactionController.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/adapters/in/web/dto/CreateTransactionRequest.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/adapters/in/web/dto/ResponseDtos.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/adapters/in/web/GlobalExceptionHandler.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/adapters/out/network/StubCardNetworkAdapter.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/adapters/out/persistence/JdbcCardTransactionRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/application/BusinessRuleException.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/application/CardNotFoundException.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/application/CardQueryService.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/application/CreateTransactionCommand.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/application/CreateTransactionUseCase.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/application/IdempotencyConflictException.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/application/port/CardNetworkPort.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/application/port/CardTransactionRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/CardsApplication.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/domain/Card.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/domain/CardTransaction.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/domain/TransactionStatus.java: sin verificar (sin validador local)
- backend/src/main/resources/application.yml: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V1__schema.sql: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V2__seed_ficticio.sql: sin verificar (sin validador local)
- backend/src/test/java/com/bank/cards/adapters/in/web/CardTransactionControllerTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/bank/cards/adapters/out/network/StubCardNetworkAdapterTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/bank/cards/application/CreateTransactionUseCaseTest.java: sin verificar (sin validador local)
- frontend/angular.json: sintaxis OK (JSON.parse)
- frontend/jest.config.js: sintaxis OK (node --check)
- frontend/package.json: sintaxis OK (JSON.parse)
- frontend/proxy.conf.json: sintaxis OK (JSON.parse)
- frontend/setup-jest.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/app.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/features/card-transaction/models/card-transaction.models.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/features/card-transaction/pages/card-transaction-page.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/features/card-transaction/services/card-transaction.service.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/features/card-transaction/services/card-transaction.service.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/shared/ui/atoms/app-alert.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/shared/ui/atoms/app-button.component.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/shared/ui/atoms/app-button.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/shared/ui/molecules/card-summary.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/shared/ui/molecules/form-field.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/shared/ui/organisms/transaction-form.component.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/shared/ui/organisms/transaction-form.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/shared/ui/organisms/transaction-history.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/shared/ui/templates/transaction-template.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/index.html: sin verificar (sin validador local)
- frontend/src/main.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/styles.css: sin verificar (sin validador local)
- frontend/tsconfig.app.json: sintaxis OK (JSON.parse)
- frontend/tsconfig.json: sintaxis OK (JSON.parse)
- frontend/tsconfig.spec.json: sintaxis OK (JSON.parse)
- README.md: sin verificar (sin validador local)
