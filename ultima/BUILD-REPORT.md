# Build 4235d49d-8d6d-424c-bee5-e9bc4e2225c7

Stack: Angular + Java + Spring Boot · capa Full Stack

Candidate generada por Microapp Builder; no es producción.

52 archivos; sintaxis verificada en 22/22; sin validador local: 30; pruebas incluidas; README incluido. Verificado de verdad: build correcto; pruebas unitarias correctas (11); [backend] maven build correcto; [backend] maven pruebas correctas (16); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática. (candidate).

Verificación: OK · build · pruebas unitarias (27) · dist/ incluido
Detalle de verificación: build correcto; pruebas unitarias correctas (11); [backend] maven build correcto; [backend] maven pruebas correctas (16); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática
Correcciones aplicadas: 1

Recursos incrustados en el builder (hash SHA-256):
- .github/agents/builder.agent.md 657aec3ce422
- .github/skills/stack-agnostic-blueprint/SKILL.md 185483967f7e

- backend/pom.xml: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/api/CorsConfig.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/api/dto/NotificationResponse.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/api/dto/PreferenceRequest.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/api/dto/PreferenceResponse.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/api/NotificationController.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/api/ProblemHandler.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/application/NotFoundException.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/application/NotificationService.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/application/PreferenceService.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/domain/AccountMask.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/domain/Notification.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/domain/NotificationType.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/domain/ports/NotificationDispatcher.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/domain/ports/NotificationRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/domain/ports/PreferenceRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/domain/Preference.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/infrastructure/dispatch/LoggingDispatcher.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/infrastructure/persistence/JdbcNotificationRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/infrastructure/persistence/JdbcPreferenceRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/NotificacionesApplication.java: sin verificar (sin validador local)
- backend/src/main/resources/application.yml: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V1__schema.sql: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V2__seed_ficticio.sql: sin verificar (sin validador local)
- backend/src/test/java/com/example/cuentas/notificaciones/application/NotificationServiceTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/example/cuentas/notificaciones/application/PreferenceServiceTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/example/cuentas/notificaciones/domain/DomainTest.java: sin verificar (sin validador local)
- frontend/angular.json: sintaxis OK (JSON.parse)
- frontend/package.json: sintaxis OK (JSON.parse)
- frontend/proxy.conf.json: sintaxis OK (JSON.parse)
- frontend/setup-jest.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/app.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/notifications/atoms/toggle.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/notifications/atoms/type-badge.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/notifications/models/notification.model.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/notifications/molecules/notification-item.component.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/notifications/molecules/notification-item.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/notifications/organisms/notification-list.component.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/notifications/organisms/notification-list.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/notifications/organisms/preferences-panel.component.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/notifications/organisms/preferences-panel.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/notifications/pages/notifications-page.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/notifications/services/notification-api.service.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/notifications/services/notification-api.service.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/notifications/templates/notifications-layout.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/index.html: sin verificar (sin validador local)
- frontend/src/main.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/styles.css: sin verificar (sin validador local)
- frontend/tsconfig.app.json: sintaxis OK (JSON.parse)
- frontend/tsconfig.json: sintaxis OK (JSON.parse)
- frontend/tsconfig.spec.json: sintaxis OK (JSON.parse)
- README.md: sin verificar (sin validador local)
