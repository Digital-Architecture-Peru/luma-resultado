# Variables de entorno

Sin valores secretos en el repositorio; defínalas en el entorno o en un `.env` local (ignorado).

| Variable | Capa | Ejemplo / por defecto |
|---|---|---|
| `SPRING_DATASOURCE_URL` | backend | `jdbc:postgresql://localhost:5432/notifications` |
| `SPRING_DATASOURCE_USERNAME` | backend | `notifications` |
| `SPRING_DATASOURCE_PASSWORD` | backend | (vacío; definir en el entorno) |
| `SERVER_PORT` | backend | `8080` |
| `LOG_LEVEL` | backend | `INFO` |
| `VITE_API_BASE_URL` | frontend | vacío (usa el proxy de Vite) |
| `VITE_CUSTOMER_ID` | frontend | `CLI-0001` (cliente ficticio) |
| `VITE_PROXY_TARGET` | frontend (dev) | `http://localhost:8080` |
