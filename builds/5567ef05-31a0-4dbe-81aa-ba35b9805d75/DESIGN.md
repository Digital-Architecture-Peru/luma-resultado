# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Cuentas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? Angular + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en Angular + Java + Quarkus (capa Full Stack) para "Consulta" sobre Cuentas en Banca por Internet, patrón Component-based (Atomic Design).
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
| ID | Decisión | Justificación |
|---|---|---|
| AD1 | Monorepo con `frontend/` (Angular) y `backend/` (Quarkus, Maven), cada uno con su build | Full Stack con ciclos de build y pruebas independientes |
| AD2 | Atomic Design en `frontend/src/app/ui/` (atoms → molecules → organisms → templates); las *pages* viven en la feature `cuentas` | Patrón pedido; separa la UI reutilizable de la lógica de la feature |
| AD3 | Componentes *standalone*; un `CuentasService` (HttpClient) es el único punto de acceso a la API | Facilita *mocks* en pruebas unitarias; los componentes de presentación no tienen dependencias |
| AD4 | Backend en capas: `resource` (JAX-RS) → `service` → `CuentaRepository` (interfaz) → adaptador Panache | La persistencia queda detrás de una interfaz y el servicio se prueba sin BD |
| AD5 | API de solo lectura: `GET /api/v1/cuentas` y `GET /api/v1/cuentas/{id}`; DTO separado de la entidad | La capacidad es "Consulta"; se evita exponer el modelo interno |
| AD6 | El número de cuenta sale enmascarado (`****1234`); saldos en `BigDecimal` / `NUMERIC(18,2)` | Minimiza la exposición de PII y evita errores de redondeo |
| AD7 | Migraciones Flyway: `V1__esquema.sql`, `V2__datos_ficticios.sql`; índice en `cliente_id`; consultas con parámetros con nombre | Esquema versionado y sin concatenación de SQL |
| AD8 | Configuración por variables de entorno (`QUARKUS_DATASOURCE_JDBC_URL`, `..._USERNAME`, `..._PASSWORD`), sin valores por defecto sensibles | Sin secretos en el repositorio |

## Estructura de módulos
```
frontend/  package.json, angular.json
  src/app/ui/{atoms,molecules,organisms,templates}/
  src/app/features/cuentas/{pages,services,models}/
  *.spec.ts  (Jasmine/Karma)
backend/   pom.xml
  src/main/java/.../cuentas/{api,service,domain,persistence}/
  src/main/resources/{application.properties,db/migration/}
  src/test/java/...  (JUnit 5 + Mockito, sin @QuarkusTest)
README.md
```

## Hipótesis
- H1: Se usa Angular 17 o superior y Quarkus 3.x con Java 17 o superior. Las versiones son supuestas, no confirmadas.
- H2: La autenticación está fuera de alcance. El cliente se simula con la cabecera `X-Cliente-Id` y queda marcado como pendiente de reemplazo por OIDC.
- H3: La integración está "sin definir", así que no hay llamadas a *core* bancario. Los datos salen solo de PostgreSQL con registros ficticios.
- H4: Las pruebas "Unitarias" no incluyen integración ni e2e. El backend usa *mocks* del repositorio y el frontend usa *mocks* de `HttpClient`.
- H5: SGC está en *fallback*, por lo que no se aplican estándares corporativos (nombres, librería UI, logging). Se usan convenciones idiomáticas del stack.
- H6: El modelo de datos es mínimo: `cuenta(id, cliente_id, numero, tipo, moneda, saldo_disponible, estado, fecha_apertura)`.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| IDOR: se consulta una cuenta de otro cliente | El servicio filtra siempre por `cliente_id`; si no corresponde responde 404. Prueba unitaria específica |
| No hay toolchain (npm/Maven) en el entorno | Se reporta como "no verificado"; no se afirma que compile |
| El SQL de PostgreSQL no se ejecuta (solo revisión estática) | Se usa SQL estándar sin extensiones; queda declarado en el resumen |
| Desajuste de versiones entre Angular y Quarkus | Versiones fijadas en los manifiestos y documentadas en el README |
| CORS entre front y back en desarrollo | `quarkus.http.cors` por variable de entorno o *proxy* de Angular documentado |
| Fuga de PII en logs | No se registran el número completo ni el saldo |

## Criterios complementarios (observables)
- Hay al menos un `*.spec.ts` por nivel atómico usado y para `CuentasService`.
- Hay pruebas de `CuentaService` (Java) para lista vacía, cuenta inexistente y cuenta de otro cliente.
- Las migraciones existen y tienen datos ficticios. No hay credenciales en los archivos.
- El README explica el build y la ejecución de cada módulo, las variables de entorno y deja la integración como "sin definir".
