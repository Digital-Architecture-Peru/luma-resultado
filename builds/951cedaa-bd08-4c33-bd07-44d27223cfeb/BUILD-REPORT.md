# Build 951cedaa-bd08-4c33-bd07-44d27223cfeb

Stack: React + TypeScript + Java + Quarkus · capa Full Stack

Candidate generada por Microapp Builder; no es producción.

46 archivos; sintaxis verificada en 21/21; sin validador local: 25; pruebas incluidas; README incluido. Verificado de verdad: build correcto; pruebas unitarias correctas (15); [backend] maven build correcto; [backend] maven pruebas correctas (15); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática. (candidate).

Verificación: OK · build · pruebas unitarias (30) · dist/ incluido
Detalle de verificación: build correcto; pruebas unitarias correctas (15); [backend] maven build correcto; [backend] maven pruebas correctas (15); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática
Correcciones aplicadas: 2

Recursos incrustados en el builder (hash SHA-256):
- .github/agents/builder.agent.md 657aec3ce422
- .github/skills/stack-agnostic-blueprint/SKILL.md 185483967f7e

- backend/pom.xml: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/api/ApiExceptionMappers.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/api/PaymentRequest.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/api/PaymentResource.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/api/PaymentResponse.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/application/CreatePaymentCommand.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/application/PaymentGateway.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/application/PaymentService.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/domain/DuplicateIdempotencyKeyException.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/domain/InvalidPaymentException.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/domain/Payment.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/domain/PaymentNotFoundException.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/domain/PaymentRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/domain/PaymentStatus.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/infrastructure/JdbcPaymentRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/infrastructure/LocalPaymentGateway.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/infrastructure/PaymentPersistenceException.java: sin verificar (sin validador local)
- backend/src/main/resources/application.properties: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V1__schema.sql: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V2__seed.sql: sin verificar (sin validador local)
- backend/src/test/java/com/banco/payments/application/PaymentServiceTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/banco/payments/domain/PaymentTest.java: sin verificar (sin validador local)
- frontend/index.html: sin verificar (sin validador local)
- frontend/package.json: sintaxis OK (JSON.parse)
- frontend/src/api/paymentsClient.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/Button.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/Input.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/Select.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/FormField.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/PaymentForm.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/PaymentForm.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/PaymentResult.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/templates/PageTemplate.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/hooks/usePayment.test.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/hooks/usePayment.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/main.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/pages/PaymentPage.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/setupTests.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/styles.css: sin verificar (sin validador local)
- frontend/src/types.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/validation.test.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/validation.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/vite-env.d.ts: sintaxis OK (typescript.createSourceFile)
- frontend/tsconfig.json: sintaxis OK (JSON.parse)
- frontend/vite.config.ts: sintaxis OK (typescript.transpileModule)
- README.md: sin verificar (sin validador local)
