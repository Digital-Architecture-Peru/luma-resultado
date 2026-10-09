using Cuentas.Domain;

namespace Cuentas.Application;

public sealed class TransferService
{
    private const int MaxKeyLength = 100;
    private const int MaxDescriptionLength = 140;

    private readonly ITransferUnitOfWorkFactory _factory;

    public TransferService(ITransferUnitOfWorkFactory factory)
    {
        _factory = factory;
    }

    public async Task<TransferResult> ExecuteAsync(TransferCommand command, CancellationToken ct = default)
    {
        Validate(command);

        await using var uow = await _factory.BeginAsync(ct);

        var existing = await uow.FindByKeyAsync(command.IdempotencyKey, ct);
        if (existing is not null)
        {
            return Replay(existing, command);
        }

        var ids = new[] { command.SourceAccountId, command.TargetAccountId }.OrderBy(id => id).ToArray();
        var locked = await uow.LockAccountsAsync(ids, ct);

        var source = locked.FirstOrDefault(a => a.Id == command.SourceAccountId) ?? throw NotFound("origen");
        var target = locked.FirstOrDefault(a => a.Id == command.TargetAccountId) ?? throw NotFound("destino");

        TransferRules.Apply(source, target, command.Amount);

        var result = await uow.RecordTransferAsync(command, source, target, ct);
        await uow.CommitAsync(ct);
        return result;
    }

    private static TransferResult Replay(TransferResult existing, TransferCommand command)
    {
        var samePayload = existing.SourceAccountId == command.SourceAccountId
            && existing.TargetAccountId == command.TargetAccountId
            && existing.Amount == command.Amount;

        if (!samePayload)
        {
            throw new DomainException(ErrorCodes.DuplicateRequest,
                "La clave de idempotencia ya se usó con una solicitud distinta.");
        }

        return existing with { Replayed = true };
    }

    private static void Validate(TransferCommand command)
    {
        if (string.IsNullOrWhiteSpace(command.IdempotencyKey) || command.IdempotencyKey.Length > MaxKeyLength)
        {
            throw new DomainException(ErrorCodes.Validation, "Idempotency-Key es obligatorio (máximo 100 caracteres).");
        }

        if (command.Description is { Length: > MaxDescriptionLength })
        {
            throw new DomainException(ErrorCodes.Validation, "La descripción admite máximo 140 caracteres.");
        }

        Money.EnsureValid(command.Amount);

        if (command.SourceAccountId == command.TargetAccountId)
        {
            throw new DomainException(ErrorCodes.SameAccount, "La cuenta origen y destino deben ser distintas.");
        }
    }

    private static DomainException NotFound(string role) =>
        new(ErrorCodes.AccountNotFound, $"No existe la cuenta {role}.");
}
