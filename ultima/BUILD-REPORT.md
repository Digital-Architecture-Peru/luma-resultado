# Build 8886c773-c369-448b-9cff-83450f4f28e3

Stack: React + TypeScript + Java + Quarkus · capa Full Stack

Candidate generada por Microapp Builder; no es producción.

57 archivos; sintaxis verificada en 20/20; sin validador local: 37; pruebas incluidas; README incluido. Verificado de verdad: build correcto; pruebas unitarias correctas (9); [backend] maven build correcto; [backend] maven pruebas correctas (17); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática. (candidate).

Verificación: OK · build · pruebas unitarias (26) · dist/ incluido
Detalle de verificación: build correcto; pruebas unitarias correctas (9); [backend] maven build correcto; [backend] maven pruebas correctas (17); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática
Correcciones aplicadas: 1

Recursos incrustados en el builder (hash SHA-256):
- .github/agents/builder.agent.md 657aec3ce422
- .github/skills/stack-agnostic-blueprint/SKILL.md 185483967f7e

- backend/pom.xml: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/application/GetPreferences.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/application/ListNotifications.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/application/MarkAsRead.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/application/OwnershipGuard.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/application/ports/AccountOwnership.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/application/ports/NotificationChannel.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/application/ports/NotificationRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/application/ports/PreferenceRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/application/PublishNotification.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/application/UpdatePreferences.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/domain/Channel.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/domain/DomainException.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/domain/Notification.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/domain/NotificationStatus.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/domain/NotificationType.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/domain/Preference.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/infrastructure/channel/InAppChannel.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/infrastructure/persistence/JdbcAccountOwnership.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/infrastructure/persistence/JdbcNotificationRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/infrastructure/persistence/JdbcPreferenceRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/infrastructure/rest/DomainExceptionMapper.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/infrastructure/rest/Dtos.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/infrastructure/rest/NotificationsResource.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banking/notifications/infrastructure/rest/PATCH.java: sin verificar (sin validador local)
- backend/src/main/resources/application.properties: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V1__schema.sql: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V2__seed_ficticio.sql: sin verificar (sin validador local)
- backend/src/test/java/com/example/banking/notifications/application/Fakes.java: sin verificar (sin validador local)
- backend/src/test/java/com/example/banking/notifications/application/ListNotificationsTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/example/banking/notifications/application/MarkAsReadTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/example/banking/notifications/application/PreferencesTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/example/banking/notifications/application/PublishNotificationTest.java: sin verificar (sin validador local)
- docs/ENVIRONMENT.md: sin verificar (sin validador local)
- frontend/index.html: sin verificar (sin validador local)
- frontend/package.json: sintaxis OK (JSON.parse)
- frontend/src/components/atoms/Badge.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/Button.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/Toggle.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/NotificationItem.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/NotificationItem.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/PreferenceRow.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/NotificationList.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/NotificationList.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/PreferencesForm.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/PreferencesForm.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/templates/NotificationsLayout.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/hooks/useNotifications.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/main.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/pages/NotificationsPage.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/services/notificationsApi.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/styles.css: sin verificar (sin validador local)
- frontend/src/types/notifications.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/vite-env.d.ts: sintaxis OK (typescript.createSourceFile)
- frontend/tsconfig.json: sintaxis OK (JSON.parse)
- frontend/vite.config.ts: sintaxis OK (typescript.transpileModule)
- README.md: sin verificar (sin validador local)
