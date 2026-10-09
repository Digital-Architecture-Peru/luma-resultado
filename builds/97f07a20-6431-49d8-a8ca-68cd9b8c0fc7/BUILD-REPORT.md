# Build 97f07a20-6431-49d8-a8ca-68cd9b8c0fc7

Stack: React + TypeScript + Java + Quarkus · capa Full Stack

Candidate generada por Microapp Builder; no es producción.

51 archivos; sintaxis verificada en 21/21; sin validador local: 30; pruebas incluidas; README incluido. Verificado de verdad: build correcto; pruebas unitarias correctas (16); [backend] maven build correcto; [backend] maven pruebas correctas (13); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática. (candidate).

Verificación: OK · build · pruebas unitarias (29) · dist/ incluido
Detalle de verificación: build correcto; pruebas unitarias correctas (16); [backend] maven build correcto; [backend] maven pruebas correctas (13); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática
Correcciones aplicadas: 1

Recursos incrustados en el builder (hash SHA-256):
- .github/agents/builder.agent.md 657aec3ce422
- .github/skills/stack-agnostic-blueprint/SKILL.md 185483967f7e

- backend/pom.xml: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/api/AccountResource.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/api/ClockProducer.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/api/dto/TransferRequest.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/api/ProblemMapper.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/api/TransferResource.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/domain/Account.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/domain/AccountNotFoundException.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/domain/DomainException.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/domain/IdempotencyConflictException.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/domain/InsufficientFundsException.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/domain/Movement.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/domain/MovementType.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/domain/TransferCommand.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/domain/TransferReceipt.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/domain/ValidationException.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/integration/CoreBankingGateway.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/integration/StubCoreBankingGateway.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/repository/AccountRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/repository/JdbcAccountRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/service/TransferService.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/cuentas/service/TransferValidator.java: sin verificar (sin validador local)
- backend/src/main/resources/application.properties: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V1__schema.sql: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V2__seed_ficticio.sql: sin verificar (sin validador local)
- backend/src/test/java/com/banco/cuentas/service/InMemoryAccountRepository.java: sin verificar (sin validador local)
- backend/src/test/java/com/banco/cuentas/service/TransferServiceTest.java: sin verificar (sin validador local)
- frontend/index.html: sin verificar (sin validador local)
- frontend/package.json: sintaxis OK (JSON.parse)
- frontend/src/components/atoms/AmountInput.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/Button.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/Input.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/Label.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/AccountSelector.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/FormField.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/MovementList.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/TransferForm.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/TransferForm.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/TransferReceipt.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/templates/TransactionLayout.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/domain/types.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/domain/validation.test.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/domain/validation.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/main.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/pages/TransferPage.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/services/accountsApi.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/setupTests.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/styles.css: sin verificar (sin validador local)
- frontend/tsconfig.json: sintaxis OK (JSON.parse)
- frontend/vite.config.ts: sintaxis OK (typescript.transpileModule)
- README.md: sin verificar (sin validador local)
