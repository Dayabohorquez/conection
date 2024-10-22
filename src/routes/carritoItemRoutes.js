import express from 'express';
import CarritoItemController from '../controllers/CarritoItemController.js';
import { authenticateToken } from '../middleware/login.middleware.js';

const router = express.Router();

// Obtener todos los items del carrito
router.get('/api/carrito-item/:id_carrito', CarritoItemController.obtenerItemsPorCarritoId);

// Agregar un item al carrito
router.post('/api/carrito-item/agregar', authenticateToken, CarritoItemController.agregarItemAlCarrito);

// Actualizar la cantidad de un item en el carrito
router.put('/api/carrito-item/actualizar/:id_carrito_item', CarritoItemController.actualizarCantidad);

// Eliminar un item del carrito
router.delete('/api/carrito-item/eliminar/:id_carrito_item', CarritoItemController.eliminarItemDelCarrito);

export default router;
