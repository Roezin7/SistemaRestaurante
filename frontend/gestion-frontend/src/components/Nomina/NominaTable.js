import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const NominaTable = () => {
    const [pagos, setPagos] = useState([]);

    useEffect(() => {
        axios.get('/empleados/nomina')
            .then(response => setPagos(response.data))
            .catch(error => console.error('Error al cargar nómina:', error));
    }, []);

    return (
        <div>
            <h3>Historial de Nómina</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Empleado</th>
                        <th>Horas Trabajadas</th>
                        <th>Horas Extra</th>
                        <th>Días Faltados</th>
                        <th>Monto</th>
                        <th>Fecha de Pago</th>
                    </tr>
                </thead>
                <tbody>
                    {pagos.map((pago) => (
                        <tr key={pago.nomina_id}>
                            <td>{pago.nombre}</td>
                            <td>{pago.horas_trabajadas}</td>
                            <td>{pago.horas_extra}</td>
                            <td>{pago.dias_faltados}</td>
                            <td>${pago.monto}</td>
                            <td>{pago.fecha_pago}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NominaTable;
