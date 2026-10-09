using System.Text.RegularExpressions;

namespace Payments.Application;

public static class PaymentRequestValidator
{
    public const int MaxConceptLength = 140;
    private static readonly Regex AccountPattern = new(@"^\d{10,20}$", RegexOptions.Compiled);
    private static readonly HashSet<string> AllowedCurrencies = new(StringComparer.Ordinal) { "PEN", "USD" };

    public static IDictionary<string, string[]> Validate(CreatePaymentRequest request, PaymentPolicy policy)
    {
        var errors = new Dictionary<string, string[]>();

        if (!AccountPattern.IsMatch(request.SourceAccountId ?? ""))
            errors["sourceAccountId"] = new[] { "La cuenta de origen debe tener entre 10 y 20 dígitos." };

        if (!AccountPattern.IsMatch(request.BeneficiaryAccount ?? ""))
            errors["beneficiaryAccount"] = new[] { "La cuenta destino debe tener entre 10 y 20 dígitos." };
        else if (request.BeneficiaryAccount == request.SourceAccountId)
            errors["beneficiaryAccount"] = new[] { "La cuenta destino debe ser distinta de la cuenta de origen." };

        if (request.Amount <= 0)
            errors["amount"] = new[] { "El monto debe ser mayor que cero." };
        else if (decimal.Round(request.Amount, 2) != request.Amount)
            errors["amount"] = new[] { "El monto admite como máximo dos decimales." };
        else if (request.Amount > policy.MaxAmount)
            errors["amount"] = new[] { $"El monto no puede superar {policy.MaxAmount:0.00} por operación." };

        if (!AllowedCurrencies.Contains(request.Currency ?? ""))
            errors["currency"] = new[] { "Moneda no soportada. Use PEN o USD." };

        if ((request.Concept ?? "").Length > MaxConceptLength)
            errors["concept"] = new[] { $"El concepto admite como máximo {MaxConceptLength} caracteres." };

        return errors;
    }
}
