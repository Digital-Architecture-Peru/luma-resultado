# Banca por Internet — Consulta de Cuentas (Python + FastAPI)

API REST de **Consulta** sobre el dominio **Cuentas** para Banca por Internet.

## Alcance del guion
- Lugar: Banca por Internet
- Capacidad: Consulta
- Dominio: Cuentas
- Capa construida: Backend
- Patrón: API REST
- Integración: **Ninguna**
- Persistencia: **No requiere** (implementación en memoria, detrás de una interfaz `AccountRepository`)
- Pruebas: Unitarias + API

## Estructura
```
app/
  core/config.py            # configuración vía variables de entorno
  models/account.py         # modelo de dominio
  repositories/account_repository.py  # interfaz + implementación en memoria
  services/account_service.py         # lógica de negocio de la consulta
  schemas/account.py         # DTOs de entrada/salida (contrato API)
  routers/accounts.py        # endpoints REST
  main.py                    # arranque de FastAPI
tests/
  test_unit_account_service.py  # pruebas unitarias del servicio
  test_api_accounts.py          # pruebas de API con TestClient
requirements.txt / pyproject.toml
.env.example
```

## Endpoints
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Estado del servicio |
| GET | `/api/v1/accounts?owner_id={id}` | Lista cuentas de un titular |
| GET | `/api/v1/accounts/{account_id}` | Detalle de una cuenta |

Errores en formato uniforme estilo `problem+json` (campos `type`, `title`, `status`, `detail`, `instance`).

## Configuración (variables de entorno)
Ver `.env.example`. Sin secretos. Variables:
- `APP_NAME`, `APP_ENV`, `API_PREFIX`, `LOG_LEVEL`, `CORS_ALLOWED_ORIGINS`

## Cómo compilar / ejecutar (sin verificar en este entorno)
```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```
La API quedará disponible en `http://localhost:8000` (docs en `/docs`).

## Pruebas
```bash
pip install -r requirements.txt
pytest -v
```
Incluye:
- **Unitarias**: `tests/test_unit_account_service.py` (lógica de `AccountQueryService` sin FastAPI).
- **API**: `tests/test_api_accounts.py` (usa `TestClient` de FastAPI contra la app real, con repositorio en memoria).

## Datos
Todos los datos (cuentas, titulares, saldos) son **ficticios**, cargados en memoria al iniciar el proceso. No hay conexión a sistemas externos ni integración (según el guion: integración = Ninguna).

## Notas de verificación
- Se verificó **sintaxis** de los archivos Python con el validador local disponible (compilación AST), no se ejecutó la aplicación ni la suite de pruebas en este entorno.
- No se afirma que el proyecto "compila" en el sentido de instalar dependencias y correr `uvicorn`/`pytest` realmente: eso requiere un entorno con Python y pip, fuera del alcance de esta sesión.
- No se afirma que esté listo para producción: falta persistencia real, autenticación/autorización, observabilidad y hardening de seguridad.
