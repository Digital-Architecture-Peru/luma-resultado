namespace Cuentas.Domain;

public static class Money
{
    public static void EnsureValid(decimal amount)
    {
        if (amount <= 0)
        {
            throw new DomainException(ErrorCodes.Validation, "El monto debe ser mayor que 0.");
        }

        if (decimal.Round(amount, 2) != amount)
        {
            throw new DomainException(ErrorCodes.Validation, "El monto admite máximo 2 decimales.");
        }
    }
}

public sealed class Account
{
    public Account(long id, string number, string holder, string currency, decimal balance)
    {
        Id = id;
        Number = number;
        Holder = holder;
        Currency = currency;
        Balance = balance;
    }

    public long Id { get; }
    public string Number { get; }
    public string Holder { get; }
    public string Currency { get; }
    public decimal Balance { get; private set; }

    public void Debit(decimal amount)
    {
        Money.EnsureValid(amount);
        if (Balance < amount)
        {
            throw new DomainException(ErrorCodes.InsufficientFunds, "Saldo insuficiente en la cuenta origen.");
        }

        Balance -= amount;
    }

    public void Credit(decimal amount)
    {
        Money.EnsureValid(amount);
        Balance += amount;
    }
}

public enum EntryType
{
    Debit,
    Credit
}

/// <summary>Movimiento de una cuenta (modelo de lectura).</summary>
public sealed record LedgerEntry(
    long Id,
    long AccountId,
    long TransferId,
    EntryType Type,
    decimal Amount,
    string? Description,
    DateTimeOffset CreatedAt);
