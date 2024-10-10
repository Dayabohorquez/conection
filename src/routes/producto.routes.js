import express from 'express';
import ProductoController from '../controllers/producto.controller.js';

const router = express.Router();

// Obtener todos los productos
router.get('/api/productos', ProductoController.obtenerProductos);

// Obtener producto por ID
router.get('/api/productos/:idProducto', ProductoController.obtenerProductoPorId);

// Crear nuevo producto
router.post('/api/productos', ProductoController.crearProducto);

// Actualizar producto
router.put('/api/productos/:idProducto', ProductoController.actualizarProducto);

// Cambiar estado de un producto
router.patch('/api/productos/:idProducto/estado', ProductoController.cambiarEstadoProducto);

export default router;
