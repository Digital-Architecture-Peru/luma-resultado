# Build 604d6dbb-aed0-4490-9ebe-b8e47d63a225

Stack: Angular + Java + Spring Boot · capa Full Stack

Candidate generada por Microapp Builder; no es producción.

56 archivos; sintaxis verificada en 26/26; sin validador local: 30; pruebas incluidas; README incluido. Verificado de verdad: build correcto; pruebas unitarias correctas (10); [backend] maven build correcto; [backend] maven pruebas correctas (19); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática. (candidate).

Verificación: OK · build · pruebas unitarias (29) · dist/ incluido
Detalle de verificación: build correcto; pruebas unitarias correctas (10); [backend] maven build correcto; [backend] maven pruebas correctas (19); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática
Correcciones aplicadas: 1

Recursos incrustados en el builder (hash SHA-256):
- .github/agents/builder.agent.md 657aec3ce422
- .github/skills/stack-agnostic-blueprint/SKILL.md 185483967f7e

- backend/pom.xml: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/adapter/gateway/FakePaymentGateway.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/adapter/persistence/JdbcAccountRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/adapter/persistence/JdbcPaymentRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/adapter/web/AccountController.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/adapter/web/dto/AccountResponse.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/adapter/web/dto/CreatePaymentRequest.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/adapter/web/dto/PaymentResponse.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/adapter/web/ErrorHandler.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/adapter/web/PaymentController.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/application/PaymentCommand.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/application/PaymentErrors.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/application/PaymentService.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/application/ports/AccountRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/application/ports/PaymentGateway.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/application/ports/PaymentRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/domain/Account.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/domain/Payment.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/domain/PaymentStatus.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/payments/PaymentsApplication.java: sin verificar (sin validador local)
- backend/src/main/resources/application.yml: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V1__schema.sql: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V2__seed_ficticio.sql: sin verificar (sin validador local)
- backend/src/test/java/com/banco/payments/adapter/gateway/FakePaymentGatewayTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/banco/payments/adapter/web/PaymentControllerTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/banco/payments/application/PaymentServiceTest.java: sin verificar (sin validador local)
- docker-compose.yml: sin verificar (sin validador local)
- frontend/angular.json: sintaxis OK (JSON.parse)
- frontend/jest.config.js: sintaxis OK (node --check)
- frontend/package.json: sintaxis OK (JSON.parse)
- frontend/proxy.conf.json: sintaxis OK (JSON.parse)
- frontend/setup-jest.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/app.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/app.config.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/payments/atoms/amount-input.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/payments/atoms/app-button.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/payments/atoms/status-badge.component.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/payments/atoms/status-badge.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/payments/models/payment.models.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/payments/molecules/account-selector.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/payments/molecules/form-field.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/payments/organisms/payment-form.component.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/payments/organisms/payment-form.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/payments/organisms/payment-receipt.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/payments/pages/new-payment-page.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/payments/services/idempotency-key.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/payments/services/payment-api.service.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/payments/services/payment-api.service.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/payments/templates/payment-layout.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/index.html: sin verificar (sin validador local)
- frontend/src/main.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/styles.css: sin verificar (sin validador local)
- frontend/tsconfig.app.json: sintaxis OK (JSON.parse)
- frontend/tsconfig.json: sintaxis OK (JSON.parse)
- frontend/tsconfig.spec.json: sintaxis OK (JSON.parse)
- README.md: sin verificar (sin validador local)
