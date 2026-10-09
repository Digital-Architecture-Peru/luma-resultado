# Variables de entorno (equivalente a .env.example, que el workspace no admite)

Exportar antes de ejecutar el backend (no versionar valores reales):

```
QUARKUS_DATASOURCE_JDBC_URL=jdbc:postgresql://localhost:5432/cuentas
QUARKUS_DATASOURCE_USERNAME=cuentas
QUARKUS_DATASOURCE_PASSWORD=        # definir en el entorno, nunca en el repositorio
CORS_ORIGINS=http://localhost:4200
APP_OWNER_ID=demo-owner
LOG_LEVEL=INFO
PORT=8080
```
