import React, { useState } from 'react';
import ResumenDiario from '../components/Finanzas/ResumenDiario';
import HistorialMovimientos from '../components/Finanzas/HistorialMovimientos';
import FormularioMovimiento from '../components/Finanzas/FormularioMovimiento';
import TablaCheques from '../components/Finanzas/TablaCheques';
import FiltroGlobal from '../components/Finanzas/FiltroGlobal';
import '../styles/global.css';

const Finanzas = () => {
  const [filtro, setFiltro] = useState('diario');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  return (
    <div className="container fade-in">
      <h2 className="mb-4">Gestión Financiera</h2>

      <FiltroGlobal
        filtro={filtro}
        setFiltro={setFiltro}
        fechaInicio={fechaInicio}
        setFechaInicio={setFechaInicio}
        fechaFin={fechaFin}
        setFechaFin={setFechaFin}
      />

      <div className="section card p-4 mb-4">
        <ResumenDiario filtro={filtro} fechaInicio={fechaInicio} fechaFin={fechaFin} />
      </div>

      <div className="section card p-4 mb-4">
        <FormularioMovimiento />
      </div>

      <div className="section card p-4 mb-4">
        <HistorialMovimientos filtro={filtro} fechaInicio={fechaInicio} fechaFin={fechaFin} />
      </div>

      <div className="section card p-4">
        <TablaCheques filtro={filtro} fechaInicio={fechaInicio} fechaFin={fechaFin} />
      </div>
    </div>
  );
};

export default Finanzas;
