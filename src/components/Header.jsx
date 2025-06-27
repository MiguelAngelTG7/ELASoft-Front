import React from 'react';
import logo from '../assets/logo2.png'; // ajusta la ruta si es necesario
import './Header.css'; // para estilos opcionales

const Header = () => {
  return (
    <header className="app-header d-print-none">
      <div className="container d-flex align-items-center py-2">
        <img src={logo} alt="Logo ELASoft" className="logo me-3" />
        <div>
          <h5 className="mb-0 fw-bold">Escuela de Liderazgo Alianza - ELA</h5>
          <small className="text-muted">Sistema Académico</small>
        </div>
      </div>
    </header>
  );
};

export default Header;