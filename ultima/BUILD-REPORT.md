# Build 17d58c53-23a0-4b62-accd-76462b525473

Stack: React + TypeScript + Java + Spring Boot · capa Full Stack

Candidate generada por Microapp Builder; no es producción.

59 archivos; sintaxis verificada en 23/23; sin validador local: 36; pruebas incluidas; README incluido. Verificado de verdad: build correcto; pruebas unitarias correctas (20); [backend] maven build correcto; [backend] maven pruebas correctas (24); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática. (candidate).

Verificación: OK · build · pruebas unitarias (44) · dist/ incluido
Detalle de verificación: build correcto; pruebas unitarias correctas (20); [backend] maven build correcto; [backend] maven pruebas correctas (24); dist/ generado · esquema PostgreSQL NO ejecutado contra un motor real (sin motor local); solo revisado de forma estática
Correcciones aplicadas: 0

Recursos incrustados en el builder (hash SHA-256):
- .github/agents/builder.agent.md 657aec3ce422
- .github/skills/stack-agnostic-blueprint/SKILL.md 185483967f7e

- backend/pom.xml: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/api/dto/NotificacionDto.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/api/dto/PaginaDto.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/api/dto/PreferenciaDto.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/api/ManejadorErrores.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/api/NotificacionController.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/application/CuentaNoAutorizadaException.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/application/NotificacionService.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/application/PreferenciaService.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/application/RecursoNoEncontradoException.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/domain/Canal.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/domain/CuentaMascara.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/domain/Notificacion.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/domain/Pagina.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/domain/Preferencia.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/domain/TipoEvento.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/infrastructure/CanalLogFake.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/infrastructure/JdbcNotificacionRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/infrastructure/JdbcPreferenciaRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/infrastructure/TitularidadStub.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/NotificacionesApplication.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/port/CanalNotificacionPort.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/port/NotificacionRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/port/PreferenciaRepository.java: sin verificar (sin validador local)
- backend/src/main/java/com/example/cuentas/notificaciones/port/TitularidadPort.java: sin verificar (sin validador local)
- backend/src/main/resources/application.yml: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V1__esquema.sql: sin verificar (sin validador local)
- backend/src/main/resources/db/migration/V2__datos_ficticios.sql: sin verificar (sin validador local)
- backend/src/test/java/com/example/cuentas/notificaciones/api/NotificacionControllerTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/example/cuentas/notificaciones/application/NotificacionServiceTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/example/cuentas/notificaciones/application/PreferenciaServiceTest.java: sin verificar (sin validador local)
- backend/src/test/java/com/example/cuentas/notificaciones/domain/CuentaMascaraTest.java: sin verificar (sin validador local)
- docker-compose.yml: sin verificar (sin validador local)
- frontend/index.html: sin verificar (sin validador local)
- frontend/package.json: sintaxis OK (JSON.parse)
- frontend/src/components/atoms/Button.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/atoms/TipoBadge.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/NotificacionItem.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/NotificacionItem.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/molecules/PreferenciaRow.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/NotificacionesList.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/NotificacionesList.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/organisms/PreferenciasPanel.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/components/templates/PaginaLayout.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/hooks/useNotificaciones.test.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/hooks/useNotificaciones.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/hooks/usePreferencias.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/main.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/pages/NotificacionesPage.test.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/pages/NotificacionesPage.tsx: sintaxis OK (typescript.transpileModule)
- frontend/src/services/notificacionesApi.test.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/services/notificacionesApi.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/setupTests.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/styles.css: sin verificar (sin validador local)
- frontend/src/types/notificacion.ts: sintaxis OK (typescript.transpileModule)
- frontend/src/vite-env.d.ts: sintaxis OK (typescript.createSourceFile)
- frontend/tsconfig.json: sintaxis OK (JSON.parse)
- frontend/vite.config.ts: sintaxis OK (typescript.transpileModule)
- README.md: sin verificar (sin validador local)
