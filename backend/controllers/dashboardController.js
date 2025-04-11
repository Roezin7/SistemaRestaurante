const pool = require('../config/db');

const obtenerResumenDashboard = async (req, res) => {
    try {
      const { desde, hasta } = req.query;
  
      const inicio = desde || new Date().toISOString().split('T')[0];
      const fin = hasta || inicio;
  
      const [ingresos, egresos, chequesPend, empleados, productosSinProveedor] = await Promise.all([
        pool.query("SELECT COALESCE(SUM(monto), 0) AS total FROM ingresos WHERE fecha BETWEEN $1 AND $2", [inicio, fin]),
        pool.query("SELECT COALESCE(SUM(monto), 0) AS total FROM egresos WHERE fecha BETWEEN $1 AND $2", [inicio, fin]),
        pool.query("SELECT COUNT(*) AS cantidad FROM cheques WHERE estado = 'Pendiente'"),
        pool.query("SELECT COUNT(*) AS total, COALESCE(SUM(salario),0) AS nomina FROM empleados"),
        pool.query("SELECT COUNT(*) AS sin_proveedor FROM productos WHERE proveedor_id IS NULL")
      ]);
  
      res.json({
        ingresos: parseFloat(ingresos.rows[0].total),
        egresos: parseFloat(egresos.rows[0].total),
        balance: parseFloat(ingresos.rows[0].total) - parseFloat(egresos.rows[0].total),
        chequesPendientes: parseInt(chequesPend.rows[0].cantidad),
        totalEmpleados: parseInt(empleados.rows[0].total),
        totalNomina: parseFloat(empleados.rows[0].nomina),
        productosSinProveedor: parseInt(productosSinProveedor.rows[0].sin_proveedor)
      });
    } catch (error) {
      console.error("Error al obtener resumen del dashboard:", error);
      res.status(500).json({ error: "Error al obtener resumen del dashboard" });
    }
  };

const obtenerHistorico = async (req, res) => {
    const { desde, hasta } = req.query;
    try {
      const ingresos = await pool.query(
        "SELECT fecha, SUM(monto) AS total FROM ingresos WHERE fecha BETWEEN $1 AND $2 GROUP BY fecha ORDER BY fecha",
        [desde, hasta]
      );
      const egresos = await pool.query(
        "SELECT fecha, SUM(monto) AS total FROM egresos WHERE fecha BETWEEN $1 AND $2 GROUP BY fecha ORDER BY fecha",
        [desde, hasta]
      );
  
      const map = {};
  
      ingresos.rows.forEach(row => {
        map[row.fecha] = { fecha: row.fecha, ingresos: parseFloat(row.total), egresos: 0 };
      });
  
      egresos.rows.forEach(row => {
        if (!map[row.fecha]) {
          map[row.fecha] = { fecha: row.fecha, ingresos: 0, egresos: parseFloat(row.total) };
        } else {
          map[row.fecha].egresos = parseFloat(row.total);
        }
      });
  
      const data = Object.values(map).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      res.json(data);
    } catch (error) {
      console.error('Error al obtener histórico:', error);
      res.status(500).json({ error: 'Error al obtener histórico' });
    }
  };

module.exports = { obtenerResumenDashboard, obtenerHistorico };