import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Button, Modal, Form } from 'react-bootstrap';
import HorarioForm from './HorarioForm';

const EmpleadosTable = () => {
    const [empleados, setEmpleados] = useState([]);
    const [nombre, setNombre] = useState('');
    const [puesto, setPuesto] = useState('');
    const [salario, setSalario] = useState('');
    const [show, setShow] = useState(false);
    const [editingEmpleado, setEditingEmpleado] = useState(null);
    const [showHorario, setShowHorario] = useState(false);

    useEffect(() => {
        obtenerEmpleados();
    }, []);

    const obtenerEmpleados = async () => {
        try {
            const response = await axios.get('/empleados');
            setEmpleados(response.data);
        } catch (error) {
            console.error('Error al cargar empleados:', error);
        }
    };

    const agregarEmpleado = async () => {
        try {
            await axios.post('/empleados', { nombre, puesto, salario });
            obtenerEmpleados();
            handleClose();
            alert('Empleado agregado exitosamente');
        } catch (error) {
            console.error('Error al agregar empleado:', error);
        }
    };

    const actualizarEmpleado = async (empleado_id) => {
        try {
            await axios.put(`/empleados/${empleado_id}`, { nombre, puesto, salario });
            obtenerEmpleados();
            handleClose();
            alert('Empleado actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar empleado:', error);
        }
    };

    const eliminarEmpleado = async (empleado_id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
            try {
                await axios.delete(`/empleados/${empleado_id}`);
                obtenerEmpleados();
                alert('Empleado eliminado correctamente');
            } catch (error) {
                console.error('Error al eliminar empleado:', error);
            }
        }
    };

    const handleShow = (empleado) => {
        if (empleado) {
            setEditingEmpleado(empleado);
            setNombre(empleado.nombre);
            setPuesto(empleado.puesto);
            setSalario(empleado.salario);
        } else {
            setEditingEmpleado(null);
            setNombre('');
            setPuesto('');
            setSalario('');
        }
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setEditingEmpleado(null);
    };

    const handleShowHorario = (empleado) => {
        setEditingEmpleado(empleado);
        setShowHorario(true);
    };

    const handleCloseHorario = () => setShowHorario(false);

    const guardarHorario = async (dias) => {
        if (!editingEmpleado) return;

        try {
            await axios.post(`/horarios/${editingEmpleado.empleado_id}`, { dias });
            alert('Horario guardado correctamente');
            handleCloseHorario();
        } catch (error) {
            console.error('Error al guardar horario:', error);
        }
    };

    return (
        <div>
            <h3>Lista de Empleados</h3>
            <Button variant="primary" onClick={() => handleShow(null)}>Agregar Empleado</Button>

            {/* Modal para Agregar/Editar Empleado */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingEmpleado ? 'Editar Empleado' : 'Agregar Empleado'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Puesto</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Puesto"
                                value={puesto}
                                onChange={(e) => setPuesto(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Salario</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Salario"
                                value={salario}
                                onChange={(e) => setSalario(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                    <Button variant="success" onClick={() => {
                        if (editingEmpleado) {
                            actualizarEmpleado(editingEmpleado.empleado_id);
                        } else {
                            agregarEmpleado();
                        }
                    }}>
                        {editingEmpleado ? 'Actualizar' : 'Guardar'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para Asignar Horario */}
            <Modal show={showHorario} onHide={handleCloseHorario}>
                <Modal.Header closeButton>
                    <Modal.Title>Asignar Horario a {editingEmpleado?.nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <HorarioForm onSave={guardarHorario} empleado_id={editingEmpleado?.empleado_id} />
                </Modal.Body>
            </Modal>

            {/* Tabla de Empleados */}
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Puesto</th>
                        <th>Salario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {empleados.map((empleado) => (
                        <tr key={empleado.empleado_id}>
                            <td>{empleado.nombre}</td>
                            <td>{empleado.puesto}</td>
                            <td>${empleado.salario}</td>
                            <td>
                                <Button variant="info" onClick={() => handleShowHorario(empleado)}>Horario</Button>{' '}
                                <Button variant="warning" onClick={() => handleShow(empleado)}>Editar</Button>{' '}
                                <Button variant="danger" onClick={() => eliminarEmpleado(empleado.empleado_id)}>Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmpleadosTable;
