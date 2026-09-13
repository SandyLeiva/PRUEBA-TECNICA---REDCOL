using Microsoft.EntityFrameworkCore;
using OrdenesPagoBackend.Data;
using OrdenesPagoBackend.Interfaces;
using System.Linq.Expressions;

namespace OrdenesPagoBackend.Repositories
{
    public class RepositoryBase<T> : IRepositoryBase<T> where T : class
    {

        protected RepositoryContext RepositoryContext { get; set; }

        public RepositoryBase(RepositoryContext repositoryContext)
        {
            RepositoryContext = repositoryContext;
        }

        public IQueryable<T> FindAll() => RepositoryContext.Set<T>().AsNoTracking();

        public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression) => RepositoryContext.Set<T>().Where(expression).AsNoTracking();

        public void AddRange(IEnumerable<T> objModel) => RepositoryContext.Set<T>().AddRange(objModel);

        public void Create(T entity) => RepositoryContext.Set<T>().Add(entity);

        public void Update(T entity) => RepositoryContext.Set<T>().Update(entity);

        public void Delete(T entity) => RepositoryContext.Set<T>().Remove(entity);

    }
}
