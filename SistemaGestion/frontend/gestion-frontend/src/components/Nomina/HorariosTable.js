import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Table, Button, Form } from 'react-bootstrap';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // sin destructuring


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
                obtenerHorarios(semanaSeleccionada);
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

  const exportarPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });

    const semana = semanas.find(s => s.semana_id === semanaSeleccionada);
    const titulo = semana
        ? `Semana ${semana.numero_semana}: ${dayjs(semana.fecha_inicio).format('DD MMM YYYY')} al ${dayjs(semana.fecha_fin).format('DD MMM YYYY')}`
        : 'Horario Semanal';

    doc.setFontSize(16);
    doc.text('Horario Semanal', 14, 15);

    doc.setFontSize(12);
    doc.text(titulo, 14, 23);

    const diasConHorarios = {};
    diasSemana.forEach(dia => {
        diasConHorarios[dia] = horarios
            .filter(h => h.dia === dia)
            .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
            .map(h => `${h.nombre.toUpperCase()}\n${h.hora_inicio.slice(0, 5)} - ${h.hora_fin.slice(0, 5)}`);
    });

    const maxFilas = Math.max(...Object.values(diasConHorarios).map(arr => arr.length));
    const body = [];

    for (let i = 0; i < maxFilas; i++) {
        const fila = diasSemana.map(dia => diasConHorarios[dia][i] || '—');
        body.push(fila);
    }

    doc.autoTable({
        head: [diasSemana],
        body,
        startY: 30,
        styles: {
            halign: 'center',
            valign: 'middle',
            fontSize: 9,
            cellPadding: 3
        },
        headStyles: {
            fillColor: [33, 150, 243],
            textColor: 255,
            fontStyle: 'bold'
        },
        theme: 'grid',
        pageBreak: 'auto', // 👈 esto permite salto de página si es necesario
    });

    doc.save(`${titulo}.pdf`);
};
    
    return (
        <div>
            <h3>Horario Semanal</h3>

            <Button variant="outline-primary" className="mb-3" onClick={exportarPDF}>
                Exportar a PDF
            </Button>

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
            <Table striped bordered hover responsive className="table table-dark table-hover text-center rounded">
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