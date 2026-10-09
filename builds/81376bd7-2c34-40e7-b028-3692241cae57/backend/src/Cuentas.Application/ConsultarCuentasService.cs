using Cuentas.Application.Dtos;

namespace Cuentas.Application;

public sealed class ConsultarCuentasService
{
    private const int DigitosVisibles = 4;
    private readonly ICuentaRepository _repositorio;

    public ConsultarCuentasService(ICuentaRepository repositorio)
    {
        _repositorio = repositorio;
    }

    public async Task<IReadOnlyList<CuentaDto>> ListarAsync(Guid clienteId, CancellationToken ct = default)
    {
        var cuentas = await _repositorio.ListarPorClienteAsync(clienteId, ct);
        return cuentas
            .Where(c => c.ClienteId == clienteId)
            .Select(ADto)
            .ToList();
    }

    public async Task<CuentaDto?> ObtenerAsync(Guid clienteId, Guid cuentaId, CancellationToken ct = default)
    {
        var cuenta = await _repositorio.ObtenerAsync(clienteId, cuentaId, ct);
        return cuenta is null || cuenta.ClienteId != clienteId ? null : ADto(cuenta);
    }

    public static string Enmascarar(string numero)
    {
        if (string.IsNullOrEmpty(numero)) return "****";
        var visibles = numero.Length <= DigitosVisibles ? numero : numero[^DigitosVisibles..];
        return "****" + visibles;
    }

    private static CuentaDto ADto(Cuenta c) =>
        new(c.Id, Enmascarar(c.Numero), c.Tipo, c.Moneda, c.Saldo, c.Estado, c.ActualizadoEn);
}
