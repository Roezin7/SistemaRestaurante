import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const TablaCheques = () => {
  const [cheques, setCheques] = useState([]);

  useEffect(() => {
    const obtenerCheques = async () => {
      try {
        const response = await axios.get('/finanzas/cheques');
        setCheques(response.data);
      } catch (error) {
        console.error("❌ Error al obtener cheques:", error);
      }
    };

    obtenerCheques();
  }, []);

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await axios.put(`/finanzas/cheques/${id}`, { estado: nuevoEstado });
      setCheques(prev =>
        prev.map(cheque =>
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
        <table className="table table-striped table-dark">
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
            {cheques.map((cheque) => (
              <tr key={cheque.cheque_id}>
                <td>{cheque.beneficiario || '-'}</td>
                <td>{cheque.concepto}</td>
                <td>${parseFloat(cheque.monto).toFixed(2)}</td>
                <td>{new Date(cheque.fecha).toLocaleDateString()}</td>
                <td>{cheque.numero_cheque || '-'}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={cheque.estado}
                    onChange={(e) =>
                      handleEstadoChange(cheque.cheque_id, e.target.value)
                    }
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
  );
};

export default TablaCheques;
