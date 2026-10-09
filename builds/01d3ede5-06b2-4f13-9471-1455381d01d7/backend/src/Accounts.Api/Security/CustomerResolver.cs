namespace Accounts.Security;

/// <summary>
/// Obtiene el customer_id. En producción se espera un claim "customer_id" emitido aguas arriba.
/// SOLO en Development se acepta el encabezado X-Customer-Id (NO apto para producción).
/// </summary>
public static class CustomerResolver
{
    public const string ClaimType = "customer_id";
    public const string DevHeader = "X-Customer-Id";

    public static bool TryResolve(HttpContext ctx, IHostEnvironment env, out Guid customerId)
    {
        var claim = ctx.User.FindFirst(ClaimType)?.Value;
        if (Guid.TryParse(claim, out customerId))
        {
            return true;
        }

        if (env.IsDevelopment() && Guid.TryParse(ctx.Request.Headers[DevHeader].ToString(), out customerId))
        {
            return true;
        }

        customerId = Guid.Empty;
        return false;
    }
}
