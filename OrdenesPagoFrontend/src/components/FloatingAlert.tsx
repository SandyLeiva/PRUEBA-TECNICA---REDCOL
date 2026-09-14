import { useEffect } from "react";
import { CircleAlert, CircleCheck, TriangleAlert, X } from "lucide-react";

type FloatingAlertProps = {
  message: string;
  title?: string;
  type?: "error" | "success" | "warning";
  duration?: number;
  onClose: () => void;
};

function FloatingAlert({
  message,
  title,
  type = "error",
  duration = 3500,
  onClose,
}: FloatingAlertProps) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration]);

  if (!message) return null;

  const obtenerIcono = () => {
    switch (type) {
      case "success":
        return <CircleCheck size={20} />;

      case "warning":
        return <TriangleAlert size={20} />;

      default:
        return <CircleAlert size={20} />;
    }
  };

  const obtenerTitulo = () => {
    if (title) return title;

    switch (type) {
      case "success":
        return "Correcto";

      case "warning":
        return "Atención";

      default:
        return "Atención";
    }
  };

  return (
    <div className={`floating-alert ${type}`}>
      <div className="floating-alert-icon">{obtenerIcono()}</div>

      <div className="floating-alert-content">
        <strong>{obtenerTitulo()}</strong>
        <span>{message}</span>
      </div>

      <button
        type="button"
        className="floating-alert-close"
        onClick={onClose}
        aria-label="Cerrar alerta"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default FloatingAlert;
