const express = require('express');
const router = express.Router();
const { obtenerResumenDashboard, obtenerHistorico } = require('../controllers/dashboardController');

router.get('/resumen', obtenerResumenDashboard);

router.get('/historico', obtenerHistorico);


module.exports = router;