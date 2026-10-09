using Cuentas.Application;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace Cuentas.Infrastructure;

public static class ServiceCollectionExtensions
{
    /// <summary>Punto único de composición de la persistencia PostgreSQL.</summary>
    public static IServiceCollection AddCuentasInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddSingleton(NpgsqlDataSource.Create(connectionString));
        services.AddScoped<IAccountRepository, NpgsqlAccountRepository>();
        services.AddScoped<ITransferUnitOfWorkFactory, NpgsqlTransferUnitOfWorkFactory>();
        return services;
    }
}
