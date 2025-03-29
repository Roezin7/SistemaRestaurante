const pool = require('../config/db');

// Crear un nuevo empleado
const agregarEmpleado = async (req, res) => {
    const { nombre, puesto, salario, horario } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO empleados (nombre, puesto, salario, horario) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, puesto, salario, horario]
        );
        res.status(201).json({ message: 'Empleado registrado exitosamente', empleado: result.rows[0] });
    } catch (error) {
        console.error('Error al agregar empleado:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los empleados
const getEmpleados = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM empleados ORDER BY nombre');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un empleado
const actualizarEmpleado = async (req, res) => {
    const { empleado_id } = req.params;
    const { nombre, puesto, salario, horario } = req.body;

    try {
        const result = await pool.query(
            'UPDATE empleados SET nombre = $1, puesto = $2, salario = $3, horario = $4 WHERE empleado_id = $5 RETURNING *',
            [nombre, puesto, salario, horario, empleado_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        res.status(200).json({ message: 'Empleado actualizado correctamente', empleado: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar empleado:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un empleado
const eliminarEmpleado = async (req, res) => {
    const { empleado_id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM empleados WHERE empleado_id = $1 RETURNING *',
            [empleado_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        res.status(200).json({ message: 'Empleado eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar empleado:', error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { agregarEmpleado, getEmpleados, actualizarEmpleado, eliminarEmpleado };
