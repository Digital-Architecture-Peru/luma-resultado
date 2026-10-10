# Build 586a1aa8-3d2d-45c0-9772-3bbaa5b0fe91

Stack: Angular + Java + Spring Boot · capa Full Stack

Candidate generada por Microapp Builder; no es producción.

55 archivos; sintaxis verificada en 19/19; sin validador local: 36; pruebas incluidas; README incluido. Verificado de verdad: build correcto; pruebas unitarias correctas; [backend] maven build correcto; [backend] maven pruebas correctas (13); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática. (candidate).

Verificación: OK · build · pruebas unitarias (13) · dist/ incluido
Detalle de verificación: build correcto; pruebas unitarias correctas; [backend] maven build correcto; [backend] maven pruebas correctas (13); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática
Correcciones aplicadas: 0

Recursos incrustados en el builder (hash SHA-256):
- .github/agents/builder.agent.md 657aec3ce422
- .github/skills/stack-agnostic-blueprint/SKILL.md 185483967f7e

- backend/pom.xml: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/adapters/in/web/ApiExceptionHandler.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/adapters/in/web/Dtos.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/adapters/in/web/InternalPaymentEventController.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/adapters/in/web/NotificationController.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/adapters/in/web/NotificationMapper.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/adapters/in/web/PreferenceController.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/adapters/out/persistence/NotificationEntity.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/adapters/out/persistence/NotificationRepositoryAdapter.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/adapters/out/persistence/PreferenceEntity.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/adapters/out/persistence/PreferenceRepositoryAdapter.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/adapters/out/sender/LogNotificationSender.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/application/NotificationNotFoundException.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/application/NotificationService.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/application/PreferenceService.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/domain/AccountMask.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/domain/Channel.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/domain/EventType.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/domain/NotificationRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/domain/NotificationSender.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/domain/NotificationStatus.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/domain/PageResult.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/domain/PaymentEvent.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/domain/PaymentNotification.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/domain/Preference.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/domain/PreferenceRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/banca/notification/NotificationApplication.java: sin verificar (sin validador local)
- backend/src/main/resources/application.yml: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V1__schema.sql: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V2__seed_ficticio.sql: sin verificar (sin validador local)
- backend/src/test/java/com/example/banca/notification/adapters/in/web/NotificationControllerTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/example/banca/notification/adapters/in/web/NotificationMapperTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/example/banca/notification/application/NotificationServiceTest.java: sin verificar (sin validador local)
- frontend/angular.json: sintaxis OK (JSON.parse)
- frontend/package.json: sintaxis OK (JSON.parse)
- frontend/proxy.conf.json: sintaxis OK (JSON.parse)
- frontend/src/app/app.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/core/models.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/core/notification.service.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/core/notification.service.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/pages/notifications.page.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/ui/atoms/status-badge.component.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/ui/atoms/status-badge.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/ui/molecules/notification-item.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/ui/molecules/preference-toggle.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/ui/organisms/notification-list.component.spec.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/ui/organisms/notification-list.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/ui/organisms/preference-panel.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/app/ui/templates/notifications-layout.component.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/index.html: sin verificar (sin validador local)
- frontend/src/main.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/styles.css: sin verificar (sin validador local)
- frontend/tsconfig.json: sintaxis OK (JSON.parse)
- frontend/tsconfig.spec.json: sintaxis OK (JSON.parse)
- README.md: sin verificar (sin validador local)
