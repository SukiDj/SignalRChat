using API.SignalR;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ChatDbContext>(opt =>
    {
        opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
    });

builder.Services.AddCors(opt =>
    {
        opt.AddPolicy("CorsPolicy", policy =>
        {
            policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials()
                .WithExposedHeaders("WWW-Authenticate", "Pagination")
                .WithOrigins("http://localhost:5000", "https://localhost:5000", "http://localhost:8080", "http://localhost:3000");
        });
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");
app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/chatHub");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<ChatDbContext>();
    await context.Database.MigrateAsync();
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}

app.Run();
