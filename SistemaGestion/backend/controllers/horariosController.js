const pool = require('../config/db');  // Asegúrate de que la ruta sea correcta

// Crear Horario
const crearHorario = async (req, res) => {
    try {
        const { empleado_id } = req.params;
        const { dias } = req.body;

        if (!empleado_id || !dias || dias.length === 0) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        for (const dia of dias) {
            const { dia: nombreDia, hora_inicio, hora_fin } = dia;

            if (!nombreDia || !hora_inicio || !hora_fin) {
                console.warn(`🚫 Campos incompletos: ${nombreDia}, ${hora_inicio}, ${hora_fin}`);
                continue;
            }

            console.log(`🌟 Guardando horario para el día: ${nombreDia}, inicio: ${hora_inicio}, fin: ${hora_fin}`);

            await pool.query(
                'INSERT INTO horarios (empleado_id, dia, hora_inicio, hora_fin) VALUES ($1, $2, $3::time, $4::time)',
                [empleado_id, nombreDia, hora_inicio, hora_fin]
            );
        }

        res.status(201).json({ message: "Horarios creados exitosamente" });
    } catch (error) {
        console.error('❌ Error al crear horario:', error.message);
        res.status(500).json({ message: 'Error al crear horario', error: error.message });
    }
};

// Obtener Horarios para el Calendario
const obtenerHorarios = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT h.horario_id, h.dia, h.hora_inicio, h.hora_fin, e.nombre 
            FROM horarios h
            JOIN empleados e ON h.empleado_id = e.empleado_id
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('❌ Error al obtener horarios:', error.message);
        res.status(500).json({ message: 'Error al obtener horarios', error: error.message });
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

module.exports = { crearHorario, obtenerHorarios, eliminarHorario };

