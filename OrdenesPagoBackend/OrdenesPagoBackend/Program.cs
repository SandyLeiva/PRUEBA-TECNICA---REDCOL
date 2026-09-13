using Microsoft.EntityFrameworkCore;
using OrdenesPagoBackend.Business;
using OrdenesPagoBackend.Business.Validator;
using OrdenesPagoBackend.Data;
using OrdenesPagoBackend.Interfaces;
using OrdenesPagoBackend.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();


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

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
