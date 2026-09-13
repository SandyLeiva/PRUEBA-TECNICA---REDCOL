using OrdenesPagoBackend.Data;
using OrdenesPagoBackend.Data.Entities;
using OrdenesPagoBackend.Interfaces;

namespace OrdenesPagoBackend.Repositories
{
    public class DetalleOrdenRepository : RepositoryBase<DetalleOrden>, IDetalleOrdenRepository
    {
        public DetalleOrdenRepository(
            RepositoryContext repositoryContext
        ) : base(repositoryContext)
        {
        }
    }
}
