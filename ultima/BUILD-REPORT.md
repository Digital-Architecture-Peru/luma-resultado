# Build 9ff35d8d-cf5c-424b-ac42-538cc0f2ad04

Stack: React + TypeScript + Java + Spring Boot · capa Full Stack

Candidate generada por Microapp Builder; no es producción.

45 archivos; sintaxis verificada en 23/23; sin validador local: 22; pruebas incluidas; README incluido. Verificado de verdad: build correcto; pruebas unitarias correctas (15); [backend] maven build correcto; [backend] maven pruebas correctas (9); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática. (candidate).

Verificación: OK · build · pruebas unitarias (24) · dist/ incluido
Detalle de verificación: build correcto; pruebas unitarias correctas (15); [backend] maven build correcto; [backend] maven pruebas correctas (9); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática
Correcciones aplicadas: 1

Recursos incrustados en el builder (hash SHA-256):
- .github/agents/builder.agent.md 657aec3ce422
- .github/skills/stack-agnostic-blueprint/SKILL.md 185483967f7e

- backend/pom.xml: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/adapter/JdbcCardRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/api/ApiExceptionHandler.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/api/CardController.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/api/CorsConfig.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/api/dto/CardDetailDto.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/api/dto/CardSummaryDto.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/CardsApplication.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/domain/Card.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/domain/CardStatus.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/domain/CardType.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/port/CardRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/service/CardNotFoundException.java: sin verificar (sin validador local)
- backend/src/main/java/com/bank/cards/service/CardQueryService.java: sin verificar (sin validador local)
- backend/src/main/resources/application.yml: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V1__schema.sql: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V2__seed.sql: sin verificar (sin validador local)
- backend/src/test/java/com/bank/cards/api/CardControllerTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/bank/cards/service/CardQueryServiceTest.java: sin verificar (sin validador local)
- frontend/index.html: sin verificar (sin validador local)
- frontend/package.json: sintaxis OK (JSON.parse)
- frontend/src/api/cardsApi.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/App.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/Amount.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/atoms.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/MaskedPan.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/StatusBadge.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/CardSummaryItem.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/CardSummaryItem.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/CardDetailPanel.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/CardList.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/organisms.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/templates/CardsLayout.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/templates/CardsLayout.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/hooks/useCards.test.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/hooks/useCards.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/main.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/pages/CardsPage.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/setupTests.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/styles.css: sin verificar (sin validador local)
- frontend/src/types/card.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/vite-env.d.ts: sintaxis OK (typescript.createSourceFile)
- frontend/tsconfig.json: sintaxis OK (JSON.parse)
- frontend/vite.config.ts: sintaxis OK (typescript.transpileModule)
- README.md: sin verificar (sin validador local)
