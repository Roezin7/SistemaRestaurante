import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import dayjs from 'dayjs';

const HistorialMovimientos = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [filtro, setFiltro] = useState('diario');
    const [busqueda, setBusqueda] = useState('');
    const [modoEdicion, setModoEdicion] = useState(null);
    const [datosEditados, setDatosEditados] = useState({});

    useEffect(() => {
        const obtenerMovimientos = async () => {
            try {
                const response = await axios.get(`/finanzas/movimientos?filtro=${filtro}`);
                // Corregir ID para ingresos (ingreso_id → id)
                const movimientosMapeados = response.data.map(m => ({
                    ...m,
                    id: m.id || m.ingreso_id || m.egreso_id // asegúrate de tener campo uniforme
                }));
                setMovimientos(movimientosMapeados);
            } catch (error) {
                console.error('Error al cargar movimientos:', error);
            }
        };
        obtenerMovimientos();
    }, [filtro]);

    const eliminarMovimiento = async (mov) => {
        if (window.confirm('¿Estás seguro de eliminar este movimiento?')) {
            try {
                const tabla = mov.tipo.toLowerCase() === 'ingreso' ? 'ingresos' : 'egresos';
                await axios.delete(`/finanzas/${tabla}/${mov.id}`); // ✅ Ruta corregida
                setMovimientos(prev => prev.filter(m => m.id !== mov.id));
            } catch (error) {
                console.error('❌ Error al eliminar movimiento:', error);
            }
        }
    };

    const activarEdicion = (mov) => {
        setModoEdicion(mov.id);
        setDatosEditados({ ...mov });
    };

    const cancelarEdicion = () => {
        setModoEdicion(null);
        setDatosEditados({});
    };

    const guardarEdicion = async () => {
        try {
            const tipo = datosEditados.tipo.toLowerCase(); // asegura que sea 'ingreso' o 'egreso'
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
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Historial de Movimientos</h4>
                    <select className="form-select w-auto" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                        <option value="diario">Diario</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensual">Mensual</option>
                    </select>
                </div>

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
                                    <td>{dayjs(mov.fecha).format('DD/MM/YYYY')}</td>
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
