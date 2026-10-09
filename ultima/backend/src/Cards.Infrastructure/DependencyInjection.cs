using Cards.Application;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace Cards.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddCardsInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddSingleton(NpgsqlDataSource.Create(connectionString));
        services.AddScoped<ICardTransactionRepository, NpgsqlCardTransactionRepository>();
        services.AddSingleton<ICardProcessorGateway, FakeCardProcessorGateway>();
        return services;
    }
}
