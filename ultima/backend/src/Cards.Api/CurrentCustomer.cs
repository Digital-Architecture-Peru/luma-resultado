namespace Cards.Api;

/// <summary>
/// Identifica al cliente por el contexto autenticado (claim), nunca por la URL (previene IDOR).
/// El header de demo solo se acepta en el entorno Development.
/// </summary>
public static class CurrentCustomer
{
    public const string ClaimType = "customer_id";
    public const string DemoHeader = "X-Demo-Customer-Id";

    public static Guid? Resolve(HttpContext context, IHostEnvironment environment)
    {
        var claim = context.User.FindFirst(ClaimType)?.Value;
        if (Guid.TryParse(claim, out var fromClaim))
        {
            return fromClaim;
        }

        if (environment.IsDevelopment()
            && Guid.TryParse(context.Request.Headers[DemoHeader].FirstOrDefault(), out var demo))
        {
            return demo;
        }

        return null;
    }
}
