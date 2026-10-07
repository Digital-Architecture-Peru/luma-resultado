# Consulta de tarjetas — API .NET 8

API HTTP de solo lectura para consultar tarjetas asociadas a un cliente. Implementada con ASP.NET Core Minimal API y datos ficticios en memoria. La solución no usa base de datos ni requiere servicios externos.

## Requisitos

- .NET SDK 8.0 o posterior. Los proyectos apuntan a `net8.0`; `RollForward=LatestMajor` permite ejecutarlos con un runtime más nuevo si el runtime 8 no está instalado.
- Acceso a NuGet para restaurar los paquetes del proyecto de pruebas (xUnit y Microsoft.NET.Test.Sdk).

## Compilar y probar

Desde la raíz del repositorio:

```sh
cd backend
dotnet restore CardsQuery.sln
dotnet build CardsQuery.sln
dotnet test CardsQuery.sln
```

`dotnet test` ejecuta las pruebas de átomos y del servicio de consulta. Para ejecutar solo las pruebas:

```sh
dotnet test tests/CardsQuery.Tests/CardsQuery.Tests.csproj
```

## Ejecutar la API

Desde `backend/`:

```sh
dotnet run --project src/CardsQuery.Api/CardsQuery.Api.csproj
```

ASP.NET Core informa la URL de escucha al iniciar. Para fijar una URL, por ejemplo:

```sh
ASPNETCORE_URLS=http://localhost:5080 dotnet run --project src/CardsQuery.Api/CardsQuery.Api.csproj
```

En PowerShell se puede configurar con `$env:ASPNETCORE_URLS = 'http://localhost:5080'` antes de ejecutar. No hay credenciales ni configuración de base de datos.

Comprobación rápida, usando la URL indicada por el proceso:

```sh
curl http://localhost:5080/health
curl 'http://localhost:5080/v1/customers/cust-001/cards?page=1&pageSize=10'
curl http://localhost:5080/v1/customers/cust-001/cards/card-001
```

## API

- `GET /health` — responde `200` con `{"status":"UP"}`.
- `GET /v1/customers/{customerId}/cards/` — lista las tarjetas del cliente. Parámetros opcionales: `status` (`Active`, `Blocked` o `Expired`), `page` (por defecto `1`) y `pageSize` (por defecto `10`, rango permitido `1–50`). La lista se ordena por identificador; `total` representa el total tras aplicar el filtro de estado y antes de paginar.
- `GET /v1/customers/{customerId}/cards/{cardId}` — devuelve el detalle de una tarjeta perteneciente a ese cliente.

Los DTO de respuesta incluyen números enmascarados, nunca el número completo. La fecha de expiración se formatea como `MM/yy`; `ExpiresSoon` indica expiración dentro de los próximos 60 días, calculada con la fecha UTC actual.

Errores de consulta devuelven `400` como Problem Details (`application/problem+json`); tarjeta inexistente o ajena al cliente devuelve `404`. Un cliente válido sin tarjetas produce una lista vacía. Ejemplos de datos ficticios: `cust-001` (tarjetas `card-001`, `card-002`, `card-003`) y `cust-002` (`card-004`).

## Integración y persistencia

La aplicación registra `ICardReader` como abstracción de lectura y actualmente la implementa con `InMemoryCardReader`. Ese adaptador mantiene una colección estática de datos de demostración: los cambios no persisten al reiniciar y no existe integración bancaria configurada. Para conectar una fuente real, implemente otro adaptador de `ICardReader` e intercambie su registro en `Program.cs`; el servicio de consulta y los contratos HTTP permanecen desacoplados del origen de datos. No se incluye esquema ni migración de base de datos.

## Estructura

- `backend/src/CardsQuery.Api/Atoms/`: máscara de tarjeta y valor monetario.
- `backend/src/CardsQuery.Api/Domain/`: entidad, puerto de lectura y excepciones del dominio.
- `backend/src/CardsQuery.Api/Molecules/`: DTO y mapeo de salida.
- `backend/src/CardsQuery.Api/Organisms/`: servicio de consulta, validación, filtro y paginación.
- `backend/src/CardsQuery.Api/Adapters/`: adaptador de datos en memoria.
- `backend/tests/CardsQuery.Tests/`: pruebas unitarias.

## Seguridad y alcance

La API es solo de demostración: no implementa autenticación ni autorización. Antes de exponer información real, incorpore controles de identidad y autorización (incluida la asociación del cliente autenticado con `customerId`), transporte seguro y un adaptador de datos aprobado. Los datos incluidos son ficticios.
