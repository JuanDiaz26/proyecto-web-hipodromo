import React from 'react';  // Asegúrate de que React esté importado
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';      // Bootstrap CSS global
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Bootstrap JS (carousels, modal, etc.)
import 'bootstrap-icons/font/bootstrap-icons.css';  // Bootstrap Icons global



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);