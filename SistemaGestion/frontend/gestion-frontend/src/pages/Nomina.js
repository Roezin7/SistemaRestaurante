import React from 'react';
import EmpleadosTable from '../components/Nomina/EmpleadosTable';
import HorariosTable from '../components/Nomina/HorariosTable';

const Nomina = () => {
    return (
        <div className="container">
            <h2>Gestión de Nómina y Empleados</h2>
            <div className="section">
                <EmpleadosTable />
            </div>
            <div className="section">
                <h3>Horarios de Trabajo</h3>
                <HorariosTable />
            </div>
        </div>
    );
};

export default Nomina;
