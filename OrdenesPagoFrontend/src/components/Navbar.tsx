import { Bell } from "lucide-react";

function Navbar() {
  return (
    <header className="navbar">
      <div>
        <span className="navbar-title">Panel de administración</span>
      </div>

      <div className="navbar-actions">
        <div className="navbar-user">
          <div className="navbar-avatar">S</div>

          <div>
            <strong>Administrador</strong>
            <span>Sandy L</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
