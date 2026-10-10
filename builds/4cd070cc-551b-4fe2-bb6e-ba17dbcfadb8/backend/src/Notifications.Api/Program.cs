using Notifications.Application;
using Notifications.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// La cadena de conexión viene solo del entorno (sin secretos en el repositorio).
var connectionString = builder.Configuration["NOTIF_DB_CONNECTION"]
    ?? Environment.GetEnvironmentVariable("NOTIF_DB_CONNECTION")
    ?? "";
var allowedOrigin = builder.Configuration["NOTIF_ALLOWED_ORIGIN"] ?? "http://localhost:4200";

builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<INotificationRepository>(_ => new PgNotificationRepository(connectionString));
builder.Services.AddScoped<NotificationService>();
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins(allowedOrigin).WithHeaders("Content-Type", "X-Customer-Id").WithMethods("GET", "PATCH")));

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors();
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapControllers();

app.Run();

public partial class Program;
