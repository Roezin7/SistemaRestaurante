const express = require('express');
const router = express.Router();
const {
    registrarIngreso,
    registrarEgreso,
    obtenerIngresos,
    obtenerEgresos,
    obtenerResumen,
    obtenerMovimientos,
    obtenerCheques
} = require('../controllers/finanzasController');

// Ruta de ingresos
router.post('/ingresos', registrarIngreso);
router.get('/ingresos', obtenerIngresos);

// Ruta de egresos
router.post('/egresos', registrarEgreso);
router.get('/egresos', obtenerEgresos);

// Ruta de resumen financiero
router.get('/resumen', obtenerResumen);

// Ruta de movimientos financieros
router.get('/movimientos', obtenerMovimientos);

// Ruta para obtener los cheques
router.get('/cheques', obtenerCheques);

module.exports = router;
