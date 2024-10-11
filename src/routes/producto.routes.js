import express from 'express';
import ProductoController from '../controllers/producto.controller.js';

const router = express.Router();

// Obtener todos los productos
router.get('/api/productos', ProductoController.obtenerProductos);

<<<<<<< HEAD
// Obtener productos por tipo de flor
router.get('/api/productos/tipoFlor/:tipoFlorId', ProductoController.obtenerProductosPorTipoFlor);

// Obtener productos por fecha especial
router.get('/api/productos/fechaEspecial/:fechaEspecialId', ProductoController.obtenerProductosPorFechaEspecial);
=======
// Obtener producto por ID
router.get('/api/productos/:idProducto', ProductoController.obtenerProductoPorId);
>>>>>>> de1ab07aebece760b71bf4c7d487f6f7fbe4ce48

// Crear nuevo producto
router.post('/api/productos', ProductoController.crearProducto);

// Actualizar producto
router.put('/api/productos/:idProducto', ProductoController.actualizarProducto);

// Cambiar estado de un producto
router.patch('/api/productos/:idProducto/estado', ProductoController.cambiarEstadoProducto);

export default router;
