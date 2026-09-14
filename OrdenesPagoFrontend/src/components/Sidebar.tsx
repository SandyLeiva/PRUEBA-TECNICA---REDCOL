import { NavLink } from "react-router-dom";
import {
  ReceiptText,
  Users,
  Package,
  WalletCards,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <WalletCards size={21} />
        </div>

        <div>
          <strong>OrdenesPago</strong>
          <span>Registro y Gestión</span>
        </div>
      </div>

      <span className="sidebar-section-title">MENÚ PRINCIPAL</span>

      <nav className="sidebar-nav">
        <NavLink
          to="/ordenes"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <ReceiptText size={18} />
          <span>Órdenes</span>
        </NavLink>

        <NavLink
          to="/clientes"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <Users size={18} />
          <span>Clientes</span>
        </NavLink>

        <NavLink
          to="/productos"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <Package size={18} />
          <span>Productos</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;