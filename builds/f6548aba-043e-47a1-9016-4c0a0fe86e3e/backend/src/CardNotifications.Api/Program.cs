using System.Text.Json.Serialization;
using CardNotifications.Api;
using CardNotifications.Application;
using CardNotifications.Infrastructure;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Notifications");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Falta la variable de entorno ConnectionStrings__Notifications (ver README).");
}

builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ApiExceptionHandler>();

builder.Services.AddSingleton(NpgsqlDataSource.Create(connectionString));
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddScoped<INotificationRepository, PgNotificationRepository>();
builder.Services.AddSingleton<ICardEventSource, FakeCardEventSource>();
builder.Services.AddSingleton<IChannelDispatcher, FakeChannelDispatcher>();
builder.Services.AddScoped<NotificationService>();
builder.Services.AddSingleton<ICurrentCustomer, CurrentCustomer>();

var app = builder.Build();

app.UseMiddleware<CorrelationIdMiddleware>();
app.UseExceptionHandler();
app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

if (app.Environment.IsDevelopment())
{
    // Solo desarrollo: genera notificaciones a partir de la fuente de eventos ficticia.
    app.MapPost("/api/v1/cards/notifications/simulate",
        async (NotificationService service, CancellationToken ct) =>
            Results.Ok(new { created = await service.IngestAsync(ct) }));
}

app.Run();
