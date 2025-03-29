const express = require('express');
const router = express.Router();
const { getInventario, addProducto } = require('../controllers/inventarioController');

router.get('/', getInventario);
router.post('/add', addProducto);

module.exports = router;
