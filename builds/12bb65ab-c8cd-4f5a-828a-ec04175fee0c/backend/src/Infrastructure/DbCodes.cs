using Tarjetas.Notificaciones.Domain;

namespace Tarjetas.Notificaciones.Infrastructure;

/// <summary>Traducción explícita entre enums del dominio y los códigos almacenados en PostgreSQL.</summary>
internal static class DbCodes
{
    public static string ToDb(NotificationType type) => type switch
    {
        NotificationType.Compra => "COMPRA",
        NotificationType.Bloqueo => "BLOQUEO",
        NotificationType.Vencimiento => "VENCIMIENTO",
        NotificationType.PagoMinimo => "PAGO_MINIMO",
        _ => throw new ArgumentOutOfRangeException(nameof(type))
    };

    public static NotificationType TypeFromDb(string code) => code switch
    {
        "COMPRA" => NotificationType.Compra,
        "BLOQUEO" => NotificationType.Bloqueo,
        "VENCIMIENTO" => NotificationType.Vencimiento,
        "PAGO_MINIMO" => NotificationType.PagoMinimo,
        _ => throw new InvalidOperationException($"Tipo desconocido en BD: {code}")
    };

    public static string ToDb(Channel channel) => channel switch
    {
        Channel.InApp => "IN_APP",
        Channel.Email => "EMAIL",
        Channel.Sms => "SMS",
        Channel.Push => "PUSH",
        _ => throw new ArgumentOutOfRangeException(nameof(channel))
    };

    public static Channel ChannelFromDb(string code) => code switch
    {
        "IN_APP" => Channel.InApp,
        "EMAIL" => Channel.Email,
        "SMS" => Channel.Sms,
        "PUSH" => Channel.Push,
        _ => throw new InvalidOperationException($"Canal desconocido en BD: {code}")
    };
}
