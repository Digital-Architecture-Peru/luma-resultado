# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + Java + Quarkus (capa Full Stack) para "Transacción" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en Angular + Java + Quarkus y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN (refinamiento)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (Angular) y `backend/` (Quarkus + Maven) | Build y pruebas independientes por capa con un único README |
| D2 | Backend por capas (`api` → `application` → `domain` ← `infrastructure`) con puertos | La lógica se prueba con JUnit 5 y fakes, sin BD ni `@QuarkusTest` |
| D3 | Acceso a datos por puerto `TransaccionRepository`. Adaptador JDBC (Agroal) con `PreparedStatement` | Consultas parametrizadas y explícitas. El fake en memoria cubre las pruebas unitarias |
| D4 | Migraciones Flyway: `V1__esquema.sql` y `V2__datos_ficticios.sql` | Esquema versionado y reproducible |
| D5 | Montos como `BigDecimal` / `NUMERIC(15,2)`, con moneda ISO-4217 | Evita errores de redondeo en dinero |
| D6 | Cabecera `Idempotency-Key` + `UNIQUE` en BD | Evita el doble cargo por reintento o doble clic |
| D7 | Solo se guardan `ultimos4` y un token ficticio. Nunca el PAN | Minimiza la exposición a datos sensibles (PCI) |
| D8 | Integración "sin definir" detrás del puerto `ProcesadorTarjetasGateway`, con adaptador stub | Permite cambiar de proveedor sin tocar el dominio |
| D9 | Angular con componentes standalone y Atomic Design en `shared/ui` | Cumple el patrón pedido y permite reutilizar componentes |
| D10 | Configuración por variables de entorno (`QUARKUS_DATASOURCE_*`, `apiBaseUrl`) | Sin secretos en el repositorio |

## Estructura de módulos
```
backend/
  pom.xml
  src/main/java/com/demo/tarjetas/transaccion/
    api/            TransaccionResource, DTOs, ExceptionMapper
    application/    RegistrarTransaccionService
    domain/         Transaccion, EstadoTransaccion, reglas de validación
    infrastructure/ JdbcTransaccionRepository, StubProcesadorGateway
  src/main/resources/application.properties
  src/main/resources/db/migration/V1__esquema.sql, V2__datos_ficticios.sql
  src/test/java/...  RegistrarTransaccionServiceTest, TransaccionTest
frontend/
  package.json, angular.json
  src/app/shared/ui/atoms/       boton, campo-monto, etiqueta-tarjeta-enmascarada
  src/app/shared/ui/molecules/   selector-tarjeta, campo-con-error
  src/app/shared/ui/organisms/   formulario-transaccion, resumen-transaccion
  src/app/shared/ui/templates/   layout-transaccion
  src/app/features/transaccion-tarjeta/  pages/, services/, models/
  *.spec.ts (pruebas unitarias junto a cada componente y servicio)
README.md
```

## Modelo de datos (PostgreSQL)
- `tarjeta`: `id`, `cliente_id`, `ultimos4 CHAR(4)`, `tipo`, `estado`.
- `transaccion`:
  - `id UUID`, `tarjeta_id` con FK a `tarjeta`.
  - `monto NUMERIC(15,2) CHECK (monto > 0)`, `moneda CHAR(3)`.
  - `estado` con valores `PENDIENTE`, `APROBADA` o `RECHAZADA`.
  - `idempotency_key UNIQUE`, `creado_en TIMESTAMPTZ`.
- Índice `(tarjeta_id, creado_en DESC)` para el historial.

## API (contrato candidate)
- `POST /api/tarjetas/{id}/transacciones`: responde 201, o 200 si es una repetición idempotente. Responde 422 ante reglas de negocio y 404 si la tarjeta no existe.
- `GET /api/tarjetas/{id}/transacciones?limite=20`: devuelve el historial reciente.

## Hipótesis
- **H1:** "Transacción" se interpreta como pago o cargo sobre una tarjeta del cliente. El tipo exacto no está confirmado.
- **H2:** La autenticación la resuelve Banca por Internet (gateway o SSO). El backend recibe `clienteId` ya validado, simulado en la demo.
- **H3:** Versiones de referencia: Angular 17+, Quarkus 3.x y Java 17+, no confirmadas.
- **H4:** Las pruebas unitarias del frontend usan el runner por defecto de Angular CLI.
- **H5:** El stub de integración aprueba montos menores o iguales a un límite ficticio y rechaza el resto.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Sin toolchain local, la compilación y las pruebas quedan sin verificar | El handoff lo declara como no verificado |
| El SQL de PostgreSQL solo admite revisión estática | Usar SQL estándar sin extensiones y revisar la sintaxis manualmente |
| Alcance de "Transacción" ambiguo (H1) | Encapsular el tipo en el dominio para poder ampliarlo |
| Autenticación y autorización no definidas (H2) | Documentarlo en el README como prerrequisito de integración |
| El runner Karma requiere navegador | Documentar cómo ejecutarlo en modo headless |
| Exposición de datos de tarjeta | Aplicar D7 y enmascarar en la UI y en los logs |
