using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StudyPlatform.Data;
using StudyPlatform.Services.Flashcards;
using StudyPlatform.Middlewares;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using StudyPlatform.Services.Subjects;
using StudyPlatform.Services.MaterialSubGroups;
using System.Text.Json.Serialization.Metadata;
using Microsoft.AspNetCore.Http.Json;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Data.Common;
using System.Text.Json;
using StudyPlatform.Services.Mindmaps;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAutoMapper(typeof(Program));

var connectionString = builder.Configuration.GetConnectionString("Default");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));


builder.Services.AddDbContext<SupabaseDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("SupabaseConnection")));

var httpClient = new HttpClient();
var jwksJson = await httpClient.GetStringAsync("https://ahbnjmwcittfgbhgpyex.supabase.co/auth/v1/.well-known/jwks.json");
var jwks = new JsonWebKeySet(jwksJson);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            IssuerSigningKeys = jwks.Keys,

            ValidateIssuer = true,
            ValidIssuer = "https://ahbnjmwcittfgbhgpyex.supabase.co/auth/v1",

            ValidateAudience = true,
            ValidAudience = "authenticated",

            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(2),

            //ValidateIssuerSigningKey = true,

            // Specify ES256 since Supabase signs JWTs with this
            //ValidAlgorithms = new[] { SecurityAlgorithms.EcdsaSha256 }
        };
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("Auth Failed: " + context.Exception);
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token validated for user: " + context.Principal?.Identity?.Name);
                return Task.CompletedTask;
            }
        };

    });


builder.Services.AddAuthorization();

builder.Services.AddHttpClient<APIClient>(client =>
{
    client.BaseAddress = new Uri("http://localhost:8000/");
});

builder.Services.AddControllers();

builder.Services.AddScoped<IRepository, Repository>();
builder.Services.AddScoped<SupabaseRepository>();

builder.Services.AddScoped<IFlashcardsService, FlashcardsService>();
builder.Services.AddScoped<ISubjectsService, SubjectsService>();
builder.Services.AddScoped<IMindmapsService, MindmapsService>();
builder.Services.AddScoped<IMaterialSubGroupsService, MaterialSubGroupsService>();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Study Platform", Version = "v1" });

    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT token"
    };

    c.AddSecurityDefinition("Bearer", securityScheme);

    var securityReq = new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    };

    c.AddSecurityRequirement(securityReq);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.AllowAnyOrigin()  
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddSwaggerGen(c =>
{
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);

    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
