// src/components/Footer.jsx
import React from 'react';
import logoEkklesia from '../assets/ekklesia-logo.png'; // Ajusta la ruta si es necesario

const Footer = () => {
  return (
    <footer className="text-center mt-5 py-2 border-top d-print-none">
      <div className="container pt-0">
        <div className="d-flex flex-column align-items-center gap-2">
          <p className="m-0 fw-semibold">ELASoft v.1.1</p>
          <img
            src={logoEkklesia}
            alt="Ekklesia Systems Logo"
            style={{ height: '70px' }}
          />
          <small className="text-muted">Gospel | Community | Mission</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
