import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import Finanzas from './pages/Finanzas';
import Nomina from './pages/Nomina'; // Nueva página de nómina
import NavBar from './components/NavBar';
import Loader from './components/shared/Loader';
import './styles/global.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula precarga (puedes poner autenticación o config aquí también)
    const timeout = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <Loader />;

  return (
    <Router>
      <NavBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/finanzas" element={<Finanzas />} />
          <Route path="/nomina" element={<Nomina />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
