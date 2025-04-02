import React from 'react';
import EmpleadosTable from '../components/Nomina/EmpleadosTable';
import HorariosTable from '../components/Nomina/HorariosTable';
import '../styles/global.css';

const Nomina = () => {
    return (
        <div className="container fade-in">
            <h2 className="mb-4">Gestión de Nómina y Empleados</h2>
            <div className="section card mb-4 p-4">
                <EmpleadosTable />
            </div>
            <div className="section card p-4">
                <HorariosTable />
            </div>
        </div>
    );
};

export default Nomina;
