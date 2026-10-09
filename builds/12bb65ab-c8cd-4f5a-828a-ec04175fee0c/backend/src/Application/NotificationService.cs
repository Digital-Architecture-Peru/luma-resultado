using System.Text.RegularExpressions;
using Tarjetas.Notificaciones.Domain;

namespace Tarjetas.Notificaciones.Application;

public sealed record CardEvent(
    string EventId,
    string CustomerId,
    string CardRef,
    string CardLast4,
    NotificationType Type,
    string Title,
    string Body);

public enum RegisterResult
{
    Created,
    Duplicate,
    Suppressed
}

public sealed partial class NotificationService(
    INotificationRepository repository,
    INotificationDispatcher dispatcher,
    ICurrentCustomer currentCustomer,
    TimeProvider clock)
{
    public const int MaxPageSize = 50;
    private const int MaxTitle = 120;
    private const int MaxBody = 500;

    [GeneratedRegex("^[0-9]{4}$")]
    private static partial Regex Last4Regex();

    public Task<PagedResult<Notification>> ListAsync(
        bool unreadOnly, int page = 1, int pageSize = 20, CancellationToken ct = default)
    {
        if (page < 1) throw new InvalidRequestException("page debe ser >= 1.");
        if (pageSize < 1 || pageSize > MaxPageSize)
            throw new InvalidRequestException($"pageSize debe estar entre 1 y {MaxPageSize}.");
        return repository.ListAsync(currentCustomer.CustomerId, unreadOnly, page, pageSize, ct);
    }

    public async Task MarkReadAsync(Guid id, CancellationToken ct = default)
    {
        var found = await repository.MarkReadAsync(currentCustomer.CustomerId, id, clock.GetUtcNow(), ct);
        if (!found) throw new ResourceNotFoundException("La notificación no existe.");
    }

    public async Task<IReadOnlyList<Preference>> GetPreferencesAsync(CancellationToken ct = default)
    {
        var stored = await repository.GetPreferencesAsync(currentCustomer.CustomerId, ct);
        return Merge(stored);
    }

    public async Task<IReadOnlyList<Preference>> UpdatePreferencesAsync(
        IReadOnlyList<Preference> preferences, CancellationToken ct = default)
    {
        if (preferences is null || preferences.Count == 0)
            throw new InvalidRequestException("Se requiere al menos una preferencia.");
        var distinct = preferences.Select(p => (p.Type, p.Channel)).Distinct().Count();
        if (distinct != preferences.Count)
            throw new InvalidRequestException("Hay preferencias duplicadas para el mismo tipo y canal.");

        await repository.SavePreferencesAsync(currentCustomer.CustomerId, preferences, ct);
        return await GetPreferencesAsync(ct);
    }

    /// <summary>
    /// Registra un evento de tarjeta. Es idempotente por EventId. Solo se guarda en la bandeja
    /// si el cliente tiene habilitado el canal InApp para ese tipo; los demás canales se despachan al puerto.
    /// </summary>
    public async Task<RegisterResult> RegisterEventAsync(CardEvent cardEvent, CancellationToken ct = default)
    {
        Validate(cardEvent);

        var prefs = Merge(await repository.GetPreferencesAsync(cardEvent.CustomerId, ct));
        var enabled = prefs.Where(p => p.Type == cardEvent.Type && p.Enabled).Select(p => p.Channel).ToList();
        if (!enabled.Contains(Channel.InApp)) return RegisterResult.Suppressed;

        var notification = new Notification(
            Guid.NewGuid(), cardEvent.CustomerId, cardEvent.CardRef, cardEvent.CardLast4,
            cardEvent.Type, cardEvent.Title, cardEvent.Body, cardEvent.EventId,
            clock.GetUtcNow(), null);

        if (!await repository.AddIfNewAsync(notification, ct)) return RegisterResult.Duplicate;

        foreach (var channel in enabled.Where(c => c != Channel.InApp))
            await dispatcher.DispatchAsync(notification, channel, ct);

        return RegisterResult.Created;
    }

    private static void Validate(CardEvent e)
    {
        if (string.IsNullOrWhiteSpace(e.EventId)) throw new InvalidRequestException("EventId es obligatorio.");
        if (string.IsNullOrWhiteSpace(e.CustomerId)) throw new InvalidRequestException("CustomerId es obligatorio.");
        if (string.IsNullOrWhiteSpace(e.CardRef)) throw new InvalidRequestException("CardRef es obligatorio.");
        if (!Last4Regex().IsMatch(e.CardLast4 ?? string.Empty))
            throw new InvalidRequestException("CardLast4 debe tener exactamente 4 dígitos.");
        if (!Enum.IsDefined(e.Type)) throw new InvalidRequestException("Tipo de notificación inválido.");
        if (string.IsNullOrWhiteSpace(e.Title) || e.Title.Length > MaxTitle)
            throw new InvalidRequestException($"Title es obligatorio y de máximo {MaxTitle} caracteres.");
        if (string.IsNullOrWhiteSpace(e.Body) || e.Body.Length > MaxBody)
            throw new InvalidRequestException($"Body es obligatorio y de máximo {MaxBody} caracteres.");
    }

    // Por defecto solo InApp está habilitado; el resto de canales es opt-in.
    private static IReadOnlyList<Preference> Merge(IEnumerable<Preference> stored)
    {
        var map = stored.ToDictionary(p => (p.Type, p.Channel), p => p.Enabled);
        return (from type in Enum.GetValues<NotificationType>()
                from channel in Enum.GetValues<Channel>()
                select new Preference(
                    type, channel,
                    map.TryGetValue((type, channel), out var enabled) ? enabled : channel == Channel.InApp))
            .ToList();
    }
}
