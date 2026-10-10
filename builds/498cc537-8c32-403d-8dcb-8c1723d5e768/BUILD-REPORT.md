# Build 498cc537-8c32-403d-8dcb-8c1723d5e768

Stack: React + TypeScript + Java + Quarkus · capa Full Stack

Candidate generada por Microapp Builder; no es producción.

44 archivos; sintaxis verificada en 20/20; sin validador local: 24; pruebas incluidas; README incluido. Verificado de verdad: build correcto; pruebas unitarias correctas (12); [backend] maven build correcto; [backend] maven pruebas correctas (9); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática. (candidate).

Verificación: OK · build · pruebas unitarias (21) · dist/ incluido
Detalle de verificación: build correcto; pruebas unitarias correctas (12); [backend] maven build correcto; [backend] maven pruebas correctas (9); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática
Correcciones aplicadas: 1

Recursos incrustados en el builder (hash SHA-256):
- .github/agents/builder.agent.md 657aec3ce422
- .github/skills/stack-agnostic-blueprint/SKILL.md 185483967f7e

- backend/pom.xml: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notificaciones/adapter/jdbc/JdbcNotificationRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notificaciones/api/CreateNotificationRequest.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notificaciones/api/NotificationDto.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notificaciones/api/NotificationResource.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notificaciones/api/ProblemExceptionMappers.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notificaciones/api/UnreadCountDto.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notificaciones/config/ClockProducer.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notificaciones/domain/Notification.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notificaciones/domain/NotificationType.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notificaciones/port/NotificationRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notificaciones/service/DuplicateNotificationException.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notificaciones/service/NewNotification.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notificaciones/service/NotificationNotFoundException.java: sin verificar (sin validador local)
- backend/src/main/java/com/banco/notificaciones/service/NotificationService.java: sin verificar (sin validador local)
- backend/src/main/resources/application.properties: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V1__schema.sql: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V2__seed_ficticio.sql: sin verificar (sin validador local)
- backend/src/test/java/com/banco/notificaciones/service/NotificationServiceTest.java: sin verificar (sin validador local)
- docker-compose.yml: sin verificar (sin validador local)
- docs/env.example.txt: sin verificar (sin validador local)
- frontend/index.html: sin verificar (sin validador local)
- frontend/package.json: sintaxis OK (JSON.parse)
- frontend/src/api/notificationsClient.test.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/api/notificationsClient.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/api/types.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/atoms/Badge.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/atoms/Button.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/atoms/Icon.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/hooks/useNotifications.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/main.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/molecules/NotificationItem.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/molecules/NotificationItem.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/organisms/NotificationBell.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/organisms/NotificationBell.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/organisms/NotificationList.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/pages/PaymentsPage.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/setupTests.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/styles.css: sin verificar (sin validador local)
- frontend/src/templates/BankLayout.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/vite-env.d.ts: sintaxis OK (typescript.createSourceFile)
- frontend/tsconfig.json: sintaxis OK (JSON.parse)
- frontend/vite.config.ts: sintaxis OK (typescript.transpileModule)
- README.md: sin verificar (sin validador local)
