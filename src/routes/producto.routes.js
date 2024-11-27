import express from 'express';
import ProductoController from '../controllers/producto.controller.js';

const router = express.Router();

// Obtener todos los productos
router.get('/api/productos', ProductoController.obtenerProductos);

router.get('/api/productos/agotados', ProductoController.obtenerProductosAgotadosYNotificar);

// Obtener productos por tipo de flor
router.get('/api/productos/:tipoFlorId', ProductoController.obtenerProductosPorTipoFlor);

// Obtener productos por fecha especial
router.get('/api/productos/fecha-especial/:fechaEspecialId', ProductoController.obtenerProductosPorFechaEspecial);

// Crear nuevo producto
router.post('/api/productos', ProductoController.crearProducto);

// Actualizar producto
router.put('/api/productos/:idProducto', ProductoController.actualizarProducto);

router.patch('/api/productos/:idProducto/cantidad', ProductoController.actualizarCantidad);

// Cambiar estado de un producto
router.patch('/api/productos/:idProducto/estado', ProductoController.cambiarEstadoProducto);

export default router;
