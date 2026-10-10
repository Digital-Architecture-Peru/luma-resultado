using Notifications.Application;
using Notifications.Domain;
using Notifications.Infrastructure;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Notifications")
    ?? throw new InvalidOperationException(
        "Falta la variable de entorno ConnectionStrings__Notifications (ver .env.example).");

builder.Services.AddSingleton(NpgsqlDataSource.Create(connectionString));
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddScoped<INotificationRepository, PgNotificationRepository>();
builder.Services.AddScoped<INotificationChannel, InAppChannel>();
builder.Services.AddScoped<NotificationService>();
builder.Services.AddControllers();

var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

// Manejo centralizado de errores: problem+json sin exponer detalles internos.
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (DomainValidationException ex)
    {
        await WriteProblem(context, StatusCodes.Status422UnprocessableEntity, "Entrada inválida", ex.Message);
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "Error no controlado en {Path}", context.Request.Path.Value);
        await WriteProblem(context, StatusCodes.Status500InternalServerError, "Error interno", "Ocurrió un error inesperado.");
    }
});

app.UseCors();
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapControllers();
app.Run();

static Task WriteProblem(HttpContext context, int status, string title, string detail)
{
    context.Response.StatusCode = status;
    context.Response.ContentType = "application/problem+json";
    return context.Response.WriteAsJsonAsync(new { type = "about:blank", title, status, detail });
}
