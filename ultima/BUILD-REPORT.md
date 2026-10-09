# Build 547f0746-0814-457c-92d7-92afd0ef8cf2

Stack: React + TypeScript + Java + Spring Boot · capa Full Stack

Candidate generada por Microapp Builder; no es producción.

49 archivos; sintaxis verificada en 20/20; sin validador local: 29; pruebas incluidas; README incluido. Verificado de verdad: build correcto; pruebas unitarias correctas (19); [backend] maven build correcto; [backend] maven pruebas correctas (8); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática. (candidate).

Verificación: OK · build · pruebas unitarias (27) · dist/ incluido
Detalle de verificación: build correcto; pruebas unitarias correctas (19); [backend] maven build correcto; [backend] maven pruebas correctas (8); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática
Correcciones aplicadas: 0

Recursos incrustados en el builder (hash SHA-256):
- .github/agents/builder.agent.md 657aec3ce422
- .github/skills/stack-agnostic-blueprint/SKILL.md 185483967f7e

- backend/pom.xml: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/AccountsApplication.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/api/AccountController.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/api/AccountResponse.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/api/ApiExceptionHandler.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/api/MovementResponse.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/api/TransferController.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/api/TransferRequest.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/api/TransferResponse.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/application/AccountQueryService.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/application/TransferService.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/domain/Account.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/domain/AccountRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/domain/BusinessRuleException.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/domain/CoreBankingPort.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/domain/Movement.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/domain/Transfer.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/domain/TransferCommand.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/domain/TransferRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/infrastructure/corebanking/FakeCoreBankingAdapter.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/infrastructure/persistence/JdbcAccountRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/accounts/infrastructure/persistence/JdbcTransferRepository.java: sin verificar (sin validador local)
- backend/src/main/resources/application.yml: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V1__schema.sql: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V2__seed_ficticio.sql: sin verificar (sin validador local)
- backend/src/test/java/com/example/accounts/application/TransferServiceTest.java: sin verificar (sin validador local)
- frontend/index.html: sin verificar (sin validador local)
- frontend/package.json: sintaxis OK (JSON.parse)
- frontend/src/api/transfersClient.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/Button.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/TextInput.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/AccountSelect.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/AmountInput.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/FormField.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/TransferForm.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/templates/PageTemplate.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/hooks/useTransfer.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/lib/amount.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/main.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/pages/TransferPage.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/styles.css: sin verificar (sin validador local)
- frontend/src/types/index.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/vite-env.d.ts: sintaxis OK (typescript.createSourceFile)
- frontend/src/__tests__/amount.test.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/__tests__/AmountInput.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/__tests__/TransferForm.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/tsconfig.json: sintaxis OK (JSON.parse)
- frontend/vite.config.ts: sintaxis OK (typescript.transpileModule)
- README.md: sin verificar (sin validador local)
