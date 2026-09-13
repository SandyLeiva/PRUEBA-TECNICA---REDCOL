namespace OrdenesPagoBackend.Business
{
    public class Response<T>
    {
        public int Status { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
        public object Details { get; set; }
    }
}
