# Consulta de tarjetas — backend

API REST de solo lectura para consultar tarjetas ficticias. Está implementada con Java 17 y Spring Boot 3.2.5. El número completo solo existe en los datos de dominio de ejemplo; las respuestas REST lo muestran enmascarado, dejando visibles los últimos cuatro dígitos.

## Requisitos

- JDK 17 (o compatible con Java 17).
- Apache Maven 3.6 o posterior. El repositorio no incluye Maven Wrapper.

Comprueba las herramientas con `java -version` y `mvn -version`.

## Compilar, ejecutar y probar

Desde la raíz del proyecto:

```sh
mvn clean package
```

Este comando compila, ejecuta las pruebas y genera el artefacto en `target/`. Para ejecutar solo las pruebas:

```sh
mvn test
```

Para iniciar la aplicación en modo desarrollo:

```sh
mvn spring-boot:run
```

También se puede ejecutar el JAR generado:

```sh
java -jar target/consulta-tarjetas-0.1.0.jar
```

Por defecto escucha en `http://localhost:8080`. El puerto puede cambiarse mediante `SERVER_PORT`, por ejemplo `SERVER_PORT=8090 mvn spring-boot:run`. El nivel de logging configurable es `LOG_LEVEL` (por defecto `INFO`). No se requieren credenciales ni servicios externos.

## API

### Listar tarjetas

`GET /v1/tarjetas` devuelve una lista de resúmenes. `estado` y `tipo` son filtros opcionales; los valores se interpretan sin distinguir mayúsculas/minúsculas y deben coincidir con los enums disponibles.

```sh
curl -i 'http://localhost:8080/v1/tarjetas'
curl -i 'http://localhost:8080/v1/tarjetas?estado=ACTIVA&tipo=CREDITO'
```

Valores aceptados:

- `estado`: `ACTIVA`, `BLOQUEADA`, `VENCIDA`
- `tipo`: `CREDITO`, `DEBITO`

Cada resumen contiene `id`, `numeroEnmascarado`, `tipo` y `estado`.

### Consultar detalle

```sh
curl -i 'http://localhost:8080/v1/tarjetas/TC-001'
```

El detalle incluye titular, moneda, límite, saldo, disponible y vencimiento, además del número enmascarado. Para crédito, el disponible es límite menos saldo; para débito, es el saldo. IDs admiten letras, números y guiones, con longitud de 1 a 20 caracteres.

### Salud

```sh
curl -i 'http://localhost:8080/actuator/health'
```

El único endpoint Actuator expuesto por la configuración es `health`.

### Errores

Los errores se devuelven como `application/problem+json`: `400` para filtros o identificadores inválidos, `404` cuando no existe la tarjeta solicitada y `500` para errores inesperados. El error interno no revela detalles de implementación.

## Integración y persistencia

Actualmente no hay integración con sistemas externos ni base de datos. `TarjetaRepository` define el puerto de lectura y `InMemoryTarjetaRepository` es el adaptador activo, con cuatro registros ficticios cargados en memoria. Los datos no sobreviven al reinicio y la API no ofrece operaciones de escritura.

Para integrar una fuente real, se debe implementar `TarjetaRepository` con el mecanismo acordado (por ejemplo, un cliente de servicio o un adaptador de almacenamiento) y configurar su selección en Spring. La interfaz existente solo cubre listar y buscar por ID; requisitos adicionales de paginación, disponibilidad, consistencia y errores del proveedor deberán definirse antes de ampliar esa integración. No se configura persistencia relacional ni se incluyen migraciones.

Autenticación y autorización tampoco están implementadas. Antes de exponer el servicio fuera de un entorno local/de desarrollo, deben definirse e incorporarse los controles de identidad, permisos, transporte seguro, gestión de datos sensibles y políticas operativas apropiadas. Los registros incluidos son ficticios y no deben sustituirse por datos reales sin revisar esos controles.

## Pruebas incluidas

Las pruebas JUnit cubren el enmascaramiento del número, filtros y cálculos del servicio, validación de entradas y respuestas HTTP (incluidos errores). Ejecuta `mvn test` para correrlas.
