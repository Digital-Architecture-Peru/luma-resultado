# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Quarkus (capa Full Stack) para "Consulta" sobre Pagos en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + Java + Quarkus y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# Refinamiento de diseño: Consulta de Pagos (candidate)

## Decisiones de arquitectura
| ID | Decisión | Justificación |
|---|---|---|
| D1 | Repositorio con `frontend/` y `backend/`, cada uno con su build (npm y Maven) | El front y el back se compilan y prueban por separado. |
| D2 | Quarkus REST en capas: `resource → service → repository` (interfaz) | La persistencia queda detrás de una interfaz. Así el service se prueba sin base de datos. |
| D3 | `JdbcPaymentRepository` con `PreparedStatement` sobre el datasource Agroal | Parametrización explícita, sin SQL concatenado y con pocas dependencias. |
| D4 | Migraciones Flyway versionadas: `V1__schema.sql` y `V2__seed_ficticio.sql` | Esquema reproducible y revisable de forma estática. |
| D5 | API de solo lectura: `GET /api/v1/payments?from&to&status&page&size` y `GET /api/v1/payments/{id}` | Cubre la capacidad "Consulta". La lista va paginada y los errores devuelven `{code,message}` (400/404). |
| D6 | Montos con `BigDecimal` serializados como string, más `currency` ISO 4217 | Evita pérdida de precisión en el cliente. |
| D7 | Front con React + TS (Vite) en Atomic Design: atoms, molecules, organisms, templates, pages | Respeta el patrón pedido y permite probar cada componente de forma aislada. |
| D8 | Configuración por entorno: `QUARKUS_DATASOURCE_*` y `VITE_API_BASE_URL` | No hay secretos en el repositorio. Se incluye un `.env.example` con valores ficticios. |

## Modelo de datos (PostgreSQL)
- Tabla `payment`:
  - `id UUID PK`, `customer_id VARCHAR(36) NOT NULL`, `reference VARCHAR(40)`, `beneficiary_name VARCHAR(120)`, `beneficiary_account_masked VARCHAR(20)`.
  - `amount NUMERIC(15,2) CHECK (amount > 0)`, `currency CHAR(3)`.
  - `status VARCHAR(16) CHECK IN ('PENDING','COMPLETED','REJECTED')`.
  - `executed_at TIMESTAMPTZ`, `created_at TIMESTAMPTZ DEFAULT now()`.
- Índices: `(customer_id, executed_at DESC)` y `(customer_id, status)`.
- Los datos semilla usan UUID literales para no depender de extensiones.

## Estructura de módulos
```
backend/  pom.xml
  src/main/java/.../payments/
    api/ PaymentResource, dto/, ErrorMapper
    domain/ Payment, PaymentStatus, PaymentQuery
    service/ PaymentQueryService
    persistence/ PaymentRepository, JdbcPaymentRepository
  src/main/resources/ application.properties, db/migration/
  src/test/java/... PaymentQueryServiceTest (JUnit5 + Mockito)
frontend/ package.json, vite.config.ts
  src/components/{atoms,molecules,organisms,templates}/
  src/pages/PaymentsPage.tsx, src/services/paymentsApi.ts
  src/**/*.test.tsx (Vitest + Testing Library)
README.md
```

## Hipótesis
- **H1.** "Consulta" significa listar los pagos del cliente con filtro por fecha y estado, más ver el detalle de un pago. No se crean ni modifican pagos.
- **H2.** La identidad del cliente se simula con el header `X-Customer-Id`, que lleva un valor ficticio. La autenticación real (OIDC/token) queda fuera de alcance.
- **H3.** La integración está sin definir. El origen real de los pagos (core bancario) se sustituye por PostgreSQL con datos ficticios.
- **H4.** Se asume PostgreSQL 13 o superior y Java 17 o superior.
- **H5.** Las pruebas son solo unitarias. No hay `@QuarkusTest` con base de datos ni pruebas E2E.

## Riesgos
- **R1.** Si no hay JDK/Maven o Node instalados, la compilación y las pruebas quedan marcadas como **no verificadas**.
- **R2.** El SQL de PostgreSQL solo recibe revisión estática. No se ejecuta en memoria.
- **R3.** Seguridad: el header simulado no sirve para producción. Hay que reemplazarlo por la identidad que venga del token.
- **R4.** Exposición de datos sensibles: la cuenta del beneficiario se guarda y se muestra enmascarada (solo los últimos 4 dígitos).
- **R5.** Quarkus Dev Services necesita Docker. Como alternativa, el README documenta cómo usar un PostgreSQL local.
- **R6.** La configuración de CORS entre Vite y Quarkus vale solo para el perfil dev.

## Trazabilidad con la aceptación
- **T02:** se cubre con D1–D8.
- **T03:** las fuentes `.java`, `.ts` y `.tsx` son verificables.
- **T04-tests:** lo cubren los tests de service, componentes y `paymentsApi`.
- **T04-db:** D3, D4 y el modelo de datos.
- **T05:** el README explica build, ejecución, persistencia e integración (sin definir).
- **T06:** el resumen de cierre se entrega como candidate e incluye R1 y R2.
