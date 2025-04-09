const pool = require('../config/db');

module.exports = {
  // PRODUCTOS
  obtenerProductos: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT p.*, pr.nombre AS proveedor_nombre
        FROM productos p
        LEFT JOIN proveedores pr ON p.proveedor_id = pr.proveedor_id
        ORDER BY p.producto_id DESC`);
      res.json(result.rows);
    } catch (err) {
      console.error('Error al obtener productos:', err);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  },

  crearProducto: async (req, res) => {
    const { codigo, concepto, cantidad, precio_caja, proveedor_id } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO productos (codigo, concepto, cantidad, precio_caja, proveedor_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [codigo, concepto, cantidad, precio_caja, proveedor_id]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error al crear producto:', err);
      res.status(500).json({ error: 'Error al crear producto' });
    }
  },

  actualizarProducto: async (req, res) => {
    const { id } = req.params;
    const { codigo, concepto, cantidad, precio_caja, proveedor_id } = req.body;
    try {
      await pool.query(
        'UPDATE productos SET codigo=$1, concepto=$2, cantidad=$3, precio_caja=$4, proveedor_id=$5 WHERE producto_id=$6',
        [codigo, concepto, cantidad, precio_caja, proveedor_id, id]
      );
      res.sendStatus(204);
    } catch (err) {
      console.error('Error al actualizar producto:', err);
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
  },

  eliminarProducto: async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM productos WHERE producto_id = $1', [id]);
      res.sendStatus(204);
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  },

  // PROVEEDORES
  obtenerProveedores: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM proveedores ORDER BY proveedor_id DESC');
      res.json(result.rows);
    } catch (err) {
      console.error('Error al obtener proveedores:', err);
      res.status(500).json({ error: 'Error al obtener proveedores' });
    }
  },

  crearProveedor: async (req, res) => {
    const { nombre, contacto, empresa, tipo_pago, notas } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO proveedores (nombre, contacto, empresa, tipo_pago, notas) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nombre, contacto, empresa, tipo_pago, notas]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error al crear proveedor:', err);
      res.status(500).json({ error: 'Error al crear proveedor' });
    }
  },

  actualizarProveedor: async (req, res) => {
    const { id } = req.params;
    const { nombre, contacto, empresa, tipo_pago, notas } = req.body;
    try {
      await pool.query(
        'UPDATE proveedores SET nombre=$1, contacto=$2, empresa=$3, tipo_pago=$4, notas=$5 WHERE proveedor_id=$6',
        [nombre, contacto, empresa, tipo_pago, notas, id]
      );
      res.sendStatus(204);
    } catch (err) {
      console.error('Error al actualizar proveedor:', err);
      res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
  },

  eliminarProveedor: async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM proveedores WHERE proveedor_id = $1', [id]);
      res.sendStatus(204);
    } catch (err) {
      console.error('Error al eliminar proveedor:', err);
      res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
  },

  obtenerProductosPorProveedor: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        'SELECT * FROM productos WHERE proveedor_id = $1 ORDER BY producto_id DESC',
        [id]
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Error al obtener productos del proveedor:', err);
      res.status(500).json({ error: 'Error al obtener productos del proveedor' });
    }
  }
};