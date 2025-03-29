const pool = require('../config/db');

// Obtener todos los productos del inventario
const getInventario = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM inventario ORDER BY categoria, nombre');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Agregar un nuevo producto al inventario
const addProducto = async (req, res) => {
    const { categoria, nombre, cantidad, costo_unitario, precio_venta } = req.body;
    try {
        await pool.query(
            'INSERT INTO inventario (categoria, nombre, cantidad, costo_unitario, precio_venta) VALUES ($1, $2, $3, $4, $5)',
            [categoria, nombre, cantidad, costo_unitario, precio_venta]
        );
        res.status(201).json({ message: 'Producto agregado al inventario' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getInventario, addProducto };
