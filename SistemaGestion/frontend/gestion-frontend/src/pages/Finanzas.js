import React from 'react';
import ResumenDiario from '../components/Finanzas/ResumenDiario';
import HistorialMovimientos from '../components/Finanzas/HistorialMovimientos';
import FormularioMovimiento from '../components/Finanzas/FormularioMovimiento';
import TablaCheques from '../components/Finanzas/TablaCheques';
import '../styles/global.css';

const Finanzas = () => {
    return (
        <div className="container fade-in">
            <h2 className="mb-4">Gestión Financiera</h2>

            <div className="section card p-4 mb-4">
                <ResumenDiario />
            </div>

            <div className="section card p-4 mb-4">
                <FormularioMovimiento />
            </div>

            <div className="section card p-4 mb-4">
                <HistorialMovimientos />
            </div>

            <div className="section card p-4">
                <TablaCheques />
            </div>
        </div>
    );
};

export default Finanzas;
