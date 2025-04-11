const express = require('express');
const router = express.Router();
const { crearHorario, obtenerHorarios, eliminarHorario, crearSemana, obtenerSemanas } = require('../controllers/horariosController');

// PRIMERO rutas específicas:
router.post('/semanas', crearSemana);
router.get('/semanas', obtenerSemanas);

// LUEGO rutas dinámicas:
router.post('/:empleado_id', crearHorario);
router.get('/', obtenerHorarios);
router.delete('/:id', eliminarHorario);

module.exports = router;
