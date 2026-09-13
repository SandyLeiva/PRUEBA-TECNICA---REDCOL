using System.Linq.Expressions;

namespace OrdenesPagoBackend.Interfaces
{
    public interface IRepositoryBase<T>
    {
        IQueryable<T> FindAll();
        IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression);
        void AddRange(IEnumerable<T> objModel);
        void Create(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}
