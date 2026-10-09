namespace CardNotifications.Domain;

/// <summary>Reglas de preferencias: matriz completa evento × canal, con avisos de seguridad no desactivables.</summary>
public static class PreferenceRules
{
    private static readonly NotificationType[] ProtectedInApp =
    {
        NotificationType.CardBlocked,
        NotificationType.CardUnblocked,
        NotificationType.PurchaseDeclined
    };

    /// <summary>Los avisos de seguridad siempre se muestran en la banca por Internet.</summary>
    public static bool IsLocked(NotificationType type, Channel channel) =>
        channel == Channel.InApp && ProtectedInApp.Contains(type);

    public static IReadOnlyList<Preference> Defaults() =>
        Enum.GetValues<NotificationType>()
            .SelectMany(t => Enum.GetValues<Channel>().Select(c => new Preference(t, c, c == Channel.InApp)))
            .ToList();

    /// <summary>Combina lo guardado con los valores por defecto y fuerza los canales bloqueados.</summary>
    public static IReadOnlyList<Preference> Merge(IEnumerable<Preference> stored)
    {
        var overrides = stored
            .GroupBy(p => (p.EventType, p.Channel))
            .ToDictionary(g => g.Key, g => g.Last().Enabled);

        return Defaults()
            .Select(d => d with
            {
                Enabled = IsLocked(d.EventType, d.Channel)
                    || (overrides.TryGetValue((d.EventType, d.Channel), out var enabled) ? enabled : d.Enabled)
            })
            .ToList();
    }

    public static IReadOnlyList<string> Validate(IReadOnlyCollection<Preference> preferences)
    {
        var errors = new List<string>();
        var seen = new HashSet<(NotificationType, Channel)>();

        foreach (var p in preferences)
        {
            if (!Enum.IsDefined(p.EventType) || !Enum.IsDefined(p.Channel))
            {
                errors.Add("Evento o canal desconocido.");
                continue;
            }
            if (!seen.Add((p.EventType, p.Channel)))
                errors.Add($"Preferencia duplicada: {p.EventType}/{p.Channel}.");
            if (!p.Enabled && IsLocked(p.EventType, p.Channel))
                errors.Add($"{p.EventType} en {p.Channel} no se puede desactivar.");
        }
        return errors;
    }
}
