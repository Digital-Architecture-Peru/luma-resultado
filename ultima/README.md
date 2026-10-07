# Consulta de Tarjetas (Banca por Internet)

API de solo lectura construida con Java 17 y Quarkus 3.15.1. Expone tarjetas ficticias de ejemplo; no es una integración con un core bancario ni un servicio listo para producción.

## Requisitos

- JDK 17
- Apache Maven 3.8+ (el repositorio no incluye Maven Wrapper)

## Compilar, ejecutar y probar

Desde la raíz del repositorio:

```bash
mvn test       # pruebas unitarias JUnit 5
mvn package    # compila y empaqueta la aplicación Quarkus
mvn quarkus:dev # modo desarrollo, servidor en http://localhost:8080
```

En otra terminal, con el servicio en ejecución, se puede verificar:

```bash
curl -i 'http://localhost:8080/v1/cards'
curl -i 'http://localhost:8080/v1/cards?status=ACTIVE&page=0&size=10'
curl -i 'http://localhost:8080/v1/cards/CARD-001'
curl -i 'http://localhost:8080/health'
```

Las opciones `PORT` y `LOG_LEVEL` configuran el puerto HTTP (por defecto `8080`) y el nivel de log (por defecto `INFO`), respectivamente. Por ejemplo: `PORT=8081 LOG_LEVEL=DEBUG mvn quarkus:dev`.

## API

- `GET /v1/cards?status=ACTIVE|BLOCKED|EXPIRED&page=0&size=10`: lista paginada. `page` comienza en cero; `size` acepta de 1 a 50. `status` puede omitirse.
- `GET /v1/cards/{id}`: detalle por identificador; por ejemplo, `CARD-001`.
- `GET /health`: endpoint SmallRye Health.

El número PAN se enmascara en los DTO antes de responder. Consultas inválidas devuelven `400`, identificadores bien formados pero no encontrados devuelven `404`, y los errores mapeados usan `application/problem+json`.

## Organización

- `api/`: recursos HTTP y mapeo de errores.
- `organisms/`: caso de uso `CardQueryService`, puerto `CardCatalog` y adaptador `InMemoryCardCatalog`.
- `molecules/`: conversión del modelo a DTO.
- `atoms/`: validación de identificadores y enmascaramiento PAN.
- `model/`, `dto/`: dominio y contratos de respuesta.

## Integración y persistencia

Actualmente no hay persistencia, base de datos, migraciones ni conexión con sistemas externos. `InMemoryCardCatalog` entrega una lista inmutable de datos ficticios inicializada en memoria y sus cambios no sobreviven al reinicio. La aplicación depende del puerto `CardCatalog`; una integración futura puede proporcionar otro adaptador para esa interfaz y configurar credenciales/conectividad mediante variables de entorno o configuración segura, sin incorporar datos reales a este adaptador. Antes de producción deben definirse autenticación/autorización, gestión de secretos, auditoría y controles de acceso con el sistema consumidor.

## Pruebas disponibles

`mvn test` ejecuta pruebas de JUnit 5 para enmascaramiento PAN y el servicio de consulta: filtros, paginación, parámetros inválidos, detalle y tarjetas no encontradas. No se documentan pruebas de integración HTTP ni persistencia porque no están presentes en el código actual.
