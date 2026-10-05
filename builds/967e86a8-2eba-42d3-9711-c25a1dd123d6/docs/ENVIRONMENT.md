# Variables de entorno

Copia estos valores a un archivo `.env` (no versionado) antes de ejecutar la aplicación.
Ninguno de estos valores es secreto; son defaults de desarrollo local.

```
APP_NAME=banca-cuentas-consulta
APP_ENV=development
API_PREFIX=/api/v1
LOG_LEVEL=INFO
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

| Variable | Descripción | Default |
|---|---|---|
| APP_NAME | Nombre de la aplicación | banca-cuentas-consulta |
| APP_ENV | Entorno de ejecución | development |
| API_PREFIX | Prefijo de rutas de la API | /api/v1 |
| LOG_LEVEL | Nivel de logging | INFO |
| CORS_ALLOWED_ORIGINS | Orígenes permitidos (separados por coma) | http://localhost:3000 |
