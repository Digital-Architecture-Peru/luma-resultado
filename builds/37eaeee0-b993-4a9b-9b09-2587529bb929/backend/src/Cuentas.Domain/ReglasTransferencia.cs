namespace Cuentas.Domain;

/// <summary>Reglas de transferencia entre cuentas propias, misma moneda (H1).</summary>
public static class ReglasTransferencia
{
    public const int LongitudMaximaConcepto = 140;

    public static void Validar(Cuenta origen, Cuenta destino, decimal monto, string moneda)
    {
        if (monto <= 0 || decimal.Round(monto, 2) != monto)
            throw new ReglaNegocioException("monto_invalido", "El monto debe ser mayor que cero y tener máximo 2 decimales.");
        if (origen.Id == destino.Id)
            throw new ReglaNegocioException("cuentas_iguales", "La cuenta de origen y destino deben ser distintas.");
        if (origen.Moneda != destino.Moneda || origen.Moneda != moneda)
            throw new ReglaNegocioException("moneda_distinta", "Las cuentas y la transferencia deben usar la misma moneda.");
        if (origen.Saldo < monto)
            throw new ReglaNegocioException("saldo_insuficiente", "Saldo insuficiente en la cuenta de origen.");
    }

    public static void ValidarConcepto(string? concepto)
    {
        if (concepto is { Length: > LongitudMaximaConcepto })
            throw new ReglaNegocioException("concepto_invalido", $"El concepto admite máximo {LongitudMaximaConcepto} caracteres.");
    }
}
