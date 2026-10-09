# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Spring Boot
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Spring Boot (capa Full Stack) para "Consulta" sobre Pagos en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + Java + Spring Boot y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN (refinamiento)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Repositorio único con `frontend/` (React + TS + Vite) y `backend/` (Spring Boot + Maven), cada uno con su propio build | Permite compilar, probar y desplegar cada capa por separado |
| D2 | Backend en capas: `api` → `application` → `domain` (puerto `PagoRepository`) → `infrastructure` (adaptador) | Mantiene la persistencia detrás de una interfaz, como pide la base, y permite probar el servicio con mocks |
| D3 | API de solo lectura: `GET /api/v1/pagos` (filtros `desde`, `hasta`, `estado`, `page`, `size`) y `GET /api/v1/pagos/{id}` | La capacidad es una consulta. La paginación obligatoria (`size` máximo 100) acota la carga |
| D4 | Acceso a datos con `NamedParameterJdbcTemplate` | Las consultas quedan parametrizadas de forma explícita, sin SQL concatenado ni la complejidad de un ORM |
| D5 | Migraciones Flyway `V1__schema.sql` y `V2__seed_ficticio.sql`. Montos en `NUMERIC(15,2)` ↔ `BigDecimal`, moneda en `CHAR(3)`, fechas en `TIMESTAMPTZ` | El esquema queda versionado, sin pérdida de precisión monetaria |
| D6 | Índices `(cuenta_id, fecha_pago DESC)` y `(estado)` | Cubren el filtro y el orden principales de la consulta |
| D7 | Frontend con Atomic Design: atoms (`Badge`, `Amount`), molecules (`DateRangeFilter`, `PaymentRow`), organisms (`PaymentsTable`, `FiltersPanel`), template (`ConsultaLayout`) y page (`ConsultaPagosPage`) | Sigue el patrón pedido, con piezas reutilizables y testeables |
| D8 | Configuración por variables de entorno: `DB_URL`, `DB_USER`, `DB_PASSWORD`, `VITE_API_BASE_URL`. Se incluye un `.env.example` sin valores reales | Evita versionar secretos |
| D9 | Pruebas unitarias: JUnit 5 + Mockito (servicio y mapeo) y Vitest + Testing Library (atoms, molecules, organisms) | Cubren el tipo de prueba solicitado (Unitarias) |

## Estructura de módulos
```
backend/  pom.xml
  src/main/java/.../pagos/{api,application,domain,infrastructure}
  src/main/resources/{application.yml, db/migration/V1__,V2__}
  src/test/java/.../pagos/{PagoServiceTest, PagoMapperTest}
frontend/ package.json, vite.config.ts, tsconfig.json
  src/{atoms,molecules,organisms,templates,pages,services/pagosApi.ts,types}
  src/**/*.test.tsx
README.md
```

## Hipótesis
- **H1.** La autenticación queda fuera de alcance. Para la demo, la cuenta se toma de un usuario ficticio fijo. En producción se tomaría del token, nunca del parámetro de la petición.
- **H2.** Estados de pago: `PENDIENTE`, `PROCESADO`, `RECHAZADO`.
- **H3.** El número de cuenta se muestra enmascarado (`****1234`).
- **H4.** La integración con el core de pagos está sin definir. Solo existe la fuente PostgreSQL local con datos ficticios.
- **H5.** Versiones objetivo: Java 17+, Spring Boot 3.x y Node 18+. Todas sin verificar.
- **H6.** El SGC está en modo fallback, por lo que no hay estándares corporativos aplicados.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| IDOR: un cliente consulta pagos de otra cuenta | Filtrar siempre por la cuenta del usuario (H1) y devolver 404 si el pago no pertenece a esa cuenta |
| Esquema PostgreSQL validado solo de forma estática | Usar SQL estándar y señalarlo como no verificado en el handoff |
| Compilación no comprobada si falta npm o Maven | Marcar el resultado como *candidate* y documentar los comandos en el README |
| Desfase de zona horaria en filtros por fecha | Usar `TIMESTAMPTZ` y fechas ISO-8601 en la API |
| CORS entre el front y el back en local | Usar el proxy de Vite en desarrollo, sin `*` en la configuración |

## Trazabilidad con la aceptación
- **T02:** D1–D7.
- **T03:** sintaxis de los archivos verificables.
- **T04-tests:** D9.
- **T04-db:** D4–D6.
- **T05-docs:** README con el build de ambas capas, las variables de D8 y la integración marcada como "sin definir".
- **T06-handoff:** se cierra como *candidate*, sin afirmar compilación ni producción y listando lo no verificado.
