// src/components/Footer.jsx
import React from 'react';
import logoAletheia from '../assets/aletheia-logo.png'; // Ajusta la ruta si es necesario

const Footer = () => {
  return (
    <footer className="text-center mt-5 py-3 border-top d-print-none">
      <div className="container">
        <p className="mb-1 fw-semibold">ELASoft v.1.0</p>
        <div className="d-flex flex-column align-items-center">
          <img
            src={logoAletheia}
            alt="Aletheia Systems Logo"
            style={{ height: '40px', marginBottom: '5px' }}
          />
          <small className="text-muted">Aletheia Systems</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
