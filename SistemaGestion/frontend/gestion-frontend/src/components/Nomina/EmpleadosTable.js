import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import HorarioForm from './HorarioForm';

const EmpleadosTable = () => {
  const [empleados, setEmpleados] = useState([]);
  const [show, setShow] = useState(false);
  const [showHorario, setShowHorario] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({ nombre: '', puesto: '', salario: '' });
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  const obtenerEmpleados = async () => {
    try {
      const response = await axios.get('/empleados');
      setEmpleados(response.data);
    } catch (error) {
      console.error('❌ Error al cargar empleados:', error);
    }
  };

  const agregarEmpleado = async () => {
    try {
      if (editando) {
        await axios.put(`/empleados/${empleadoSeleccionado.empleado_id}`, nuevoEmpleado);
        alert('✅ Empleado actualizado correctamente');
        setEditando(false);
      } else {
        await axios.post('/empleados', nuevoEmpleado);
        alert('✅ Empleado agregado correctamente');
      }
      obtenerEmpleados();
      setShow(false);
      setNuevoEmpleado({ nombre: '', puesto: '', salario: '' });
    } catch (error) {
      console.error('❌ Error al agregar o actualizar empleado:', error);
      alert('❌ Error al guardar el empleado');
    }
  };

  const editarEmpleado = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setNuevoEmpleado({
      nombre: empleado.nombre,
      puesto: empleado.puesto,
      salario: empleado.salario,
    });
    setEditando(true);
    setShow(true);
  };

  const eliminarEmpleado = async (empleado_id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      try {
        await axios.delete(`/empleados/${empleado_id}`);
        alert('✅ Empleado eliminado correctamente');
        obtenerEmpleados();
      } catch (error) {
        console.error('❌ Error al eliminar empleado:', error);
        alert('❌ Error al eliminar el empleado');
      }
    }
  };

  const guardarHorario = async (empleado_id, dias, semana_id) => {
    try {
      await axios.post(`/horarios/${empleado_id}`, { dias, semana_id });
      alert('✅ Horario guardado correctamente');
      setShowHorario(false);
      obtenerEmpleados();
    } catch (error) {
      console.error('❌ Error al guardar horario:', error);
      alert('❌ Error al guardar el horario');
    }
  };

  const editarHorario = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setShowHorario(true);
  };

  return (
    <div className="fade-in card p-3">
      <h3 className="text-light">Lista de Empleados</h3>
      <Button className="btn btn-success mb-3" onClick={() => setShow(true)}>
        Agregar Empleado
      </Button>

      <div className="table-responsive">
        <Table striped bordered hover responsive className="table table-dark table-hover rounded">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Puesto</th>
              <th>Salario mensual</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr key={empleado.empleado_id}>
                <td>{empleado.nombre}</td>
                <td>{empleado.puesto}</td>
                <td>${parseFloat(empleado.salario).toFixed(2)}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => editarEmpleado(empleado)}>
                    Editar
                  </Button>
                  <Button variant="primary" size="sm" className="me-2" onClick={() => editarHorario(empleado)}>
                    Editar Horario
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => eliminarEmpleado(empleado.empleado_id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={2}><strong>Total de la Nómina</strong></td>
              <td colSpan={2}>
                <strong>
                  ${empleados.reduce((total, emp) => total + parseFloat(emp.salario || 0), 0).toFixed(2)}
                </strong>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>

      {/* Modal para agregar o editar empleado */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editando ? 'Editar Empleado' : 'Agregar Empleado'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nuevoEmpleado.nombre}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Puesto</Form.Label>
              <Form.Control
                type="text"
                value={nuevoEmpleado.puesto}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, puesto: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Salario quincenal</Form.Label>
              <Form.Control
                type="number"
                value={nuevoEmpleado.salario}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, salario: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>
          <Button variant="primary" onClick={agregarEmpleado}>
            {editando ? 'Actualizar' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar horario */}
      <Modal show={showHorario} onHide={() => setShowHorario(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Horario - {empleadoSeleccionado?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {empleadoSeleccionado && (
            <HorarioForm
              onSave={(dias, semana_id) => guardarHorario(empleadoSeleccionado.empleado_id, dias, semana_id)}
              empleadoId={empleadoSeleccionado.empleado_id}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EmpleadosTable;
