const pool = require('../config/db');

// Registrar un gasto
const addGasto = async (req, res) => {
    const { categoria, descripcion, monto } = req.body;
    try {
        await pool.query(
            'INSERT INTO gastos (categoria, descripcion, monto) VALUES ($1, $2, $3)',
            [categoria, descripcion, monto]
        );
        res.status(201).json({ message: 'Gasto registrado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addGasto };
