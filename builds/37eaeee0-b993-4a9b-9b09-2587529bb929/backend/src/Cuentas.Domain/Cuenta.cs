namespace Cuentas.Domain;

public sealed class Cuenta
{
    public Cuenta(Guid id, Guid titularId, string numeroEnmascarado, string moneda, decimal saldo)
    {
        Id = id;
        TitularId = titularId;
        NumeroEnmascarado = numeroEnmascarado;
        Moneda = moneda;
        Saldo = saldo;
    }

    public Guid Id { get; }
    public Guid TitularId { get; }
    public string NumeroEnmascarado { get; }
    public string Moneda { get; }
    public decimal Saldo { get; private set; }

    public void Debitar(decimal monto)
    {
        if (monto <= 0)
            throw new ReglaNegocioException("monto_invalido", "El monto debe ser mayor que cero.");
        if (Saldo < monto)
            throw new ReglaNegocioException("saldo_insuficiente", "Saldo insuficiente en la cuenta de origen.");
        Saldo -= monto;
    }

    public void Acreditar(decimal monto)
    {
        if (monto <= 0)
            throw new ReglaNegocioException("monto_invalido", "El monto debe ser mayor que cero.");
        Saldo += monto;
    }
}
