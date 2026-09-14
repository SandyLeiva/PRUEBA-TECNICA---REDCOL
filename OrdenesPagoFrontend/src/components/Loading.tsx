interface LoadingProps {
  message?: string;
}

function Loading({ message = "Cargando información..." }: LoadingProps) {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <span>{message}</span>
    </div>
  );
}

export default Loading;