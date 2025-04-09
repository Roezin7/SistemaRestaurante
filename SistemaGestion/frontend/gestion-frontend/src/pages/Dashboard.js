import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const Dashboard = () => {
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const res = await axios.get('/dashboard/resumen');
        setResumen(res.data);
      } catch (error) {
        console.error('Error al cargar el resumen del dashboard:', error);
      }
    };
    fetchResumen();
  }, []);

  const tarjetas = resumen ? [
    { titulo: 'Ingresos Hoy', valor: `$${resumen.ingresosHoy.toFixed(2)}`, color: '#2E7D32' },
    { titulo: 'Egresos Hoy', valor: `$${resumen.egresosHoy.toFixed(2)}`, color: '#C62828' },
    { titulo: 'Balance Hoy', valor: `$${resumen.balanceHoy.toFixed(2)}`, color: resumen.balanceHoy >= 0 ? '#1976D2' : '#D32F2F' },
    { titulo: 'Cheques Pendientes', valor: resumen.chequesPendientes, color: '#F9A825' },
    { titulo: 'Empleados', valor: resumen.totalEmpleados, color: '#90CAF9' },
    { titulo: 'Total Nómina', valor: `$${resumen.totalNomina.toFixed(2)}`, color: '#7C4DFF' },
    { titulo: 'Productos sin Proveedor', valor: resumen.productosSinProveedor, color: '#FF7043' }
  ] : [];

  return (
    <div className="container fade-in mt-4">
      <h2 className="text-light mb-4">Dashboard</h2>
      <div className="row g-4">
        {tarjetas.map((card, idx) => (
          <div className="col-md-4" key={idx}>
            <div className="card p-3 h-100 text-light" style={{ backgroundColor: '#1e1e1e', borderLeft: `6px solid ${card.color}` }}>
              <h6 className="mb-1" style={{ color: card.color }}>{card.titulo}</h6>
              <h4>{card.valor}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;