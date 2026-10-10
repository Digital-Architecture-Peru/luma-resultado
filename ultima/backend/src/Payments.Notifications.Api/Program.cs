using Payments.Notifications.Api;
using Payments.Notifications.Application;
using Payments.Notifications.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ApiExceptionHandler>();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddNotificationsInfrastructure(builder.Configuration);

// Orígenes permitidos separados por coma (variable Cors__Origins).
var origins = (builder.Configuration["Cors:Origins"] ?? "http://localhost:5173")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p
    .WithOrigins(origins)
    .WithMethods("GET", "PATCH")
    .WithHeaders("Content-Type", CustomerIdResolver.HeaderName)));

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors();
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapControllers();

app.Run();

public partial class Program;
