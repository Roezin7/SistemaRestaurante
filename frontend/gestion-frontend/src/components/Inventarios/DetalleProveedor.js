import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const DetalleProveedor = ({ proveedorId, onVolver }) => {
  const [proveedor, setProveedor] = useState(null);
  const [productos, setProductos] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
    if (proveedorId) {
      obtenerProveedor();
      obtenerProductos();
    }
  }, [proveedorId]);

  const obtenerProveedor = async () => {
    try {
      const res = await axios.get('/inventarios/proveedores');
      const p = res.data.find(p => p.proveedor_id === proveedorId);
      setProveedor(p);
    } catch (err) {
      console.error('Error al cargar proveedor:', err);
    }
  };

  const obtenerProductos = async () => {
    try {
      const res = await axios.get(`/inventarios/proveedores/${proveedorId}/productos`);
      setProductos(res.data);
    } catch (err) {
      console.error('Error al cargar productos del proveedor:', err);
    }
  };

  if (!proveedor) return <div className="text-light">Cargando proveedor...</div>;

  return (
    <div className="card bg-dark text-light p-4 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Detalle del Proveedor</h4>
        <button className="btn btn-outline-light" onClick={onVolver}>Volver</button>
      </div>

      <div className="mb-4">
        <p><strong>Nombre:</strong> {proveedor.nombre}</p>
        <p><strong>Empresa:</strong> {proveedor.empresa}</p>
        <p><strong>Contacto:</strong> {proveedor.contacto}</p>
        <p><strong>Tipo de Pago:</strong> {proveedor.tipo_pago}</p>
        <p><strong>Notas:</strong> {proveedor.notas}</p>
      </div>

      <h5>Productos de este proveedor</h5>
      <div className="table-responsive">
        <table className="table table-dark table-hover text-center align-middle">
          <thead>
            <tr>
              <th>Código</th>
              <th>Concepto</th>
              <th>Cantidad</th>
              <th>Precio Caja</th>
              <th>Precio Unitario</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.producto_id}>
                <td>{p.codigo}</td>
                <td>{p.concepto}</td>
                <td>{p.cantidad}</td>
                <td>${parseFloat(p.precio_caja).toFixed(2)}</td>
                <td>${parseFloat(p.precio_unitario).toFixed(2)}</td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan={5}>No hay productos asociados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetalleProveedor;