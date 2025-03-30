import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Button, Form } from 'react-bootstrap';
import { TimePicker } from 'antd';
import 'antd/dist/reset.css';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const HorarioForm = ({ onSave }) => {
    const [horarios, setHorarios] = useState({});
    const [semanas, setSemanas] = useState([]);
    const [semanaSeleccionada, setSemanaSeleccionada] = useState('');

    useEffect(() => {
        const obtenerSemanas = async () => {
            try {
                const response = await axios.get('/horarios/semanas');
                setSemanas(response.data);
            } catch (error) {
                console.error('❌ Error al obtener semanas:', error);
            }
        };
        obtenerSemanas();
    }, []);

    const handleHorarioChange = (dia, horaInicio, horaFin) => {
        setHorarios((prev) => ({
            ...prev,
            [dia]: { inicio: horaInicio, fin: horaFin }
        }));
    };

    const guardarHorarios = () => {
        if (!semanaSeleccionada) {
            alert('Selecciona una semana antes de guardar.');
            return;
        }

        const dias = diasSemana
            .filter(dia => horarios[dia]?.inicio && horarios[dia]?.fin)
            .map(dia => ({
                dia,
                hora_inicio: horarios[dia].inicio,
                hora_fin: horarios[dia].fin
            }));

        if (dias.length === 0) {
            alert("Debe ingresar al menos un horario.");
            return;
        }

        // 🟢 Enviar también el semana_id
        onSave(dias, semanaSeleccionada);
    };

    return (
        <div>
            <h5>Asignar Horario</h5>

            <Form.Group className="mb-3">
                <Form.Label>Seleccionar Semana</Form.Label>
                <Form.Select
                    value={semanaSeleccionada}
                    onChange={(e) => setSemanaSeleccionada(e.target.value)}
                >
                    <option value="">Selecciona una semana</option>
                    {semanas.map((semana) => (
                        <option key={semana.semana_id} value={semana.semana_id}>
                            Semana {semana.numero_semana} ({semana.inicio} al {semana.fin})
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            {diasSemana.map((dia) => (
                <Form.Group key={dia} className="mb-3">
                    <Form.Label>{dia}</Form.Label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <TimePicker
                            placeholder="Inicio"
                            format="HH:mm"
                            onChange={(time, timeString) => handleHorarioChange(dia, timeString, horarios[dia]?.fin)}
                        />
                        <TimePicker
                            placeholder="Fin"
                            format="HH:mm"
                            onChange={(time, timeString) => handleHorarioChange(dia, horarios[dia]?.inicio, timeString)}
                        />
                    </div>
                </Form.Group>
            ))}

            <Button variant="success" onClick={guardarHorarios}>Guardar Horario</Button>
        </div>
    );
};

export default HorarioForm;
