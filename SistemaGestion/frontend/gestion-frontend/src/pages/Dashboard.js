import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const Dashboard = () => {
  const navigate = useNavigate();
  const [resumen, setResumen] = useState(null);
  const [desde, setDesde] = useState(dayjs().format('YYYY-MM-DD'));
  const [hasta, setHasta] = useState(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    const obtenerResumen = async () => {
      try {
        const res = await axios.get('/dashboard/resumen', {
          params: { desde, hasta }
        });
        setResumen(res.data);
      } catch (error) {
        console.error('Error al cargar resumen del dashboard:', error);
      }
    };
    obtenerResumen();
  }, [desde, hasta]);

  const KPIS = resumen ? [
    { titulo: 'Ingresos', valor: `$${resumen.ingresos.toFixed(2)}`, color: '#2E7D32', ruta: '/finanzas' },
    { titulo: 'Egresos', valor: `$${resumen.egresos.toFixed(2)}`, color: '#C62828', ruta: '/finanzas' },
    { titulo: 'Balance', valor: `$${resumen.balance.toFixed(2)}`, color: resumen.balance >= 0 ? '#1976D2' : '#D32F2F', ruta: '/finanzas' },
    { titulo: 'Cheques Pendientes', valor: resumen.chequesPendientes, color: '#F9A825', ruta: '/finanzas' },
    { titulo: 'Empleados', valor: resumen.totalEmpleados, color: '#90CAF9', ruta: '/nomina' },
    { titulo: 'Total Nómina', valor: `$${resumen.totalNomina.toFixed(2)}`, color: '#7C4DFF', ruta: '/nomina' },
    { titulo: 'Productos sin Proveedor', valor: resumen.productosSinProveedor, color: '#FF7043', ruta: '/inventario' }
  ] : [];

  return (
    <div className="container mt-4 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-light">Dashboard</h2>
        <div className="d-flex gap-2 align-items-center">
          <input type="date" className="form-control bg-dark text-light" value={desde} onChange={e => setDesde(e.target.value)} />
          <span className="text-light">a</span>
          <input type="date" className="form-control bg-dark text-light" value={hasta} onChange={e => setHasta(e.target.value)} />
        </div>
      </div>

      <div className="row g-4">
        {KPIS.map((card, idx) => (
          <div className="col-md-4" key={idx}>
            <div
              className="card p-3 h-100 text-light"
              style={{ backgroundColor: '#1e1e1e', borderLeft: `6px solid ${card.color}`, cursor: 'pointer' }}
              onClick={() => navigate(card.ruta)}
            >
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