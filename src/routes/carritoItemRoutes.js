import express from 'express';
import CarritoController from '../controllers/CarritoItemController.js'; // Asegúrate de que la ruta sea correcta
import { authenticateToken } from '../middleware/login.middleware.js';

const router = express.Router();

// Obtener todos los items del carrito
router.get('/api/carrito-item/:id_carrito', authenticateToken, CarritoController.obtenerItemsPorCarritoId);

// Agregar un item con opciones adicionales al carrito
router.post('/api/carrito-item/agregar', authenticateToken, CarritoController.agregarItemAlCarrito);

// Actualizar la cantidad de un item en el carrito
router.put('/api/carrito-item/actualizar/:id_carrito_item', authenticateToken, CarritoController.actualizarCantidad);

// Eliminar un item del carrito
router.delete('/api/carrito-item/eliminar/:id_carrito_item', authenticateToken, CarritoController.eliminarItemDelCarrito);

export default router;
