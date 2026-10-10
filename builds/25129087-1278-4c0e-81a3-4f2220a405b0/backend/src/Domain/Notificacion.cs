namespace Tarjetas.Notificaciones.Domain;

public enum TipoNotificacion { Compra, Limite, Vencimiento, Pago }

public enum CanalNotificacion { Web, Email, Sms, Push }

/// <summary>Alerta de una tarjeta. Solo guarda token y últimos 4 dígitos, nunca el PAN.</summary>
public sealed record Notificacion(
    Guid Id,
    string ClienteId,
    string TarjetaRef,
    string Ultimos4,
    TipoNotificacion Tipo,
    string Titulo,
    string Mensaje,
    decimal? Monto,
    string? Moneda,
    bool Leida,
    DateTimeOffset CreadaEn);

public sealed record Preferencia(
    string ClienteId,
    string TarjetaRef,
    TipoNotificacion Tipo,
    CanalNotificacion Canal,
    bool Habilitada,
    decimal? UmbralMonto);
