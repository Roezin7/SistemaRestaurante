import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { TimePicker } from 'antd';
import 'antd/dist/reset.css';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const HorarioForm = ({ onSave }) => {
    const [horarios, setHorarios] = useState({});

    const handleHorarioChange = (dia, horaInicio, horaFin) => {
        setHorarios((prev) => ({
            ...prev,
            [dia]: { inicio: horaInicio, fin: horaFin }
        }));
    };

    const guardarHorarios = () => {
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

        onSave(dias);
    };

    return (
        <div>
            <h5>Asignar Horario</h5>
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
