import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const HistorialMovimientos = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [filtro, setFiltro] = useState('diario');

    useEffect(() => {
        const obtenerMovimientos = async () => {
            try {
                const response = await axios.get(`/finanzas/movimientos?filtro=${filtro}`);
                setMovimientos(response.data);
            } catch (error) {
                console.error('Error al cargar movimientos:', error);
            }
        };

        obtenerMovimientos();
    }, [filtro]);

    return (
        <div className="card mt-4">
            <div className="card-body">
                <h4>Historial de Movimientos</h4>
                <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                </select>
                {movimientos.length > 0 ? (
                    <table className="table table-striped mt-3">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Tipo</th>
                                <th>Concepto</th>
                                <th>Método de Pago</th>
                                <th>Monto</th>
                                <th>Beneficiario</th>
                                <th>Número de Cheque</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimientos.map((mov) => (
                                <tr key={mov.movimiento_id}>
                                    <td>{mov.fecha}</td>
                                    <td>{mov.tipo}</td>
                                    <td>{mov.concepto}</td>
                                    <td>{mov.metodo_pago}</td>
                                    <td>${mov.monto}</td>
                                    <td>{mov.beneficiario || '-'}</td>
                                    <td>{mov.numero_cheque || '-'}</td>
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
