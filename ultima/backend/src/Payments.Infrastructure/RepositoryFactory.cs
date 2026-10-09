using Npgsql;
using Payments.Domain;

namespace Payments.Infrastructure;

/// <summary>Punto único de composición del repositorio según PAYMENTS_STORE.</summary>
public static class RepositoryFactory
{
    public static IPaymentQueryRepository Create(string? store, string? connectionString)
    {
        if (string.Equals(store, "postgres", StringComparison.OrdinalIgnoreCase))
        {
            if (string.IsNullOrWhiteSpace(connectionString))
                throw new InvalidOperationException(
                    "PAYMENTS_DB_CONNECTION es obligatoria cuando PAYMENTS_STORE=postgres.");
            return new PostgresPaymentQueryRepository(NpgsqlDataSource.Create(connectionString));
        }

        return new InMemoryPaymentQueryRepository();
    }
}
