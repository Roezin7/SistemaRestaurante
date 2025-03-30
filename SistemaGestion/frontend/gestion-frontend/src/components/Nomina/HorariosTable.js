import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Table, Button, Form } from 'react-bootstrap';
import dayjs from 'dayjs';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const HorariosTable = () => {
    const [horarios, setHorarios] = useState([]);
    const [semanas, setSemanas] = useState([]);
    const [semanaSeleccionada, setSemanaSeleccionada] = useState('');

    useEffect(() => {
        const obtenerSemanas = async () => {
            try {
                const response = await axios.get('/horarios/semanas');
                const semanasOrdenadas = response.data.sort((a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio));

                const hoy = dayjs();
                const semanaActual = semanasOrdenadas.find(s =>
                    hoy.isAfter(dayjs(s.fecha_inicio).subtract(1, 'day')) &&
                    hoy.isBefore(dayjs(s.fecha_fin).add(1, 'day'))
                );

                setSemanas(semanasOrdenadas);
                if (semanaActual) {
                    setSemanaSeleccionada(semanaActual.semana_id);
                } else if (semanasOrdenadas.length > 0) {
                    setSemanaSeleccionada(semanasOrdenadas[0].semana_id);
                }
            } catch (error) {
                console.error('❌ Error al cargar semanas:', error);
            }
        };
        obtenerSemanas();
    }, []);

    useEffect(() => {
        if (semanaSeleccionada) {
            obtenerHorarios(semanaSeleccionada);
        }
    }, [semanaSeleccionada]);

    const obtenerHorarios = async (semana_id) => {
        try {
            const response = await axios.get(`/horarios?semana_id=${semana_id}`);
            setHorarios(response.data);
        } catch (error) {
            console.error('❌ Error al cargar horarios:', error);
        }
    };

    const eliminarHorario = async (horario_id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este horario?")) {
            try {
                await axios.delete(`/horarios/${horario_id}`);
                alert('✅ Horario eliminado correctamente');
                obtenerHorarios(semanaSeleccionada); // recargar horarios
            } catch (error) {
                console.error('❌ Error al eliminar horario:', error);
                alert('❌ Error al eliminar el horario');
            }
        }
    };

    const filtrarHorariosPorDia = (dia) => {
        return horarios
            .filter(horario => horario.dia === dia)
            .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
            .map(horario => (
                <div key={horario.horario_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>
                        <strong>{horario.nombre}</strong><br />
                        {horario.hora_inicio} - {horario.hora_fin}
                    </span>
                    <Button variant="danger" size="sm" onClick={() => eliminarHorario(horario.horario_id)}>X</Button>
                </div>
            ));
    };

    return (
        <div>
            <h3>Horario Semanal</h3>

            <Form.Group className="mb-3" controlId="semanaSelect">
                <Form.Label>Seleccionar Semana</Form.Label>
                <Form.Select
                    value={semanaSeleccionada}
                    onChange={(e) => setSemanaSeleccionada(e.target.value)}
                >
                    <option value="">Selecciona una semana</option>
                    {semanas.map((semana) => (
                        <option key={semana.semana_id} value={semana.semana_id}>
                            Semana {semana.numero_semana} ({dayjs(semana.fecha_inicio).format('DD MMM YYYY')} al {dayjs(semana.fecha_fin).format('DD MMM YYYY')})
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        {diasSemana.map((dia) => (
                            <th key={dia}>{dia}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {diasSemana.map((dia) => (
                            <td key={dia} style={{ verticalAlign: 'top' }}>
                                {filtrarHorariosPorDia(dia)}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </Table>
        </div>
    );
};

export default HorariosTable;
