using OrdenesPagoBackend.Data;
using OrdenesPagoBackend.Data.Entities;
using OrdenesPagoBackend.Interfaces;

namespace OrdenesPagoBackend.Repositories
{
    public class ClienteRepository : RepositoryBase<Cliente>, IClienteRepository
    {
        public ClienteRepository(
            RepositoryContext repositoryContext
        ) : base(repositoryContext)
        {
        }
    }
}
