namespace Cuentas.Application;

/// <summary>Puerto de lectura de cuentas; la implementación vive en Infrastructure.</summary>
public interface ICuentaRepository
{
    Task<IReadOnlyList<Cuenta>> ListarPorClienteAsync(Guid clienteId, CancellationToken ct);

    Task<Cuenta?> ObtenerAsync(Guid clienteId, Guid cuentaId, CancellationToken ct);
}
