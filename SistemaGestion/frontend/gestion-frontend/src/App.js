import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import Finanzas from './pages/Finanzas';
import Nomina from './pages/Nomina'; // Nueva página de nómina
import NavBar from './components/NavBar';
import './styles/global.css';

function App() {
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
