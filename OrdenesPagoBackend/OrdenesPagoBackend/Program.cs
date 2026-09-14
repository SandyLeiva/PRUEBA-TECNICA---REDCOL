using Microsoft.EntityFrameworkCore;
using OrdenesPagoBackend.Business;
using OrdenesPagoBackend.Business.Validator;
using OrdenesPagoBackend.Data;
using OrdenesPagoBackend.Interfaces;
using OrdenesPagoBackend.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();


//CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Conexion
builder.Services.AddDbContext<RepositoryContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString(
            "SqlServerConnection"
        )
    )
);

// Repositorios
builder.Services.AddScoped<
    IRepositoryWrapper,
    RepositoryWrapper
>();

//Logic
builder.Services.AddScoped<
    ProductoBusinessLogic
>();

builder.Services.AddScoped<
    ClienteBusinessLogic
>();

builder.Services.AddScoped<
    OrdenBusinessLogic
>();

builder.Services.AddScoped<
    OrdenValidator
>();

builder.Services.AddScoped<
    EditarEstadoOrdenValidator
>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("ReactPolicy");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
