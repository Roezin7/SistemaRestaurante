const express = require('express');
const router = express.Router();
const {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProveedores,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
  obtenerProductosPorProveedor
} = require('../controllers/inventarioController');

// Productos
router.get('/productos', obtenerProductos);
router.post('/productos', crearProducto);
router.put('/productos/:id', actualizarProducto);
router.delete('/productos/:id', eliminarProducto);

// Proveedores
router.get('/proveedores', obtenerProveedores);
router.post('/proveedores', crearProveedor);
router.put('/proveedores/:id', actualizarProveedor);
router.delete('/proveedores/:id', eliminarProveedor);

// Productos por proveedor
router.get('/proveedores/:id/productos', obtenerProductosPorProveedor);

module.exports = router;