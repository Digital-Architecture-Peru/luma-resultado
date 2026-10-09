# Build 3a516915-a3cf-42cd-9d95-4c89bfc2af4e

Stack: React + TypeScript + .NET · capa Full Stack

Candidate generada por Microapp Builder; no es producción.

49 archivos; sintaxis verificada en 24/24; sin validador local: 25; pruebas incluidas; README incluido. Verificado de verdad: build correcto; pruebas unitarias correctas (10); [backend] dotnet build correcto; [backend] dotnet pruebas correctas; dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática. (candidate).

Verificación: OK · build · pruebas unitarias (10) · dist/ incluido
Detalle de verificación: build correcto; pruebas unitarias correctas (10); [backend] dotnet build correcto; [backend] dotnet pruebas correctas; dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática
Correcciones aplicadas: 0

Recursos incrustados en el builder (hash SHA-256):
- .github/agents/builder.agent.md 657aec3ce422
- .github/skills/stack-agnostic-blueprint/SKILL.md 185483967f7e

- backend/Payments.sln: sin verificar (sin validador local)
- backend/src/Payments.Api/appsettings.json: sintaxis OK (JSON.parse)
- backend/src/Payments.Api/Contracts.cs: sin verificar (sin validador local)
- backend/src/Payments.Api/ErrorHandlingMiddleware.cs: sin verificar (sin validador local)
- backend/src/Payments.Api/Payments.Api.csproj: sin verificar (sin validador local)
- backend/src/Payments.Api/Program.cs: sin verificar (sin validador local)
- backend/src/Payments.Application/IdempotencyConflictException.cs: sin verificar (sin validador local)
- backend/src/Payments.Application/Payments.Application.csproj: sin verificar (sin validador local)
- backend/src/Payments.Application/PaymentService.cs: sin verificar (sin validador local)
- backend/src/Payments.Application/Ports.cs: sin verificar (sin validador local)
- backend/src/Payments.Domain/Payment.cs: sin verificar (sin validador local)
- backend/src/Payments.Domain/Payments.Domain.csproj: sin verificar (sin validador local)
- backend/src/Payments.Infrastructure/FakePaymentGateway.cs: sin verificar (sin validador local)
- backend/src/Payments.Infrastructure/PaymentRepository.cs: sin verificar (sin validador local)
- backend/src/Payments.Infrastructure/Payments.Infrastructure.csproj: sin verificar (sin validador local)
- backend/tests/Payments.UnitTests/Fakes.cs: sin verificar (sin validador local)
- backend/tests/Payments.UnitTests/Payments.UnitTests.csproj: sin verificar (sin validador local)
- backend/tests/Payments.UnitTests/PaymentServiceTests.cs: sin verificar (sin validador local)
- backend/tests/Payments.UnitTests/PaymentTests.cs: sin verificar (sin validador local)
- db/migrations/V001__schema.sql: sin verificar (sin validador local)
- db/migrations/V002__seed.sql: sin verificar (sin validador local)
- docker-compose.yml: sin verificar (sin validador local)
- env.example.txt: sin verificar (sin validador local)
- frontend/index.html: sin verificar (sin validador local)
- frontend/package.json: sintaxis OK (JSON.parse)
- frontend/src/components/atoms/AmountInput.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/Button.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/TextInput.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/AccountSelector.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/FormField.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/PaymentForm.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/PaymentSummary.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/templates/PaymentTemplate.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/hooks/useAccounts.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/hooks/usePayment.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/main.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/pages/PaymentPage.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/services/paymentsApi.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/setupTests.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/styles.css: sin verificar (sin validador local)
- frontend/src/types.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/utils/amount.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/vite-env.d.ts: sintaxis OK (typescript.createSourceFile)
- frontend/src/__tests__/AmountInput.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/__tests__/PaymentForm.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/__tests__/usePayment.test.ts: sintaxis OK (typescript.transpileModule)
- frontend/tsconfig.json: sintaxis OK (JSON.parse)
- frontend/vite.config.ts: sintaxis OK (typescript.transpileModule)
- README.md: sin verificar (sin validador local)
