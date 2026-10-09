# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Transacción
- ¿Sobre qué dominio? Pagos
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + Java + Quarkus (capa Full Stack) para "Transacción" sobre Pagos en Banca por Internet, patrón Component-based (Atomic Design).
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
| D1 | Monorepo con `frontend/` (Angular), `backend/` (Quarkus) y migraciones en `backend/src/main/resources/db/migration` | Un solo entregable Full Stack; cada parte compila con su propia toolchain (npm, Maven). |
| D2 | Backend hexagonal ligero: `api` → `application` → `domain` ← `infrastructure` | La integración está sin definir: se aísla detrás de `PasarelaPagoPort` con un adaptador stub. |
| D3 | REST `POST /api/v1/pagos` con cabecera `Idempotency-Key`; `GET /api/v1/pagos/{id}`; `GET /api/v1/pagos?cuentaOrigen=` | Evita pagos duplicados por reintento del usuario o de la red. |
| D4 | Importes con `BigDecimal` / `NUMERIC(19,2)` y moneda ISO-4217 | Sin errores de redondeo en dinero. |
| D5 | Estados `PENDIENTE → CONFIRMADO / RECHAZADO` validados en el dominio | Transiciones explícitas y fáciles de probar unitariamente. |
| D6 | Flyway (`V1__esquema.sql`, `V2__datos_ficticios.sql`) y acceso por Panache/JPA con parámetros enlazados | Esquema versionado, sin SQL concatenado. |
| D7 | Angular standalone, formularios reactivos y Atomic Design (atoms/molecules/organisms/templates/pages) | Corresponde al patrón elegido y permite reutilizar piezas en Banca por Internet. |
| D8 | Configuración por variables de entorno (`DB_URL`, `DB_USER`, `DB_PASSWORD`, `API_BASE_URL`) | Sin secretos en el repositorio. |

## Estructura de módulos
```
backend/  pom.xml
  src/main/java/.../pagos/
    api/            PagoResource, PagoRequest/Response, ErrorMapper
    application/    RegistrarPagoUseCase, ConsultarPagoUseCase
    domain/         Pago, EstadoPago, Monto, ReglasPago, PasarelaPagoPort, PagoRepository
    infrastructure/ PagoEntity, PagoPanacheRepository, PasarelaPagoStub
  src/test/java/... RegistrarPagoUseCaseTest, ReglasPagoTest, PagoResourceTest (mocks)
frontend/  package.json, angular.json
  src/app/pagos/
    atoms/      input-monto, boton, etiqueta-estado
    molecules/  campo-cuenta, resumen-importe
    organisms/  formulario-pago, detalle-pago
    templates/  layout-transaccion
    pages/      nuevo-pago.page, confirmacion.page
    services/   pagos-api.service (HttpClient)
  *.spec.ts junto a cada componente o servicio
```

## Modelo de datos (PostgreSQL)
- Tabla `pago`: `id UUID PK`, `idempotency_key VARCHAR UNIQUE`, `cuenta_origen`, `cuenta_destino`, `monto NUMERIC(19,2) CHECK (monto > 0)`, `moneda CHAR(3)`, `estado`, `creado_en TIMESTAMPTZ`.
- Índices: `(cuenta_origen, creado_en DESC)` y un índice único sobre `idempotency_key`.
- Datos ficticios con cuentas inventadas (por ejemplo `0000-FAKE-0001`).

## Pruebas unitarias
- Backend: JUnit 5 + Mockito sobre las reglas de dominio, los casos de uso (incluida la idempotencia) y el mapeo de errores.
- Frontend: el runner por defecto del Angular CLI cubre las validaciones del formulario, los átomos y el servicio con `HttpTestingController`.

## Riesgos
- **R1:** la compilación y las pruebas pueden no ejecutarse si faltan JDK, Maven o Node. Quedan marcadas como no verificadas.
- **R2:** el SQL de PostgreSQL solo recibe revisión estática y puede tener errores que solo aparecen en tiempo de ejecución.
- **R3:** la autenticación y autorización no están definidas. Un endpoint de pagos expuesto sin ellas es un riesgo grave fuera de la demo.
- **R4:** el SGC está en fallback, así que pueden faltar convenciones corporativas (nombres, librería de UI, observabilidad).
- **R5:** sin una pasarela real no se validan tiempos de espera, reintentos ni conciliación.

## Hipótesis
- **H1:** la autenticación la aporta Banca por Internet. Aquí se simula el usuario y no se implementa seguridad real.
- **H2:** las versiones son las LTS vigentes de Quarkus y Java 21, y Angular es una versión estable reciente. Hay que confirmarlas con la toolchain disponible.
- **H3:** solo se manejan pagos en la misma moneda, sin límites diarios ni OTP. Esas reglas quedan como extensión futura.
- **H4:** la pasarela stub confirma o rechaza según reglas ficticias deterministas.
- **H5:** no hay requisitos de auditoría regulatoria específicos. Solo se usa `creado_en` y logs sin datos sensibles.
