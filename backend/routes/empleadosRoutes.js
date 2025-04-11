const express = require('express');
const router = express.Router();
const { agregarEmpleado, getEmpleados, actualizarEmpleado, eliminarEmpleado } = require('../controllers/empleadosController');

// Crear un nuevo empleado
router.post('/', agregarEmpleado);

// Obtener todos los empleados
router.get('/', getEmpleados);

// Actualizar un empleado existente
router.put('/:empleado_id', actualizarEmpleado);

// Eliminar un empleado
router.delete('/:empleado_id', eliminarEmpleado);

module.exports = router;
