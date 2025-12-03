import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio.jsx';
import Sorteo from '../components/Sorteo.jsx';
import Programas from './pages/Programas.jsx';
import Resultados from './pages/Resultados.jsx';
import Cartas from './pages/Cartas.jsx';
import Inscripcion from './pages/Inscripcion.jsx';
import Estadisticas from './pages/Estadisticas.jsx';
import Escalas from './pages/Escalas.jsx';
import Ultimas from './pages/UltimasCarreras.jsx';
import Agencias from './pages/Agencias.jsx';
import ComoApostar from './pages/ComoApostar.jsx';
import TiposApuestas from './pages/TiposApuestas.jsx';
import Contacto from './pages/Contacto.jsx';
import Historia from './pages/Historia.jsx';
import CarrerasDestacadas from './pages/CarrerasDestacadas.jsx';
import Museo from './pages/Museo.jsx';
import Escuela from './pages/Escuela.jsx';
import Layout from '../components/Layout.jsx';

// ✅ Nuevo componente para que al cambiar de ruta haga scroll arriba
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <Router>
      {/* Scroll automático al hacer cambio de ruta */}
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/sorteo" element={<Sorteo />} />
          <Route path="/programas" element={<Programas />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/cartas" element={<Cartas />} />
          <Route path="/inscripcion" element={<Inscripcion />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/escalas" element={<Escalas />} />
          <Route path="/ultimascarreras" element={<Ultimas />} />
          <Route path="/agencias" element={<Agencias />} />
          <Route path="/comoapostar" element={<ComoApostar />} />
          <Route path="/tiposapuestas" element={<TiposApuestas />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/carrerasdestacadas" element={<CarrerasDestacadas />} />
          <Route path="/museo" element={<Museo />} />
          <Route path="/escuela" element={<Escuela />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
