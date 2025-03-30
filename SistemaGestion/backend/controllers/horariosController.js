const pool = require('../config/db');  // Asegúrate de que la ruta sea correcta

// Crear Horario
const crearHorario = async (req, res) => {
    const { empleado_id } = req.params;
    const { dias, semana_id } = req.body;

    if (!dias || !semana_id || dias.length === 0) {
        return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    try {
        // Primero elimina horarios existentes del empleado para esa semana (opcional)
        await pool.query(
            'DELETE FROM horarios WHERE empleado_id = $1 AND semana_id = $2',
            [empleado_id, semana_id]
        );

        // Insertar nuevos horarios
        for (const dia of dias) {
            await pool.query(
                'INSERT INTO horarios (empleado_id, dia, hora_inicio, hora_fin, semana_id) VALUES ($1, $2, $3, $4, $5)',
                [empleado_id, dia.dia, dia.hora_inicio, dia.hora_fin, semana_id]
            );
        }

        res.status(201).json({ message: 'Horario guardado correctamente' });
    } catch (error) {
        console.error('❌ Error al guardar horario:', error);
        res.status(500).json({ message: 'Error al guardar horario' });
    }
};


// Controlador actualizado
const obtenerHorarios = async (req, res) => {
    const { semana_id } = req.query;

    try {
        let result;
        if (semana_id) {
            result = await pool.query(
                `SELECT h.*, e.nombre 
                 FROM horarios h
                 JOIN empleados e ON h.empleado_id = e.empleado_id
                 WHERE h.semana_id = $1`,
                [semana_id]
            );
        } else {
            result = await pool.query(
                `SELECT h.*, e.nombre 
                 FROM horarios h
                 JOIN empleados e ON h.empleado_id = e.empleado_id`
            );
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('❌ Error al obtener horarios:', error);
        res.status(500).json({ message: 'Error al obtener horarios' });
    }
};

// Eliminar Horario
const eliminarHorario = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM horarios WHERE horario_id = $1', [id]);
        res.status(200).json({ message: 'Horario eliminado correctamente' });
    } catch (error) {
        console.error('❌ Error al eliminar horario:', error.message);
        res.status(500).json({ message: 'Error al eliminar horario', error: error.message });
    }
};

// Crear nueva semana
const crearSemana = async (req, res) => {
    const { numero_semana, fecha_inicio, fecha_fin } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO semanas (numero_semana, fecha_inicio, fecha_fin) VALUES ($1, $2, $3) RETURNING *',
            [numero_semana, fecha_inicio, fecha_fin]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('❌ Error al crear semana:', error);
        res.status(500).json({ message: 'Error al crear semana' });
    }
};

// Obtener semanas registradas
const obtenerSemanas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM semanas ORDER BY fecha_inicio DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('❌ Error al obtener semanas:', error);
        res.status(500).json({ message: 'Error al obtener semanas' });
    }
};


module.exports = { crearHorario, obtenerHorarios, eliminarHorario, crearSemana, obtenerSemanas };

