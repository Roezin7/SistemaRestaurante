import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const TablaCheques = ({ filtro, fechaInicio, fechaFin }) => {
  const [cheques, setCheques] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const obtenerCheques = async () => {
      try {
        const response = await axios.get('/finanzas/cheques', {
          params: { filtro, fechaInicio, fechaFin },
        });
        setCheques(response.data);
      } catch (error) {
        console.error("❌ Error al obtener cheques:", error);
      }
    };

    obtenerCheques();
  }, [filtro, fechaInicio, fechaFin]);

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await axios.put(`/finanzas/cheques/${id}`, { estado: nuevoEstado });
      setCheques((prev) =>
        prev.map((cheque) =>
          cheque.cheque_id === id ? { ...cheque, estado: nuevoEstado } : cheque
        )
      );
    } catch (error) {
      console.error("❌ Error al actualizar estado del cheque:", error);
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h4>Cheques Pendientes</h4>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Buscar cheque..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="table-responsive">
          <table className="table table-striped table-dark table-hover text-center">
            <thead>
              <tr>
                <th>Beneficiario</th>
                <th>Concepto</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Número de Cheque</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {cheques
                .filter(c =>
                  c.concepto.toLowerCase().includes(busqueda.toLowerCase()) ||
                  (c.beneficiario || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                  c.estado.toLowerCase().includes(busqueda.toLowerCase())
                )
                .map((cheque) => (
                  <tr key={cheque.cheque_id}>
                    <td>{cheque.beneficiario || '-'}</td>
                    <td>{cheque.concepto}</td>
                    <td>${parseFloat(cheque.monto).toFixed(2)}</td>
                    <td>{new Date(cheque.fecha).toLocaleDateString()}</td>
                    <td>{cheque.numero_cheque || '-'}</td>
                    <td>
                      <select
                        className="form-select form-select-sm bg-dark text-light"
                        value={cheque.estado}
                        onChange={(e) => handleEstadoChange(cheque.cheque_id, e.target.value)}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Cobrado">Cobrado</option>
                      </select>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablaCheques;