# Contrato esperado por el adaptador HTTP

Este documento describe el contrato que consume `src/adapters/httpTaskRepository.js`; es un contrato candidate de la microapp, no una especificación de un backend existente. Las rutas se concatenan a `VITE_API_BASE_URL`. El adaptador envía `Content-Type: application/json` en todas las peticiones.

## Modelo

```json
{"id":"t-1","title":"Preparar demo","done":false}
```

`id` debe ser una cadena estable, `title` una cadena y `done` un booleano. Las tareas de `GET` deben devolverse como una lista JSON.

## Operaciones

| Método y ruta | Solicitud | Respuesta que consume el cliente |
|---|---|---|
| `GET /tasks` | Sin cuerpo | `200` y array de tareas |
| `POST /tasks` | JSON `{ "title": "Preparar demo" }` | JSON de la tarea creada, incluida su `id` |
| `PATCH /tasks/{id}/toggle` | Sin cuerpo | JSON de la tarea actualizada |
| `DELETE /tasks/{id}` | Sin cuerpo | `204 No Content` |

Los identificadores se codifican como componente de URL. Las respuestas no `2xx` se convierten en un error genérico `Error HTTP <status>` en el cliente. Para que la interfaz siga reflejando el modelo, el backend debe persistir cada escritura y devolver la tarea actualizada en las operaciones create/toggle. Debe validar y limitar `title` por su cuenta (el cliente normaliza espacios, requiere texto y limita a 120 caracteres); la validación cliente no sustituye la del servidor.

## Responsabilidades de integración

- Implementar el contrato y la persistencia del lado servidor; no hay API ni base de datos incluida en este proyecto.
- Configurar CORS para el origen desde el que se sirve el frontend.
- Mantener secretos y credenciales en el backend, nunca en variables `VITE_*` ni en el bundle.
- Definir autenticación/autorización si el servicio maneja información protegida; el adaptador actual no agrega credenciales ni gestiona sesiones.
- Probar el contrato con el servicio real antes de habilitar `VITE_DATA_MODE=http`.
