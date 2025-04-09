import React, { useState } from 'react';
import Productos from '../components/Inventarios/Productos';
import Proveedores from '../components/Inventarios/Proveedores';
import DetalleProveedor from '../components/Inventarios/DetalleProveedor';

const Inventario = () => {
  const [vista, setVista] = useState('productos'); // 'productos' | 'proveedores' | 'detalle'
  const [proveedorActual, setProveedorActual] = useState(null);

  const verProveedor = (id) => {
    setProveedorActual(id);
    setVista('detalle');
  };

  const verProductos = () => setVista('productos');
  const verProveedores = () => setVista('proveedores');
  const volver = () => {
    setProveedorActual(null);
    setVista('proveedores');
  };

  return (
    <div className="container mt-4 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-light">Inventario</h2>
        <div className="btn-group">
          <button className="btn btn-outline-light" onClick={verProductos}>Productos</button>
          <button className="btn btn-outline-light" onClick={verProveedores}>Proveedores</button>
        </div>
      </div>

      {vista === 'productos' && <Productos onVerProveedor={verProveedor} />}
      {vista === 'proveedores' && <Proveedores onVerProductos={verProveedor} />}
      {vista === 'detalle' && proveedorActual && <DetalleProveedor proveedorId={proveedorActual} onVolver={volver} />}
    </div>
  );
};

export default Inventario;