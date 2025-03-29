import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Table, Button } from 'react-bootstrap';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const HorariosTable = () => {
    const [horarios, setHorarios] = useState([]);

    useEffect(() => {
        obtenerHorarios();
    }, []);

    const obtenerHorarios = async () => {
        try {
            const response = await axios.get('/horarios');
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
                obtenerHorarios(); // Recargar la tabla
            } catch (error) {
                console.error('❌ Error al eliminar horario:', error);
                alert('❌ Error al eliminar el horario');
            }
        }
    };

    const filtrarHorariosPorDia = (dia) => {
        return horarios
            .filter(horario => horario.dia === dia)
            .map(horario => (
                <div key={horario.horario_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>
                        <strong>{horario.nombre}</strong> <br />
                        {horario.hora_inicio} - {horario.hora_fin}
                    </span>
                    <Button variant="danger" size="sm" onClick={() => eliminarHorario(horario.horario_id)}>X</Button>
                </div>
            ));
    };

    return (
        <div>
            <h3>Horario Semanal</h3>
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
