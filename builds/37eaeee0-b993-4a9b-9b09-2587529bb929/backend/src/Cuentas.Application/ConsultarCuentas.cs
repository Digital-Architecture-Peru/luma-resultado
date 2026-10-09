namespace Cuentas.Application;

public sealed class ConsultarCuentas
{
    private readonly ICuentaRepository _repositorio;

    public ConsultarCuentas(ICuentaRepository repositorio)
    {
        _repositorio = repositorio;
    }

    public async Task<IReadOnlyList<CuentaDto>> EjecutarAsync(Guid titularId, CancellationToken ct)
    {
        var cuentas = await _repositorio.ListarPorTitularAsync(titularId, ct);
        return cuentas
            .Select(c => new CuentaDto(c.Id, c.NumeroEnmascarado, c.Moneda, c.Saldo))
            .ToList();
    }
}
