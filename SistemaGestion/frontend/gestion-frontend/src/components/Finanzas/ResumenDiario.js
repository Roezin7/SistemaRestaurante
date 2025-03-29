import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const ResumenDiario = () => {
    const [ingresos, setIngresos] = useState(0);
    const [egresos, setEgresos] = useState(0);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const obtenerResumen = async () => {
            try {
                const response = await axios.get('/finanzas/resumen');
                setIngresos(response.data.ingresos);
                setEgresos(response.data.egresos);
                setBalance(response.data.balance);
            } catch (error) {
                console.error("❌ Error al obtener el resumen financiero:", error);
            }
        };

        obtenerResumen();
    }, []);

    return (
        <div className="card">
            <div className="card-body">
                <h4>Resumen Diario</h4>
                <p>Ingresos: ${ingresos.toFixed(2)}</p>
                <p>Egresos: ${egresos.toFixed(2)}</p>
                <p>Balance: ${balance.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default ResumenDiario;
