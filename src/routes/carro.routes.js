import express from 'express';
import CarritoController from '../controllers/carro.controller.js';

const router = express.Router();

// Ruta para agregar producto al carrito
router.post('/api/carrito/', CarritoController.agregarProducto);

// Ruta para actualizar la cantidad de un producto en el carrito
router.put('/api/carrito/actualizar/:documento/:id_producto', CarritoController.actualizarCantidad);

// Ruta para eliminar un producto del carrito
router.delete('/api/carrito/eliminar/:documento/:id_producto', CarritoController.eliminarProducto);

// Ruta para ver el contenido del carrito
router.get('/api/carrito/contenido/:documento', CarritoController.verContenido);

// Ruta para limpiar el carrito
router.delete('/api/carrito/limpiar/:documento', CarritoController.limpiarCarrito);

export default router;
