import React from 'react';
import ResumenDiario from '../components/Finanzas/ResumenDiario';
import HistorialMovimientos from '../components/Finanzas/HistorialMovimientos';
import FormularioMovimiento from '../components/Finanzas/FormularioMovimiento';
import TablaCheques from '../components/Finanzas/TablaCheques';

const Finanzas = () => {
    return (
        <div className="container">
            <h2>Gestión Financiera</h2>
            <ResumenDiario />
            <FormularioMovimiento />
            <HistorialMovimientos />
            <TablaCheques />
        </div>
    );
};

export default Finanzas;
