using API.Data;
using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TuProyecto.Servicios;

var builder = WebApplication.CreateBuilder(args);
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]);

// Carga configuración de appsettings.json y variables de entorno
builder.Configuration
       .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
       .AddEnvironmentVariables();

// 1) Agrega servicios al contenedor
builder.Services.AddControllers();

// 2) Registra tu DbContext con SQL Server
builder.Services.AddDbContext<MyDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


// 3) Registra la lógica de negocio para inyección de dependencias
builder.Services.AddScoped<LogicaPersona>();
builder.Services.AddScoped<LogicaMatricula>();
builder.Services.AddScoped<LogicaUtilitarios>();
builder.Services.AddScoped<JwtTokenHelper>();
builder.Services.AddScoped<LogicaForo>();
builder.Services.AddScoped<LogicaClases>();

builder.Services.AddScoped<BlobStorageService>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();

    // Lee la cadena de conexión y el nombre del contenedor desde appsettings.json
    var connectionString = configuration.GetSection("BlobStorage")["ConnectionString"];
    var containerName = configuration.GetSection("BlobStorage")["ContainerName"];

    return new BlobStorageService(connectionString, containerName);
});



// 4) Configura Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ─── NUEVO: Configura CORS ─────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000")   // Cambia al origen de tu frontend
            .AllowAnyHeader()
            .AllowAnyMethod();
        // .AllowCredentials(); // si necesitas enviar cookies o auth
    });
});
// ───────────────────────────────────────────────────────────────────────────────

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateLifetime = true
    };
});



var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ─── NUEVO: Habilita CORS ──────────────────────────────────────────────────────
app.UseCors("AllowFrontend");
// ───────────────────────────────────────────────────────────────────────────────

app.UseAuthentication();


app.UseAuthorization();

// Mapea únicamente tus controllers
app.MapControllers();

app.Run();
