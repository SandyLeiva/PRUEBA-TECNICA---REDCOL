using Microsoft.EntityFrameworkCore.Storage;

namespace OrdenesPagoBackend.Interfaces
{
    public interface IRepositoryWrapper
    {
        IClienteRepository Cliente { get; }

        IProductoRepository Producto { get; }

        IOrdenRepository Orden { get; }

        IDetalleOrdenRepository DetalleOrden { get; }

        void save();

        IDbContextTransaction BeginTransaction();

    }
}
