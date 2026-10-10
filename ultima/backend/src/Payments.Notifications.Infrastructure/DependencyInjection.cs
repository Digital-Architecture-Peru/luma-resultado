using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using Payments.Notifications.Application;

namespace Payments.Notifications.Infrastructure;

public static class DependencyInjection
{
    /// <summary>
    /// Registra la persistencia. Con ConnectionStrings__Notifications usa PostgreSQL;
    /// sin ella usa el repositorio en memoria con datos ficticios.
    /// </summary>
    public static IServiceCollection AddNotificationsInfrastructure(
        this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<INotificationSource, FakeNotificationSource>();

        var connectionString = configuration["ConnectionStrings:Notifications"];
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            services.AddSingleton<INotificationRepository, InMemoryNotificationRepository>();
        }
        else
        {
            services.AddSingleton(NpgsqlDataSource.Create(connectionString));
            services.AddSingleton<INotificationRepository, PostgresNotificationRepository>();
        }

        return services;
    }
}
