# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Notificación
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + .NET
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + .NET (capa Full Stack) para "Notificación" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + .NET y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN (refinamiento)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (Angular) y `backend/` (.NET) | Cada capa conserva su manifiesto y su toolchain, y se verifica por separado. |
| D2 | Backend en capas: Api → Application → Domain ← Infrastructure | Aísla PostgreSQL detrás de interfaces, como pide la plantilla. Permite pruebas unitarias sin base de datos. |
| D3 | Persistencia con Npgsql y SQL parametrizado (sin EF) | Menos dependencias, consultas explícitas y migraciones legibles en revisión estática. |
| D4 | Migraciones como SQL versionado (`V001__init.sql`, `V002__seed.sql`) | Son auditables y no dependen de la toolchain .NET para revisarse. |
| D5 | Front con componentes standalone organizados por Atomic Design | Responde al patrón pedido y permite reutilizar átomos en Banca por Internet. |
| D6 | La tarjeta se identifica con un token ficticio y los últimos 4 dígitos, nunca con el PAN | Minimiza el alcance PCI. |
| D7 | La configuración se lee de variables de entorno (`NOTIF_DB_CONNECTION`, `API_BASE_URL`) | Evita secretos en el repositorio. |

## Contrato API (v1)
- `GET /api/v1/tarjetas/{tarjetaRef}/notificaciones?leida=&page=&size=`
- `PATCH /api/v1/notificaciones/{id}/lectura`: idempotente.
- `GET` y `PUT /api/v1/tarjetas/{tarjetaRef}/preferencias`
- Los errores siguen el formato `ProblemDetails` (RFC 7807).

## Modelo de datos (PostgreSQL)
- **`notificacion`**: `id uuid PK`, `cliente_id`, `tarjeta_ref`, `ultimos4 char(4)`, `tipo` (CHECK: COMPRA, LIMITE, VENCIMIENTO, PAGO), `titulo`, `mensaje`, `monto numeric(18,2)`, `moneda char(3)`, `leida bool`, `creada_en timestamptz`.
  - Índice: `(cliente_id, tarjeta_ref, leida, creada_en DESC)`.
- **`preferencia_notificacion`**: PK `(cliente_id, tarjeta_ref, tipo, canal)`, `habilitada`, `umbral_monto`.

## Estructura de módulos
```
backend/
  Tarjetas.Notificaciones.sln
  src/Api/            Endpoints, DTOs, Program.cs
  src/Application/    Casos de uso, INotificacionRepository
  src/Domain/         Notificacion, Preferencia, enums
  src/Infrastructure/ NpgsqlNotificacionRepository
  db/migrations/      V001__init.sql, V002__seed.sql
  tests/UnitTests/    xUnit + repositorio fake
frontend/
  package.json, angular.json
  src/app/notificaciones/
    atoms/      badge, icono-tipo, boton
    molecules/  item-notificacion, toggle-preferencia
    organisms/  lista-notificaciones, panel-preferencias
    templates/  layout-notificaciones
    pages/      notificaciones.page
    data/       notificaciones.service (HttpClient), modelos
  *.spec.ts junto a cada componente y al servicio
README.md
```

## Hipótesis
- **H1.** La capacidad muestra al cliente una bandeja de alertas de su tarjeta y le permite gestionar sus preferencias. El envío real por email, SMS o push queda fuera de alcance, porque la integración no está definida.
- **H2.** El `cliente_id` se simula mediante el header `X-Cliente-Id`. La autenticación real corresponde al gateway de Banca por Internet.
- **H3.** Versiones asumidas: .NET 8 LTS, Angular 17+ y pruebas con Jasmine/Karma.
- **H4.** Los montos y la moneda son ficticios. La zona horaria se maneja en UTC y el front la convierte.
- **H5.** Sin contexto SGC (fallback), los nombres y estándares no están validados contra la normativa corporativa.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| El SGC no está disponible y el diseño puede desalinearse de estándares internos | Las decisiones quedan documentadas como revisables. |
| Toolchain ausente (dotnet, node) | Lo no compilado se marca como no verificado en el handoff. |
| El esquema PostgreSQL solo se revisa de forma estática | El SQL es estándar y los CHECK son explícitos. Las pruebas unitarias usan el repositorio fake. |
| Exposición de datos de tarjeta | No se guarda el PAN, los logs van sin datos sensibles y la respuesta solo incluye los últimos 4 dígitos. |
| Al no haber integración definida, la notificación nunca se dispara | La interfaz `INotificacionPublisher` queda como puerto, sin implementar. |

## Trazabilidad con la aceptación
- **Sintaxis:** cubierta por T03.
- **Pruebas:** casos de uso en xUnit y componentes y servicio en `.spec.ts` (T04).
- **README:** incluye build, ejecución, variables de entorno y migraciones (T05).
- **Commit de publicación:** lo realiza el orquestador. Este diseño no afirma que el código compile ni que esté listo para producción.
