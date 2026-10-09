using Cuentas.Application;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace Cuentas.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfraestructura(this IServiceCollection servicios, string connectionString)
    {
        servicios.AddSingleton(NpgsqlDataSource.Create(connectionString));
        servicios.AddScoped<IUnitOfWork, NpgsqlUnitOfWork>();
        servicios.AddScoped<ICuentaRepository, NpgsqlCuentaRepository>();
        return servicios;
    }
}
