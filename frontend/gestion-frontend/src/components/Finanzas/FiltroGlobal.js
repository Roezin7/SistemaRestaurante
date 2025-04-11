import React from 'react';

const FiltroGlobal = ({ filtro = 'mensual', setFiltro, fechaInicio, setFechaInicio, fechaFin, setFechaFin }) => {
  return (
    <div className="card bg-dark text-light mb-3">
      <div className="card-body d-flex flex-wrap gap-3 align-items-end">
        <div>
          <label className="form-label">Rango de Fechas</label>
          <select
            className="form-select bg-secondary text-light"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="diario">Hoy</option>
            <option value="semanal">Últimos 7 días</option>
            <option value="mensual">Últimos 30 días</option>
            <option value="personalizado">Personalizado</option>
          </select>
        </div>

        {filtro === 'personalizado' && (
          <>
            <div>
              <label className="form-label">Desde</label>
              <input
                type="date"
                className="form-control bg-secondary text-light"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Hasta</label>
              <input
                type="date"
                className="form-control bg-secondary text-light"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FiltroGlobal;
