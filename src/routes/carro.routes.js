import express from 'express';
import CarritoController from '../controllers/carro.controller.js';
import { authenticateToken } from '../middleware/login.middleware.js';

const router = express.Router();

// Obtener carrito de un usuario por documento
router.get('/api/carrito/:documento', CarritoController.obtenerCarritoPorUsuarioId);

router.get('/api/carrito/completo/:documento', CarritoController.obtenerCarritoCompletoPorUsuarioId);


// Agregar un producto al carrito
router.post('/api/carrito/agregar', authenticateToken, CarritoController.agregarAlCarrito);

// Actualizar la cantidad de un producto en el carrito
router.put('/api/carrito/actualizar/:id_carrito_item', CarritoController.actualizarCantidad);

router.put('/api/actualizarTotal/:id_carrito', CarritoController.actualizarTotalCarrito);

router.put('/api/carritos/actualizar/:itemId', CarritoController.actualizarCarritoItem);

// Eliminar un producto del carrito
router.delete('/api/carrito/eliminar/:id_carrito_item', CarritoController.eliminarDelCarrito);

// Vaciar el carrito de un usuario
router.delete('/api/carrito/vaciar/:documento', CarritoController.vaciarCarrito);

router.get('/api/carrito/verificar/:id_producto/:cantidad', CarritoController.verificarDisponibilidad);

router.post('/api/carrito/crear', authenticateToken, CarritoController.crearCarrito);

export default router;