using Microsoft.EntityFrameworkCore.Storage;
using OrdenesPagoBackend.Data;
using OrdenesPagoBackend.Interfaces;

namespace OrdenesPagoBackend.Repositories
{
    public class RepositoryWrapper : IRepositoryWrapper
    {
        private readonly RepositoryContext _repositoryContext;

        private IClienteRepository _cliente;
        private IProductoRepository _producto;
        private IOrdenRepository _orden;
        private IDetalleOrdenRepository _detalleOrden;

        public RepositoryWrapper(
            RepositoryContext repositoryContext
        )
        {
            _repositoryContext = repositoryContext;
        }

        public IClienteRepository Cliente
        {
            get
            {
                if (_cliente == null)
                {
                    _cliente = new ClienteRepository(
                        _repositoryContext
                    );
                }

                return _cliente;
            }
        }

        public IProductoRepository Producto
        {
            get
            {
                if (_producto == null)
                {
                    _producto = new ProductoRepository(
                        _repositoryContext
                    );
                }

                return _producto;
            }
        }

        public IOrdenRepository Orden
        {
            get
            {
                if (_orden == null)
                {
                    _orden = new OrdenRepository(
                        _repositoryContext
                    );
                }

                return _orden;
            }
        }
        public IDetalleOrdenRepository DetalleOrden
        {
            get
            {
                if (_detalleOrden == null)
                {
                    _detalleOrden = new DetalleOrdenRepository(
                        _repositoryContext
                    );
                }

                return _detalleOrden;
            }
        }

        public void save()
        {
            _repositoryContext.SaveChanges();
        }

        public IDbContextTransaction BeginTransaction()
        {
            return _repositoryContext.Database.BeginTransaction();
        }

    }
}
