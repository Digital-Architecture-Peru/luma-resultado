using Microsoft.Extensions.DependencyInjection;
using Notifications.Application;
using Npgsql;

namespace Notifications.Infrastructure;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddNotificationsInfrastructure(
        this IServiceCollection services, string connectionString)
    {
        services.AddSingleton(NpgsqlDataSource.Create(connectionString));
        services.AddSingleton<INotificationRepository, NpgsqlNotificationRepository>();
        return services;
    }
}
