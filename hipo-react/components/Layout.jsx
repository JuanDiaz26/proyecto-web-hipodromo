import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer'; // Ajustá si Footer está en otra carpeta
import WhatsappButton from './WhatsappButton';

const Layout = () => {
  return (
    <>
      <Outlet />
      <Footer />
      <WhatsappButton />
    </>
  );
};

export default Layout;
