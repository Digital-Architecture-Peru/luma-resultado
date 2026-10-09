# Build 50efa2ea-5dcf-46e1-ad80-b5fa40168d9b

Stack: React + TypeScript + Java + Spring Boot · capa Full Stack

Candidate generada por Microapp Builder; no es producción.

47 archivos; sintaxis verificada en 19/19; sin validador local: 28; pruebas incluidas; README incluido. Verificado de verdad: build correcto; pruebas unitarias correctas (9); [backend] maven build correcto; [backend] maven pruebas correctas (17); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática. (candidate).

Verificación: OK · build · pruebas unitarias (26) · dist/ incluido
Detalle de verificación: build correcto; pruebas unitarias correctas (9); [backend] maven build correcto; [backend] maven pruebas correctas (17); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática
Correcciones aplicadas: 1

Recursos incrustados en el builder (hash SHA-256):
- .github/agents/builder.agent.md 657aec3ce422
- .github/skills/stack-agnostic-blueprint/SKILL.md 185483967f7e

- backend/env.example.txt: sin verificar (sin validador local)
- backend/pom.xml: sin verificar (sin validador local)
- backend/src/main/java/com/example/payments/api/dto/CreatePaymentRequest.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/payments/api/dto/PaymentResponse.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/payments/api/ErrorHandler.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/payments/api/PaymentController.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/payments/application/CreatePaymentService.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/payments/application/IdempotencyConflictException.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/payments/application/PaymentNotFoundException.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/payments/application/PaymentQueryService.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/payments/domain/DuplicateIdempotencyKeyException.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/payments/domain/Money.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/payments/domain/Payment.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/payments/domain/PaymentGateway.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/payments/domain/PaymentRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/payments/domain/PaymentStatus.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/payments/infrastructure/FakePaymentGateway.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/payments/infrastructure/JdbcPaymentRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/payments/PaymentsApplication.java: sin verificar (sin validador local)
- backend/src/main/resources/application.yml: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V1__schema.sql: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V2__seed_ficticio.sql: sin verificar (sin validador local)
- backend/src/test/java/com/example/payments/application/CreatePaymentServiceTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/example/payments/domain/MoneyTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/example/payments/domain/PaymentTest.java: sin verificar (sin validador local)
- frontend/index.html: sin verificar (sin validador local)
- frontend/package.json: sintaxis OK (JSON.parse)
- frontend/src/components/atoms/Amount.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/Amount.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/Button.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/Input.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/AccountSelect.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/FormField.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/PaymentForm.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/PaymentForm.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/PaymentReceipt.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/templates/BankingLayout.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/main.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/pages/PaymentPage.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/pages/PaymentPage.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/services/paymentsApi.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/setupTests.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/styles.css: sin verificar (sin validador local)
- frontend/src/types.ts: sintaxis OK (typescript.transpileModule)
- frontend/tsconfig.json: sintaxis OK (JSON.parse)
- frontend/vite.config.ts: sintaxis OK (typescript.transpileModule)
- README.md: sin verificar (sin validador local)
