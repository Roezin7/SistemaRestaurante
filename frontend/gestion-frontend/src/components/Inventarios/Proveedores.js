import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const Proveedores = ({ onVerProductos }) => {
  const [proveedores, setProveedores] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: '',
    contacto: '',
    empresa: '',
    tipo_pago: '',
    notas: ''
  });
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    obtenerProveedores();
  }, []);

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
      nombre: '',
      contacto: '',
      empresa: '',
      tipo_pago: '',
      notas: ''
    });
    setEditandoId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`/inventarios/proveedores/${editandoId}`, formulario);
      } else {
        await axios.post('/inventarios/proveedores', formulario);
      }
      obtenerProveedores();
      limpiarFormulario();
    } catch (err) {
      alert('Error al guardar el proveedor');
    }
  };

  const handleEditar = (prov) => {
    setFormulario({
      nombre: prov.nombre,
      contacto: prov.contacto,
      empresa: prov.empresa,
      tipo_pago: prov.tipo_pago,
      notas: prov.notas
    });
    setEditandoId(prov.proveedor_id);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Eliminar este proveedor?')) {
      await axios.delete(`/inventarios/proveedores/${id}`);
      obtenerProveedores();
    }
  };

  return (
    <div className="card p-4 fade-in bg-dark text-light">
      <h3 className="mb-3">Gestión de Proveedores</h3>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label text-light">Nombre</label>
        <input name="nombre" type="text" className="form-control bg-dark text-light" placeholder="Nombre"
              value={formulario.nombre} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <label className="form-label text-light">Contacto</label>
        <input name="contacto" type="text" className="form-control bg-dark text-light" placeholder="Contacto"
              value={formulario.contacto} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <label className="form-label text-light">Empresa</label>
        <input name="empresa" type="text" className="form-control bg-dark text-light" placeholder="Empresa"
              value={formulario.empresa} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <label className="form-label text-light">Tipo de Pago</label>
        <input name="tipo_pago" type="text" className="form-control bg-dark text-light" placeholder="Tipo de Pago"
              value={formulario.tipo_pago} onChange={handleChange} />
          </div>
          <div className="col-md-12">
            <label className="form-label text-light">Notas</label>
        <textarea name="notas" className="form-control bg-dark text-light" placeholder="Notas"
              rows="2" value={formulario.notas} onChange={handleChange}></textarea>
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
              <th>Nombre</th>
              <th>Empresa</th>
              <th>Contacto</th>
              <th>Tipo de Pago</th>
              <th>Notas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((p) => (
              <tr key={p.proveedor_id}>
                <td>{p.nombre}</td>
                <td>{p.empresa}</td>
                <td>{p.contacto}</td>
                <td>{p.tipo_pago}</td>
                <td>{p.notas}</td>
                <td>
                  <button className="btn btn-outline-light btn-sm me-1" onClick={() => onVerProductos?.(p.proveedor_id)}>
                    Ver productos
                  </button>
                  <button className="btn btn-warning btn-sm me-1" onClick={() => handleEditar(p)}>
                    Editar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(p.proveedor_id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Proveedores;