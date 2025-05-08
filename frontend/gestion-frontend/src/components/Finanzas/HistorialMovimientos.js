import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import FiltroGlobal from './FiltroGlobal';
import dayjs from 'dayjs';

const HistorialMovimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modoEdicion, setModoEdicion] = useState(null);
  const [datosEditados, setDatosEditados] = useState({});

  // Filtro global
  const [filtro, setFiltro] = useState('mensual');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    if (!fechaInicio || !fechaFin) return;

    const obtenerMovimientos = async () => {
      try {
        const response = await axios.get(`/finanzas/movimientos?filtro=${filtro}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
        setMovimientos(response.data);
      } catch (error) {
        console.error('Error al cargar movimientos:', error);
      }
    };

    obtenerMovimientos();
  }, [filtro, fechaInicio, fechaFin]);

  const eliminarMovimiento = async (mov) => {
    if (window.confirm('¿Estás seguro de eliminar este movimiento?')) {
      try {
        const tabla = mov.tipo.toLowerCase() === 'ingreso' ? 'ingresos' : 'egresos';
        const id = mov.tipo.toLowerCase() === 'ingreso' ? mov.ingreso_id : mov.egreso_id;
        await axios.delete(`/finanzas/${tabla}/${id}`);
        setMovimientos(prev => prev.filter(m => {
          const mid = m.tipo.toLowerCase() === 'ingreso' ? m.ingreso_id : m.egreso_id;
          return mid !== id;
        }));
      } catch (error) {
        console.error('❌ Error al eliminar movimiento:', error);
      }
    }
  };  

  const activarEdicion = (mov) => {
    setModoEdicion(mov.id);
    setDatosEditados({ ...mov, fecha: dayjs(mov.fecha).format('YYYY-MM-DD') });
  };

  const cancelarEdicion = () => {
    setModoEdicion(null);
    setDatosEditados({});
  };

  const guardarEdicion = async () => {
    try {
      const tipo = datosEditados.tipo.toLowerCase();
      const tabla = tipo === 'ingreso' ? 'ingresos' : 'egresos';
      await axios.put(`/finanzas/${tabla}/${datosEditados.id}`, datosEditados);
      setMovimientos((prev) =>
        prev.map((m) => (m.id === datosEditados.id ? datosEditados : m))
      );
      cancelarEdicion();
    } catch (error) {
      console.error('❌ Error al guardar edición:', error);
      alert('Error al guardar los cambios.');
    }
  };

  const movimientosFiltrados = movimientos.filter((mov) =>
    mov.concepto.toLowerCase().includes(busqueda.toLowerCase()) ||
    mov.metodo_pago.toLowerCase().includes(busqueda.toLowerCase()) ||
    (mov.beneficiario || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    mov.tipo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="card mt-4 fade-in">
      <div className="card-body">
        <h4 className="mb-3">Historial de Movimientos</h4>

        <FiltroGlobal
          filtro={filtro}
          setFiltro={setFiltro}
          fechaInicio={fechaInicio}
          setFechaInicio={setFechaInicio}
          fechaFin={fechaFin}
          setFechaFin={setFechaFin}
        />

        <input
          type="text"
          placeholder="Buscar movimiento..."
          className="form-control mb-3"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {movimientosFiltrados.length > 0 ? (
          <table className="table table-striped table-dark table-hover text-center">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Concepto</th>
                <th>Método</th>
                <th>Monto</th>
                <th>Beneficiario</th>
                <th>Cheque</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientosFiltrados.map((mov) => (
                <tr key={mov.id}>
                  <td>
                    {modoEdicion === mov.id ? (
                      <input
                        type="date"
                        className="form-control"
                        value={datosEditados.fecha}
                        onChange={(e) => setDatosEditados({ ...datosEditados, fecha: e.target.value })}
                      />
                    ) : (
                      dayjs(mov.fecha).format('DD/MM/YYYY')
                    )}
                  </td>
                  <td>{mov.tipo}</td>
                  {modoEdicion === mov.id ? (
                    <>
                      <td>
                        <input
                          className="form-control"
                          value={datosEditados.concepto}
                          onChange={(e) => setDatosEditados({ ...datosEditados, concepto: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={datosEditados.metodo_pago}
                          onChange={(e) => setDatosEditados({ ...datosEditados, metodo_pago: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={datosEditados.monto}
                          onChange={(e) => setDatosEditados({ ...datosEditados, monto: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={datosEditados.beneficiario || ''}
                          onChange={(e) => setDatosEditados({ ...datosEditados, beneficiario: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={datosEditados.numero_cheque || ''}
                          onChange={(e) => setDatosEditados({ ...datosEditados, numero_cheque: e.target.value })}
                        />
                      </td>
                      <td>
                        <button className="btn btn-success btn-sm me-1" onClick={guardarEdicion}>Guardar</button>
                        <button className="btn btn-secondary btn-sm" onClick={cancelarEdicion}>Cancelar</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{mov.concepto}</td>
                      <td>{mov.metodo_pago}</td>
                      <td>${parseFloat(mov.monto).toFixed(2)}</td>
                      <td>{mov.beneficiario || '-'}</td>
                      <td>{mov.numero_cheque || '-'}</td>
                      <td>
                        <button className="btn btn-warning btn-sm me-1" onClick={() => activarEdicion(mov)}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => eliminarMovimiento(mov)}>Eliminar</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay movimientos registrados.</p>
        )}
      </div>
    </div>
  );
};

export default HistorialMovimientos;
