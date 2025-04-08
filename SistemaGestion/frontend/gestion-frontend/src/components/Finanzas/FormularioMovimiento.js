import React, { useState } from 'react';
import axios from '../../api/axios';

const FormularioMovimiento = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [tipo, setTipo] = useState('ingreso');
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [beneficiario, setBeneficiario] = useState('');
  const [numeroCheque, setNumeroCheque] = useState('');

  const registrarMovimiento = async () => {
    try {
      const data = {
        concepto,
        monto,
        fecha,
        metodo_pago: metodoPago,
        beneficiario,
        numero_cheque: numeroCheque,
      };
      const endpoint = tipo === 'ingreso' ? '/finanzas/ingresos' : '/finanzas/egresos';

      await axios.post(endpoint, data);
      alert('Movimiento registrado correctamente');
      setConcepto('');
      setMonto('');
      setFecha('');
      setMetodoPago('efectivo');
      setBeneficiario('');
      setNumeroCheque('');
    } catch (error) {
      console.error('Error al registrar el movimiento:', error);
    }
  };

  return (
    <div className="card mt-4 bg-dark text-light">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Formulario de Movimiento</h4>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => setMostrarFormulario(prev => !prev)}
          >
            {mostrarFormulario ? 'Ocultar' : 'Registrar Movimiento'}
          </button>
        </div>

        {mostrarFormulario && (
          <div className="fade-in">
            <div className="mb-3">
              <label className="form-label">Tipo</label>
              <select
                className="form-select bg-secondary text-light"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="ingreso">Ingreso</option>
                <option value="egreso">Egreso</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Concepto</label>
              <input
                type="text"
                className="form-control bg-secondary text-light"
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Monto</label>
              <input
                type="number"
                className="form-control bg-secondary text-light"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Fecha</label>
              <input
                type="date"
                className="form-control bg-secondary text-light"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Método de Pago</label>
              <select
                className="form-select bg-secondary text-light"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
            {metodoPago === 'cheque' && (
              <>
                <div className="mb-3">
                  <label className="form-label">Beneficiario</label>
                  <input
                    type="text"
                    className="form-control bg-secondary text-light"
                    value={beneficiario}
                    onChange={(e) => setBeneficiario(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Número de Cheque</label>
                  <input
                    type="text"
                    className="form-control bg-secondary text-light"
                    value={numeroCheque}
                    onChange={(e) => setNumeroCheque(e.target.value)}
                  />
                </div>
              </>
            )}
            <button className="btn btn-primary" onClick={registrarMovimiento}>
              Registrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioMovimiento;
