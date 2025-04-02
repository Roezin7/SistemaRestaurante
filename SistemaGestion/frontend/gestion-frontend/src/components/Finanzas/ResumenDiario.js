import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import './ResumenDiario.css'; // Asegúrate de tener este CSS para los KPIs

const ResumenDiario = () => {
    const [resumen, setResumen] = useState({
        ingresos: 0,
        egresos: 0,
        balance: 0,
        chequesPendientes: 0
    });

    useEffect(() => {
        const obtenerResumen = async () => {
            try {
                const response = await axios.get('/finanzas/resumen');
                setResumen(response.data);
            } catch (error) {
                console.error('❌ Error al obtener resumen diario:', error);
            }
        };

        obtenerResumen();
    }, []);

    const formatter = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    const tarjetas = [
        {
            titulo: 'Ingresos',
            valor: formatter.format(resumen.ingresos),
            color: '#2E7D32'
        },
        {
            titulo: 'Egresos',
            valor: formatter.format(resumen.egresos),
            color: '#C62828'
        },
        {
            titulo: 'Balance',
            valor: formatter.format(resumen.balance),
            color: resumen.balance >= 0 ? '#1976D2' : '#D32F2F'
        },
        {
            titulo: 'Cheques Pendientes',
            valor: resumen.chequesPendientes,
            color: '#F9A825'
        }
    ];

    return (
        <div className="resumen-container fade-in">
            {tarjetas.map((card, index) => (
                <div key={index} className="kpi-card" style={{ borderLeft: `5px solid ${card.color}` }}>
                    <div className="kpi-title">{card.titulo}</div>
                    <div className="kpi-value">{card.valor}</div>
                </div>
            ))}
        </div>
    );
};

export default ResumenDiario;
