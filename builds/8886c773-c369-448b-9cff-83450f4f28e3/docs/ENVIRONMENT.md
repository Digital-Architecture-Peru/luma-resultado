# Variables de entorno (sin valores reales; definirlas en el entorno, nunca en el repositorio)

## Backend (Quarkus)
| Variable | Ejemplo / por defecto |
|---|---|
| DB_URL | jdbc:postgresql://localhost:5432/notifications |
| DB_USER | notifications |
| DB_PASSWORD | (vacío; definir en el entorno) |
| PORT | 8080 |
| CORS_ORIGINS | http://localhost:5173 |
| LOG_LEVEL | INFO |

## Frontend (Vite)
| Variable | Por defecto |
|---|---|
| VITE_API_BASE_URL | (vacío: usa el proxy de Vite) |
| VITE_CUSTOMER_ID | cust-001 (identidad simulada, ficticia) |
| VITE_ACCOUNT_ID | acc-001 |
