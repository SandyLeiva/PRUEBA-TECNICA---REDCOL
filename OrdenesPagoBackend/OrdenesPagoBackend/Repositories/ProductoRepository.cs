using OrdenesPagoBackend.Data;
using OrdenesPagoBackend.Data.Entities;
using OrdenesPagoBackend.Interfaces;

namespace OrdenesPagoBackend.Repositories
{
    public class ProductoRepository : RepositoryBase<Producto>, IProductoRepository
    {
        public ProductoRepository(
            RepositoryContext repositoryContext
        ) : base(repositoryContext)
        {
        }
    }
}
