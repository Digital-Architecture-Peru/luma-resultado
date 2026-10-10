using System.Text.RegularExpressions;
using Notifications.Domain;

namespace Notifications.Application;

public sealed class NotificationService
{
    private const int MaxIdLength = 64;
    private const int MaxPageSize = 100;
    private static readonly Regex CurrencyPattern = new("^[A-Z]{3}$", RegexOptions.Compiled);

    private readonly INotificationRepository _repository;
    private readonly IEnumerable<INotificationChannel> _channels;
    private readonly TimeProvider _clock;

    public NotificationService(
        INotificationRepository repository, IEnumerable<INotificationChannel> channels, TimeProvider clock)
    {
        _repository = repository;
        _channels = channels;
        _clock = clock;
    }

    public async Task<IngestResult> IngestAsync(string customerId, PaymentEvent evt, CancellationToken ct)
    {
        RequireId(customerId, "customerId");
        RequireId(evt.PaymentEventId, "paymentEventId");
        if (!NotificationCodes.TryParseType(evt.Type, out var type))
            throw new DomainValidationException("Tipo de evento no soportado.");
        if (evt.Amount <= 0)
            throw new DomainValidationException("El monto debe ser mayor que cero.");
        if (!CurrencyPattern.IsMatch(evt.Currency ?? string.Empty))
            throw new DomainValidationException("La moneda debe ser un código ISO de 3 letras mayúsculas.");

        var notification = NotificationFactory.FromPayment(
            Guid.NewGuid(), customerId, evt.PaymentEventId, type, evt.Amount, evt.Currency!,
            AccountMasker.Mask(evt.Account), _clock.GetUtcNow());

        var delivered = false;
        foreach (var channel in _channels)
            delivered |= await channel.DeliverAsync(notification, ct);

        return new IngestResult(delivered, NotificationDto.From(notification));
    }

    public async Task<IReadOnlyList<NotificationDto>> ListAsync(
        string customerId, string? status, int page, int size, CancellationToken ct)
    {
        RequireId(customerId, "customerId");
        if (page < 1) throw new DomainValidationException("page debe ser >= 1.");
        if (size < 1 || size > MaxPageSize) throw new DomainValidationException($"size debe estar entre 1 y {MaxPageSize}.");

        NotificationStatus? filter = null;
        if (!string.IsNullOrEmpty(status))
        {
            if (!NotificationCodes.TryParseStatus(status, out var parsed))
                throw new DomainValidationException("status debe ser UNREAD o READ.");
            filter = parsed;
        }

        var items = await _repository.ListAsync(customerId, filter, page, size, ct);
        return items.Select(NotificationDto.From).ToList();
    }

    public Task<int> UnreadCountAsync(string customerId, CancellationToken ct)
    {
        RequireId(customerId, "customerId");
        return _repository.CountUnreadAsync(customerId, ct);
    }

    public async Task<NotificationDto?> MarkReadAsync(string customerId, Guid id, CancellationToken ct)
    {
        RequireId(customerId, "customerId");
        var updated = await _repository.MarkReadAsync(customerId, id, _clock.GetUtcNow(), ct);
        return updated is null ? null : NotificationDto.From(updated);
    }

    private static void RequireId(string? value, string name)
    {
        if (string.IsNullOrWhiteSpace(value) || value.Length > MaxIdLength)
            throw new DomainValidationException($"{name} es obligatorio y admite hasta {MaxIdLength} caracteres.");
    }
}
