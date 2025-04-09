const pool = require('../config/db');

const registrarIngreso = async (req, res) => {
    const { concepto, monto, fecha, metodo_pago } = req.body;
    if (!concepto || !monto || !fecha || !metodo_pago) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        await pool.query(
            `INSERT INTO ingresos (concepto, monto, fecha, metodo_pago) VALUES ($1, $2, $3, $4)`,
            [concepto, monto, fecha, metodo_pago]
        );
        res.status(201).json({ message: 'Ingreso registrado exitosamente' });
    } catch (error) {
        console.error('❌ Error al registrar ingreso:', error);
        res.status(500).json({ message: 'Error al registrar ingreso' });
    }
};

const registrarEgreso = async (req, res) => {
    const { concepto, monto, fecha, metodo_pago, beneficiario, numero_cheque } = req.body;

    if (!concepto || !monto || !fecha || !metodo_pago) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        await pool.query(
            `INSERT INTO egresos (concepto, monto, fecha, metodo_pago) 
             VALUES ($1, $2, $3, $4)`,
            [concepto, monto, fecha, metodo_pago]
        );

        if (metodo_pago === 'cheque' && beneficiario && numero_cheque) {
            await pool.query(
                `INSERT INTO cheques (monto, fecha, beneficiario, concepto, numero_cheque, estado) 
                 VALUES ($1, $2, $3, $4, $5, 'Pendiente')`,
                [monto, fecha, beneficiario, concepto, numero_cheque]
            );
        }

        res.status(201).json({ message: 'Egreso registrado correctamente' });
    } catch (error) {
        console.error('❌ Error al registrar egreso:', error);
        res.status(500).json({ message: 'Error al registrar egreso' });
    }
};

const obtenerIngresos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ingresos');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('❌ Error al obtener ingresos:', error);
        res.status(500).json({ message: 'Error al obtener ingresos' });
    }
};

const obtenerEgresos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM egresos');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('❌ Error al obtener egresos:', error);
        res.status(500).json({ message: 'Error al obtener egresos' });
    }
};

const obtenerResumen = async (req, res) => {
    try {
      const { filtro, fechaInicio, fechaFin } = req.query;
  
      let whereFecha = "1=1";
      const params = [];
  
      if (filtro === 'personalizado' && fechaInicio && fechaFin) {
        whereFecha = "fecha BETWEEN $1 AND $2";
        params.push(fechaInicio, fechaFin);
      } else {
        let inicio = "1970-01-01";
        const hoy = new Date();
        if (filtro === 'diario') {
          inicio = new Date().toISOString().split('T')[0];
        } else if (filtro === 'semanal') {
          inicio = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        } else if (filtro === 'mensual') {
          inicio = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];
        }
        whereFecha = "fecha >= $1";
        params.push(inicio);
      }
  
      const ingresos = await pool.query(`SELECT SUM(monto) AS total FROM ingresos WHERE ${whereFecha}`, params);
      const egresos = await pool.query(`SELECT SUM(monto) AS total FROM egresos WHERE ${whereFecha}`, params);
      const chequesPendientes = await pool.query(`SELECT COUNT(*) AS cantidad FROM cheques WHERE estado = 'Pendiente' AND ${whereFecha}`, params);
  
      const totalIngresos = parseFloat(ingresos.rows[0].total) || 0;
      const totalEgresos = parseFloat(egresos.rows[0].total) || 0;
      const totalChequesPendientes = parseInt(chequesPendientes.rows[0].cantidad) || 0;
      const balance = totalIngresos - totalEgresos;
  
      res.status(200).json({
        ingresos: totalIngresos,
        egresos: totalEgresos,
        balance,
        chequesPendientes: totalChequesPendientes
      });
    } catch (error) {
      console.error('❌ Error al obtener resumen financiero:', error);
      res.status(500).json({ message: 'Error al obtener resumen financiero' });
    }
};  

const obtenerMovimientos = async (req, res) => {
    try {
      const { filtro, fechaInicio, fechaFin } = req.query;
  
      let whereClause = '';
      const params = [];
  
      if (filtro === 'personalizado' && fechaInicio && fechaFin) {
        whereClause = `fecha BETWEEN $1 AND $2`;
        params.push(fechaInicio, fechaFin);
      } else {
        let inicio = '1970-01-01';
        const hoy = new Date();
        if (filtro === 'diario') {
          inicio = new Date().toISOString().split('T')[0];
        } else if (filtro === 'semanal') {
          inicio = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        } else if (filtro === 'mensual') {
          inicio = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];
        }
        whereClause = `fecha >= $1`;
        params.push(inicio);
      }
  
      const ingresosWhere = `ingresos.${whereClause}`;
      const egresosWhere = `e.${whereClause}`;
  
      const query = `
        SELECT 
            ingreso_id AS id,
            'ingreso' AS tipo, 
            concepto, 
            monto, 
            fecha, 
            metodo_pago, 
            NULL AS beneficiario, 
            NULL AS numero_cheque
        FROM ingresos
        WHERE ${ingresosWhere}
  
        UNION ALL
  
        SELECT 
            egreso_id AS id,
            'egreso' AS tipo, 
            e.concepto, 
            e.monto, 
            e.fecha, 
            e.metodo_pago, 
            c.beneficiario, 
            c.numero_cheque
        FROM egresos e
        LEFT JOIN cheques c ON e.concepto = c.concepto
        WHERE ${egresosWhere}
  
        ORDER BY fecha DESC;
      `;
  
      const result = await pool.query(query, params);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('❌ Error al obtener movimientos:', error);
      res.status(500).json({ message: 'Error al obtener movimientos' });
    }
};  

const obtenerCheques = async (req, res) => {
    try {
      const { filtro, fechaInicio, fechaFin } = req.query;
  
      let whereFecha = "1=1";
      const params = [];
  
      if (filtro === 'personalizado' && fechaInicio && fechaFin) {
        whereFecha = "cheques.fecha BETWEEN $1 AND $2";
        params.push(fechaInicio, fechaFin);
      } else {
        let inicio = "1970-01-01";
        const hoy = new Date();
        if (filtro === 'diario') {
          inicio = new Date().toISOString().split('T')[0];
        } else if (filtro === 'semanal') {
          inicio = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        } else if (filtro === 'mensual') {
          inicio = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];
        }
        whereFecha = "cheques.fecha >= $1";
        params.push(inicio);
      }
  
      const result = await pool.query(`SELECT * FROM cheques WHERE ${whereFecha}`, params);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('❌ Error al obtener cheques:', error);
      res.status(500).json({ message: 'Error al obtener cheques' });
    }
};

const eliminarIngreso = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM ingresos WHERE ingreso_id = $1', [id]);
        res.status(200).json({ mensaje: 'Ingreso eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar ingreso:', error);
      res.status(500).json({ error: 'Error al eliminar ingreso' });
    }
};  
  
const eliminarEgreso = async (req, res) => {
    try {
        const { id } = req.params;

        // Eliminar el cheque asociado al egreso (si existe)
        await pool.query('DELETE FROM cheques WHERE concepto = (SELECT concepto FROM egresos WHERE egreso_id = $1)', [id]);

        // Luego eliminar el egreso
        await pool.query('DELETE FROM egresos WHERE egreso_id = $1', [id]);

        res.status(200).json({ message: 'Egreso y cheque asociados eliminados correctamente' });
    } catch (error) {
        console.error('Error al eliminar egreso:', error);
        res.status(500).json({ message: 'Error al eliminar egreso' });
    }
};

const editarIngreso = async (req, res) => {
    const { id } = req.params;
    const { concepto, monto, fecha, metodo_pago } = req.body;
    try {
        await pool.query(
            'UPDATE ingresos SET concepto = $1, monto = $2, fecha = $3, metodo_pago = $4 WHERE ingreso_id = $5',
            [concepto, monto, fecha, metodo_pago, id]
        );
        res.status(200).json({ message: 'Ingreso actualizado correctamente' });
    } catch (error) {
        console.error('❌ Error al editar ingreso:', error);
        res.status(500).json({ message: 'Error al editar ingreso' });
    }
};

const editarEgreso = async (req, res) => {
    const { id } = req.params;
    const { concepto, monto, fecha, metodo_pago, beneficiario, numero_cheque } = req.body;
    try {
        await pool.query(
            'UPDATE egresos SET concepto = $1, monto = $2, fecha = $3, metodo_pago = $4 WHERE egreso_id = $5',
            [concepto, monto, fecha, metodo_pago, id]
        );

        // Si es cheque, actualiza también
        if (metodo_pago === 'cheque') {
            await pool.query(
                'UPDATE cheques SET beneficiario = $1, numero_cheque = $2 WHERE concepto = $3',
                [beneficiario, numero_cheque, concepto]
            );
        }

        res.status(200).json({ message: 'Egreso actualizado correctamente' });
    } catch (error) {
        console.error('❌ Error al editar egreso:', error);
        res.status(500).json({ message: 'Error al editar egreso' });
    }
};

const actualizarEstadoCheque = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        await pool.query(
            'UPDATE cheques SET estado = $1 WHERE cheque_id = $2',
            [estado, id]
        );
        res.status(200).json({ message: 'Estado del cheque actualizado' });
    } catch (error) {
        console.error('❌ Error al actualizar estado del cheque:', error);
        res.status(500).json({ message: 'Error al actualizar estado del cheque' });
    }
};


module.exports = {
    registrarIngreso,
    registrarEgreso,
    obtenerIngresos,
    obtenerEgresos,
    obtenerResumen,
    obtenerMovimientos,
    obtenerCheques,
    eliminarIngreso,
    eliminarEgreso,
    editarIngreso,
    editarEgreso,
    actualizarEstadoCheque
};
