using CardNotifications.Domain;

namespace CardNotifications.Application;

public sealed record NotificationPage(IReadOnlyList<Notification> Items, int Unread, int Page, int Size);

public sealed class NotificationService(
    INotificationRepository repository,
    ICardEventSource eventSource,
    IChannelDispatcher dispatcher,
    TimeProvider clock)
{
    public const int MaxPageSize = 50;

    public async Task<NotificationPage> ListAsync(string customerId, bool unreadOnly, int page, int size, CancellationToken ct)
    {
        if (page < 1 || size < 1 || size > MaxPageSize)
            throw new DomainValidationException(new[] { $"page debe ser >= 1 y size entre 1 y {MaxPageSize}." });

        var items = await repository.ListAsync(customerId, unreadOnly, page, size, ct);
        var unread = await repository.CountUnreadAsync(customerId, ct);
        return new NotificationPage(items, unread, page, size);
    }

    public async Task MarkReadAsync(string customerId, Guid id, CancellationToken ct)
    {
        var found = await repository.MarkReadAsync(customerId, id, clock.GetUtcNow(), ct);
        if (!found) throw new NotFoundException("La notificación no existe.");
    }

    public Task<int> MarkAllReadAsync(string customerId, CancellationToken ct) =>
        repository.MarkAllReadAsync(customerId, clock.GetUtcNow(), ct);

    public async Task<IReadOnlyList<Preference>> GetPreferencesAsync(string customerId, CancellationToken ct) =>
        PreferenceRules.Merge(await repository.GetPreferencesAsync(customerId, ct));

    public async Task<IReadOnlyList<Preference>> SavePreferencesAsync(
        string customerId, IReadOnlyCollection<Preference> preferences, CancellationToken ct)
    {
        var errors = PreferenceRules.Validate(preferences);
        if (errors.Count > 0) throw new DomainValidationException(errors);

        var merged = PreferenceRules.Merge(preferences);
        await repository.SavePreferencesAsync(customerId, merged, ct);
        return merged;
    }

    /// <summary>
    /// Convierte eventos de tarjeta en notificaciones según las preferencias del cliente.
    /// Los eventos inválidos se omiten sin detener el lote.
    /// </summary>
    /// <returns>Cantidad de notificaciones in-app creadas.</returns>
    public async Task<int> IngestAsync(CancellationToken ct)
    {
        var created = 0;
        foreach (var cardEvent in await eventSource.PullAsync(ct))
        {
            Notification notification;
            try
            {
                notification = Notification.FromEvent(cardEvent, Guid.NewGuid(), clock.GetUtcNow());
            }
            catch (DomainValidationException)
            {
                continue;
            }

            var preferences = PreferenceRules.Merge(await repository.GetPreferencesAsync(cardEvent.CustomerId, ct));
            foreach (var preference in preferences.Where(p => p.EventType == cardEvent.Type && p.Enabled))
            {
                if (preference.Channel == Channel.InApp)
                {
                    await repository.AddAsync(notification, ct);
                    created++;
                }
                else
                {
                    await dispatcher.DispatchAsync(preference.Channel, notification, ct);
                }
            }
        }
        return created;
    }
}
