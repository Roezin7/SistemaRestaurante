import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Registro de elementos y escalas
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const ventasData = {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [
            {
                label: 'Ventas',
                data: [500, 800, 1200, 700, 950, 600, 1100],
                backgroundColor: '#6200EA',
            },
        ],
    };

    const gastosData = {
        labels: ['Alimentos', 'Bebidas', 'Mantenimiento', 'Otros'],
        datasets: [
            {
                label: 'Gastos',
                data: [300, 200, 150, 100],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#6200EA'],
            },
        ],
    };

    return (
        <div>
            <h3>Dashboard</h3>
            <div className="chart">
                <Bar data={ventasData} />
            </div>
            <div className="chart">
                <Pie data={gastosData} />
            </div>
        </div>
    );
};

export default Dashboard;
