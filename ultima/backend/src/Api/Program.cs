using System.Text.Json.Serialization;
using Npgsql;
using Tarjetas.Notificaciones.Api;
using Tarjetas.Notificaciones.Application;
using Tarjetas.Notificaciones.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ApiExceptionHandler>();
builder.Services.AddSingleton(TimeProvider.System);

// ConnectionStrings__Default (variable de entorno) activa PostgreSQL; si falta, se usa memoria con datos ficticios.
var connectionString = builder.Configuration.GetConnectionString("Default");
var useInMemory = string.IsNullOrWhiteSpace(connectionString);
if (useInMemory)
{
    builder.Services.AddSingleton<INotificationRepository, InMemoryNotificationRepository>();
}
else
{
    builder.Services.AddSingleton(NpgsqlDataSource.Create(connectionString!));
    builder.Services.AddSingleton<INotificationRepository, PostgresNotificationRepository>();
}

builder.Services.AddSingleton<INotificationDispatcher, FakeDispatcher>();
builder.Services.AddSingleton<ICurrentCustomer>(
    new DemoCurrentCustomer(builder.Configuration["Demo:CustomerId"] ?? "CLI-0001"));
builder.Services.AddScoped<NotificationService>();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins(allowedOrigins).WithMethods("GET", "PUT", "PATCH").WithHeaders("Content-Type")));

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors();
app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

if (useInMemory)
{
    var repo = app.Services.GetRequiredService<INotificationRepository>();
    var customer = app.Services.GetRequiredService<ICurrentCustomer>();
    foreach (var n in DemoData.For(customer.CustomerId, TimeProvider.System.GetUtcNow()))
        await repo.AddIfNewAsync(n);
}

app.Run();

public partial class Program;
