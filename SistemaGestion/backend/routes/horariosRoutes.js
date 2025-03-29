const express = require('express');
const router = express.Router();
const { crearHorario, obtenerHorarios, eliminarHorario, guardarHorarioSemanal, obtenerHorarioSemanal } = require('../controllers/horariosController');

router.post('/:empleado_id', crearHorario);
router.get('/', obtenerHorarios);
router.delete('/:id', eliminarHorario);
router.post('/semanal/:id', guardarHorarioSemanal);
router.get('/semanal/:id', obtenerHorarioSemanal);

module.exports = router;
