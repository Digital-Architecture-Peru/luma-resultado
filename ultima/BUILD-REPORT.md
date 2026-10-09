# Build ffe9cf89-6758-4eeb-8318-60eb9bceee87

Stack: React + TypeScript + Java + Spring Boot · capa Full Stack

Candidate generada por Microapp Builder; no es producción.

53 archivos; sintaxis verificada en 22/22; sin validador local: 31; pruebas incluidas; README incluido. Verificado de verdad: build correcto; pruebas unitarias correctas (15); [backend] maven build correcto; [backend] maven pruebas correctas (15); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática. (candidate).

Verificación: OK · build · pruebas unitarias (30) · dist/ incluido
Detalle de verificación: build correcto; pruebas unitarias correctas (15); [backend] maven build correcto; [backend] maven pruebas correctas (15); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática
Correcciones aplicadas: 1

Recursos incrustados en el builder (hash SHA-256):
- .github/agents/builder.agent.md 657aec3ce422
- .github/skills/stack-agnostic-blueprint/SKILL.md 185483967f7e

- backend/pom.xml: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/api/ApiExceptionHandler.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/api/Dtos.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/api/NotificationController.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/application/NotificationService.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/domain/Card.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/domain/CardRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/domain/Channel.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/domain/Notification.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/domain/NotificationPreference.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/domain/NotificationPublisher.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/domain/NotificationRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/domain/NotificationStatus.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/domain/NotificationType.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/domain/PagedResult.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/domain/PreferenceRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/domain/ResourceNotFoundException.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/infrastructure/persistence/JdbcCardRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/infrastructure/persistence/JdbcNotificationRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/infrastructure/persistence/JdbcPreferenceRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/infrastructure/publisher/LoggingNotificationPublisher.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notifications/NotificationsApplication.java: sin verificar (sin validador local)
- backend/src/main/resources/application.yml: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V1__schema.sql: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V2__seed_ficticio.sql: sin verificar (sin validador local)
- backend/src/test/java/com/banco/notifications/api/NotificationControllerTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/banco/notifications/application/NotificationServiceTest.java: sin verificar (sin validador local)
- docs/environment.md: sin verificar (sin validador local)
- frontend/index.html: sin verificar (sin validador local)
- frontend/package.json: sintaxis OK (JSON.parse)
- frontend/src/components/atoms/atoms.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/Badge.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/Button.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/molecules.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/NotificationItem.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/PreferenceToggle.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/NotificationList.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/PreferencesPanel.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/templates/NotificationsTemplate.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/hooks/useNotifications.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/hooks/usePreferences.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/main.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/pages/NotificationsPage.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/pages/NotificationsPage.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/services/notificationsApi.test.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/services/notificationsApi.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/setupTests.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/styles.css: sin verificar (sin validador local)
- frontend/src/types/notification.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/vite-env.d.ts: sintaxis OK (typescript.createSourceFile)
- frontend/tsconfig.json: sintaxis OK (JSON.parse)
- frontend/vite.config.ts: sintaxis OK (typescript.transpileModule)
- README.md: sin verificar (sin validador local)
