const express = require('express');
const router = express.Router();
const { crearHorario, obtenerHorarios, eliminarHorario } = require('../controllers/horariosController');

router.post('/:empleado_id', crearHorario);
router.get('/', obtenerHorarios);
router.delete('/:id', eliminarHorario);

module.exports = router;
