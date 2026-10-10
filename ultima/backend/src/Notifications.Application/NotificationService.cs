using Notifications.Domain;

namespace Notifications.Application;

public sealed record NotificationDto(
    Guid Id,
    string AccountMasked,
    string Type,
    string Title,
    string Message,
    DateTimeOffset CreatedAt,
    DateTimeOffset? ReadAt,
    bool IsRead);

public sealed record PreferenceDto(string Type, bool Enabled);

public sealed class InvalidNotificationRequestException(string message) : Exception(message);

public interface INotificationRepository
{
    Task<IReadOnlyList<Notification>> ListAsync(string customerId, string accountId, bool unreadOnly, CancellationToken ct);

    Task<bool> MarkReadAsync(Guid id, string customerId, DateTimeOffset readAt, CancellationToken ct);

    Task<IReadOnlyList<NotificationPreference>> GetPreferencesAsync(string customerId, string accountId, CancellationToken ct);

    Task SavePreferencesAsync(string customerId, string accountId, IReadOnlyList<NotificationPreference> preferences, CancellationToken ct);
}

public sealed class NotificationService(INotificationRepository repository, TimeProvider clock)
{
    private const int MaxIdLength = 20;

    public async Task<IReadOnlyList<NotificationDto>> ListAsync(
        string customerId, string accountId, bool unreadOnly, CancellationToken ct)
    {
        RequireId(customerId, nameof(customerId));
        RequireId(accountId, nameof(accountId));

        var preferences = await GetPreferencesAsync(customerId, accountId, ct);
        var disabled = preferences.Where(p => !p.Enabled).Select(p => p.Type).ToHashSet();
        var items = await repository.ListAsync(customerId, accountId, unreadOnly, ct);

        return items
            .Where(n => !disabled.Contains(n.Type.ToCode()))
            .OrderByDescending(n => n.CreatedAt)
            .Select(ToDto)
            .ToList();
    }

    public Task<bool> MarkReadAsync(string customerId, Guid notificationId, CancellationToken ct)
    {
        RequireId(customerId, nameof(customerId));
        return repository.MarkReadAsync(notificationId, customerId, clock.GetUtcNow(), ct);
    }

    public async Task<IReadOnlyList<PreferenceDto>> GetPreferencesAsync(
        string customerId, string accountId, CancellationToken ct)
    {
        RequireId(customerId, nameof(customerId));
        RequireId(accountId, nameof(accountId));

        var stored = (await repository.GetPreferencesAsync(customerId, accountId, ct))
            .ToDictionary(p => p.Type, p => p.Enabled);

        return NotificationTypeCodes.All
            .Select(t => new PreferenceDto(t.ToCode(), stored.GetValueOrDefault(t, true)))
            .ToList();
    }

    public Task SavePreferencesAsync(
        string customerId, string accountId, IReadOnlyList<PreferenceDto> preferences, CancellationToken ct)
    {
        RequireId(customerId, nameof(customerId));
        RequireId(accountId, nameof(accountId));

        var parsed = preferences.Select(p =>
        {
            if (!NotificationTypeCodes.TryParse(p.Type, out var type))
            {
                throw new InvalidNotificationRequestException($"Tipo de notificación inválido: {p.Type}");
            }

            return new NotificationPreference(type, p.Enabled);
        }).ToList();

        return repository.SavePreferencesAsync(customerId, accountId, parsed, ct);
    }

    private static NotificationDto ToDto(Notification n) => new(
        n.Id, AccountMask.Mask(n.AccountId), n.Type.ToCode(), n.Title, n.Message, n.CreatedAt, n.ReadAt, n.IsRead);

    private static void RequireId(string value, string name)
    {
        if (string.IsNullOrWhiteSpace(value) || value.Length > MaxIdLength)
        {
            throw new InvalidNotificationRequestException($"{name} es obligatorio y no puede superar {MaxIdLength} caracteres.");
        }
    }
}
