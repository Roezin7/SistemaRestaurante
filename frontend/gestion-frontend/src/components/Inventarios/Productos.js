import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const Productos = ({ onVerProveedor }) => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [formulario, setFormulario] = useState({
    codigo: '',
    concepto: '',
    cantidad: '',
    precio_caja: '',
    proveedor_id: ''
  });
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    obtenerProductos();
    obtenerProveedores();
  }, []);

  const obtenerProductos = async () => {
    const res = await axios.get('/inventarios/productos');
    setProductos(res.data);
  };

  const obtenerProveedores = async () => {
    const res = await axios.get('/inventarios/proveedores');
    setProveedores(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const limpiarFormulario = () => {
    setFormulario({
      codigo: '',
      concepto: '',
      cantidad: '',
      precio_caja: '',
      proveedor_id: ''
    });
    setEditandoId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`/inventarios/productos/${editandoId}`, formulario);
      } else {
        await axios.post('/inventarios/productos', formulario);
      }
      obtenerProductos();
      limpiarFormulario();
    } catch (err) {
      alert('Error al guardar el producto');
    }
  };

  const handleEditar = (producto) => {
    setFormulario({
      codigo: producto.codigo,
      concepto: producto.concepto,
      cantidad: producto.cantidad,
      precio_caja: producto.precio_caja,
      proveedor_id: producto.proveedor_id
    });
    setEditandoId(producto.producto_id);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      await axios.delete(`/inventarios/productos/${id}`);
      obtenerProductos();
    }
  };

  const calcularUnitario = () => {
    const { precio_caja, cantidad } = formulario;
    const precio = parseFloat(precio_caja);
    const cant = parseInt(cantidad);
    if (!isNaN(precio) && !isNaN(cant) && cant > 0) {
      return (precio / cant).toFixed(2);
    }
    return '';
  };

  return (
    <div className="card p-4 fade-in bg-dark text-light">
      <h3 className="mb-3">Gestión de Productos</h3>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-2">
            <label className="form-label text-light">Código</label>
        <input name="codigo" type="text" className="form-control bg-dark text-light" placeholder="Código"
              value={formulario.codigo} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <label className="form-label text-light">Concepto</label>
        <input name="concepto" type="text" className="form-control bg-dark text-light" placeholder="Concepto"
              value={formulario.concepto} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <label className="form-label text-light">Cantidad</label>
        <input name="cantidad" type="number" className="form-control bg-dark text-light" placeholder="Cantidad"
              value={formulario.cantidad} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <label className="form-label text-light">Precio por Caja</label>
        <input name="precio_caja" type="number" className="form-control bg-dark text-light" placeholder="Precio/Caja"
              value={formulario.precio_caja} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
          <label className="form-label text-light">Precio Unitario</label>
            <input disabled className="form-control bg-secondary text-light" value={calcularUnitario()} placeholder="Precio Unitario" />
          </div>
          <div className="col-md-3">
            <label className="form-label text-light">Proveedor</label>
        <select name="proveedor_id" className="form-select bg-dark text-light"
              value={formulario.proveedor_id} onChange={handleChange} required>
              <option value="">Proveedor</option>
              {proveedores.map(p => (
                <option key={p.proveedor_id} value={p.proveedor_id}>{p.nombre}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3">
          <button type="submit" className="btn btn-primary me-2">
            {editandoId ? 'Actualizar' : 'Agregar'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={limpiarFormulario}>
            Cancelar
          </button>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-dark table-hover text-center align-middle">
          <thead>
            <tr>
              <th>Código</th>
              <th>Concepto</th>
              <th>Cantidad</th>
              <th>Precio/Caja</th>
              <th>Precio Unitario</th>
              <th>Proveedor</th>
              <th>Acciones</th>
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
                <td>
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => onVerProveedor && onVerProveedor(p.proveedor_id)}
                  >
                    {p.proveedor_nombre || '—'}
                  </button>
                </td>
                <td>
                  <button className="btn btn-warning btn-sm me-1" onClick={() => handleEditar(p)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(p.producto_id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Productos;