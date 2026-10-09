namespace Cuentas.Api;

/// <summary>Titular simulado fijo (H2): no hay autenticación definida. No apto para producción.</summary>
public static class TitularSimulado
{
    public static readonly Guid Id = Guid.Parse("11111111-1111-1111-1111-111111111111");
}

public sealed record TransferenciaRequest(
    Guid OrigenId,
    Guid DestinoId,
    decimal Monto,
    string? Moneda,
    string? Concepto)
{
    private const int LongitudMaximaClave = 80;

    public Dictionary<string, string[]> Validar(string idempotencyKey)
    {
        var errores = new Dictionary<string, string[]>();
        if (string.IsNullOrWhiteSpace(idempotencyKey) || idempotencyKey.Length > LongitudMaximaClave)
            errores["Idempotency-Key"] = ["Cabecera Idempotency-Key obligatoria (máx. 80 caracteres)."];
        if (OrigenId == Guid.Empty)
            errores[nameof(OrigenId)] = ["La cuenta de origen es obligatoria."];
        if (DestinoId == Guid.Empty)
            errores[nameof(DestinoId)] = ["La cuenta de destino es obligatoria."];
        if (Monto <= 0)
            errores[nameof(Monto)] = ["El monto debe ser mayor que cero."];
        if (string.IsNullOrWhiteSpace(Moneda) || Moneda.Trim().Length != 3)
            errores[nameof(Moneda)] = ["La moneda debe ser un código de 3 letras."];
        return errores;
    }
}
