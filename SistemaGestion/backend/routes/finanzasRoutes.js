const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/finanzasController');

// Ruta de ingresos
router.post('/ingresos', registrarIngreso);
router.get('/ingresos', obtenerIngresos);
router.delete('/ingresos/:id', eliminarIngreso);
router.put('/ingresos/:id', editarIngreso);



// Ruta de egresos
router.post('/egresos', registrarEgreso);
router.get('/egresos', obtenerEgresos);
router.delete('/egresos/:id', eliminarEgreso);
router.put('/egresos/:id', editarEgreso);

// Ruta de resumen financiero
router.get('/resumen', obtenerResumen);

// Ruta de movimientos financieros
router.get('/movimientos', obtenerMovimientos);

// Ruta para obtener los cheques
router.get('/cheques', obtenerCheques);
router.put('/cheques/:id', actualizarEstadoCheque);


module.exports = router;
