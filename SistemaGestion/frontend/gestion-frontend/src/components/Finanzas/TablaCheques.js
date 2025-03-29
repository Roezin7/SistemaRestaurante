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

    return (
        <div className="card">
            <div className="card-body">
                <h4>Cheques Pendientes</h4>
                <table className="table table-striped">
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
                                <td>${cheque.monto}</td>
                                <td>{new Date(cheque.fecha).toLocaleDateString()}</td>
                                <td>{cheque.numero_cheque || '-'}</td>
                                <td>{cheque.estado}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TablaCheques;
