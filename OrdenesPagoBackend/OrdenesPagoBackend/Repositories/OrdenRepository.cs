using OrdenesPagoBackend.Data;
using OrdenesPagoBackend.Data.Entities;
using OrdenesPagoBackend.Interfaces;

namespace OrdenesPagoBackend.Repositories
{
    public class OrdenRepository : RepositoryBase<Orden>, IOrdenRepository
    {
        public OrdenRepository(
            RepositoryContext repositoryContext
        ) : base(repositoryContext)
        {
        }
    }
}
