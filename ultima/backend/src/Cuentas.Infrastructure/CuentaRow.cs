using Cuentas.Application;
using Cuentas.Domain;

namespace Cuentas.Infrastructure;

/// <summary>Filas planas para Dapper; se traducen al modelo de dominio.</summary>
internal sealed class CuentaRow
{
    public Guid Id { get; set; }
    public Guid TitularId { get; set; }
    public string NumeroEnmascarado { get; set; } = "";
    public string Moneda { get; set; } = "";
    public decimal Saldo { get; set; }

    public Cuenta ToDomain() => new(Id, TitularId, NumeroEnmascarado, Moneda, Saldo);
}

internal sealed class TransferenciaRow
{
    public Guid Id { get; set; }
    public Guid OrigenId { get; set; }
    public Guid DestinoId { get; set; }
    public decimal Monto { get; set; }
    public string Moneda { get; set; } = "";
    public string? Concepto { get; set; }
    public string Estado { get; set; } = "";
    public DateTime CreadoEn { get; set; }
    public decimal SaldoOrigen { get; set; }

    public ComprobanteTransferencia ToDomain() =>
        new(Id, OrigenId, DestinoId, Monto, Moneda.Trim(), Concepto, Estado,
            DateTime.SpecifyKind(CreadoEn, DateTimeKind.Utc), SaldoOrigen);
}
