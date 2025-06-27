import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Header />
      <main className="container py-4">
        <Outlet /> {/* Aquí se renderizarán las páginas */}
      </main>
      <Footer />
    </>
  );
};

export default Layout;