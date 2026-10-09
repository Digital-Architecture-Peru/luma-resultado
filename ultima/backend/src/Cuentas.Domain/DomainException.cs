namespace Cuentas.Domain;

public static class ErrorCodes
{
    public const string Validation = "VALIDATION_ERROR";
    public const string AccountNotFound = "ACCOUNT_NOT_FOUND";
    public const string DuplicateRequest = "DUPLICATE_REQUEST";
    public const string SameAccount = "SAME_ACCOUNT";
    public const string CurrencyMismatch = "CURRENCY_MISMATCH";
    public const string InsufficientFunds = "INSUFFICIENT_FUNDS";
}

/// <summary>Error de regla de negocio con un código estable que la API traduce a HTTP.</summary>
public sealed class DomainException : Exception
{
    public DomainException(string code, string message) : base(message)
    {
        Code = code;
    }

    public string Code { get; }
}
