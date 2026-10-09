# DESIGN

## Hechos (respuestas del guion)
- ¿Dónde necesitas incorporar la nueva capacidad? Banca por Internet
- ¿Qué tipo de capacidad? Consulta
- ¿Sobre qué dominio? Tarjetas
- ¿Qué necesitas construir? Full Stack
- Patrones disponibles Component-based (Atomic Design)
- ¿Qué stack? React + TypeScript + Java + Quarkus
- ¿Persistencia? PostgreSQL
- ¿Qué pruebas? Unitarias

## Contexto SGC
Estado: fallback (SGC no configurado)

## Solución
- Solución en React + TypeScript + Java + Quarkus (capa Full Stack) para "Consulta" sobre Tarjetas en Banca por Internet, patrón Component-based (Atomic Design).
- Estructura idiomática del stack: fuentes, manifiesto de build/dependencias, pruebas y README con cómo compilar y ejecutar.
- Integración sin definir y persistencia PostgreSQL detrás de interfaces; configuración por variables de entorno, sin secretos.
- Datos de ejemplo ficticios; sin llamadas a sistemas reales.

## Hipótesis
- El código se genera en React + TypeScript + Java + Quarkus y se verifica con la toolchain local cuando está instalada (npm, Maven, Gradle, Go, Cargo, .NET, pytest); lo que no tenga toolchain queda marcado como no verificado.
- Integración (sin definir), persistencia (PostgreSQL) y pruebas (Unitarias) se implementan como candidate; los esquemas SQLite se ejecutan en memoria y los demás motores solo se revisan de forma estática.

## Aceptación
- Sin errores de sintaxis en los archivos verificables; pruebas y README presentes; publicación con commit.


## Refinamiento del diseño (claude-opus-5.5)

# DESIGN (refinamiento)

## Decisiones de arquitectura
| # | Decisión | Justificación |
|---|---|---|
| D1 | Monorepo con `frontend/` (React+TS, Vite) y `backend/` (Quarkus, Maven) | Builds independientes y un único README |
| D2 | Backend en capas `resource → service → repository`, con interfaz `TarjetaRepository` | La persistencia queda detrás de una interfaz y el servicio se prueba sin BD |
| D3 | Endpoints solo lectura: `GET /api/v1/tarjetas` (paginado) y `GET /api/v1/tarjetas/{id}` | Es una capacidad de consulta y no expone mutaciones |
| D4 | Se guarda solo `ultimos4` y la marca; el PAN completo, el CVV y la fecha completa nunca se guardan | Reduce el alcance PCI-DSS; el dato enmascarado (`**** 1234`) se arma en el DTO |
| D5 | Flyway: `V1__esquema.sql`, `V2__datos_ficticios.sql` | Migraciones versionadas y reproducibles |
| D6 | Acceso con JDBC/Panache y parámetros enlazados; sin concatenar SQL | Evita la inyección SQL |
| D7 | Frontend con Atomic Design: atoms, molecules, organisms, templates, pages; acceso a la API en `services/` y en el hook `useTarjetas` | Los componentes de presentación quedan sin efectos y son fáciles de probar |
| D8 | Configuración por variables de entorno (`DB_URL`, `DB_USER`, `DB_PASSWORD`, `VITE_API_URL`) | Sin secretos en el repositorio |
| D9 | Errores con `ExceptionMapper` y respuesta `{codigo, mensaje}`; 404 si la tarjeta no existe o no pertenece al cliente | No filtra la existencia de tarjetas ajenas |

## Estructura de módulos
```
backend/src/main/java/com/banca/tarjetas/
  api/        TarjetaResource, TarjetaDto, ErrorMapper
  service/    TarjetaService, Enmascarador
  domain/     Tarjeta, EstadoTarjeta
  repository/ TarjetaRepository, PgTarjetaRepository
backend/src/main/resources/{application.properties, db/migration/}
backend/src/test/java/...  TarjetaServiceTest, EnmascaradorTest
frontend/src/
  components/{atoms,molecules,organisms,templates}/
  pages/ConsultaTarjetasPage.tsx
  services/tarjetasApi.ts   hooks/useTarjetas.ts   types/tarjeta.ts
frontend/src/**/*.test.tsx
```

## Modelo de datos (PostgreSQL)
- `tarjeta(id UUID PK, cliente_id UUID NOT NULL, marca VARCHAR(20), tipo VARCHAR(10) CHECK IN ('CREDITO','DEBITO'), ultimos4 CHAR(4), estado VARCHAR(12), limite NUMERIC(14,2), saldo NUMERIC(14,2), moneda CHAR(3), vence_mes_anio CHAR(5), creado_en TIMESTAMPTZ)`.
- Índice `idx_tarjeta_cliente (cliente_id)`.
- Los datos de prueba son ficticios: UUIDs inventados y `ultimos4` de ejemplo.

## Pruebas unitarias
- **Backend** (JUnit 5 + Mockito): el servicio con un repositorio simulado (lista, detalle, no encontrado, tarjeta ajena) y el enmascarador.
- **Frontend** (Vitest + Testing Library): render de la molécula `TarjetaCard`, estados carga/vacío/error del organismo y `useTarjetas` con fetch simulado.

## Hipótesis
- H1: la identidad del cliente la entrega un gateway u OIDC. En esta versión candidate se simula con la cabecera `X-Cliente-Id` y queda marcada como **no apta para producción**.
- H2: no hay contexto SGC (estado fallback). Los estándares corporativos de nombres y seguridad no se confirmaron.
- H3: versiones asumidas Java 17+, Quarkus 3.x, Node 18+ y PostgreSQL 14+.
- H4: la integración con el core de tarjetas está sin definir. Los datos salen solo de PostgreSQL local.
- H5: los montos se muestran con `Intl.NumberFormat` en locale `es` y moneda ISO.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Exposición de datos de tarjeta | D4, sin logs de datos sensibles, DTO explícito |
| H1 (cabecera simulada) usada en producción | Advertencia en el README y en el resumen de handoff |
| El SQL de PostgreSQL no se ejecuta, solo revisión estática | Se declara "no verificado" en el handoff |
| Sin toolchain Maven o npm local | Compilación y pruebas declaradas "no verificadas" |
| CORS entre front y back | `quarkus.http.cors` configurable por entorno |
