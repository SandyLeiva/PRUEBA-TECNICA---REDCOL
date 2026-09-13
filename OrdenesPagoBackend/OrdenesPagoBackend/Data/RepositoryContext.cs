using Microsoft.EntityFrameworkCore;
using OrdenesPagoBackend.Data.Entities;

namespace OrdenesPagoBackend.Data
{
    public partial class RepositoryContext : DbContext
    {
        public RepositoryContext()
        {
        }

        public RepositoryContext(
            DbContextOptions<RepositoryContext> options
        ) : base(options)
        {
        }

        public virtual DbSet<Cliente> Clientes { get; set; }
        public virtual DbSet<DetalleOrden> DetalleOrdenes { get; set; }
        public virtual DbSet<Orden> Ordenes { get; set; }
        public virtual DbSet<Producto> Productos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cliente>(entity =>
            {
                entity.ToTable("Cliente");

                entity.HasKey(e => e.IdCliente)
                    .HasName("PK__Cliente__D59466422C61E597");

                entity.Property(e => e.Nombre)
                    .HasColumnName("Nombre")
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Documento)
                    .HasColumnName("Documento")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Email)
                    .HasColumnName("Email")
                    .HasMaxLength(200)
                    .IsUnicode(false);


                entity.Property(e => e.Estado)
                    .HasColumnName("Estado")
                    .HasDefaultValue(1);

                entity.Property(e => e.FechaActualizacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

                entity.Property(e => e.FechaRegistro)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime");

            });

            modelBuilder.Entity<Producto>(entity =>
            {
                entity.ToTable("Producto");

                entity.HasKey(e => e.IdProducto)
                    .HasName("PK__Producto__09889210AF364598");

                entity.Property(e => e.Estado)
                    .HasColumnName("Estado")
                    .HasDefaultValue(1);

                entity.Property(e => e.Nombre)
                    .HasColumnName("Nombre")
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Precio)
                    .HasColumnName("Precio")
                    .HasColumnType("decimal(12, 4)");

                entity.Property(e => e.FechaActualizacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

                entity.Property(e => e.FechaRegistro)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime");
            });

            modelBuilder.Entity<Orden>(entity =>
            {
                entity.ToTable("Orden");

                entity.HasKey(e => e.IdOrden)
                    .HasName("PK__Orden__C38F300D0F5D6C71");

                entity.Property(e => e.Estado)
                    .HasColumnName("Estado")
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasDefaultValue("Pendiente");

                entity.Property(e => e.Fecha)
                    .HasColumnName("Fecha")
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime");
                ;

                entity.Property(e => e.Total)
                    .HasColumnName("Total")
                    .HasColumnType("decimal(10, 2)");

                entity.Property(e => e.FechaActualizacion)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime");
                
                entity.Property(e => e.FechaRegistro)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime");

                entity.HasOne(d => d.IdClienteNavigation)
                    .WithMany(p => p.Ordenes)
                    .HasForeignKey(d => d.IdCliente)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Ordenes_Cliente");


            });


            modelBuilder.Entity<DetalleOrden>(entity =>
            {
                entity.ToTable("DetalleOrden");

                entity.HasKey(e => e.IdDetalle)
                    .HasName("PK__DetalleO__E43646A5AB73B0C2");


                entity.Property(e => e.NombreProducto)
                    .HasColumnName("NombreProducto")
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Precio)
                    .HasColumnName("Precio")
                    .HasColumnType("decimal(12, 4)");

                entity.Property(e => e.Subtotal)
                    .HasColumnName("Subtotal")
                    .HasColumnType("decimal(12, 4)");

                entity.HasOne(d => d.IdOrdenNavigation).WithMany(p => p.DetalleOrdenes)
                    .HasForeignKey(d => d.IdOrden)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DetalleOrden_Ordenes");

                entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.DetalleOrdenes)
                    .HasForeignKey(d => d.IdProducto)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DetalleOrden_Producto");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
