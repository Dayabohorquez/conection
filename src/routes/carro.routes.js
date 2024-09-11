import { Router } from 'express';
import CarritoController from '../controllers/carrito.controller.js';

const router = Router();

// Obtener el carrito de un usuario
router.get('/api/carritos/:documento', CarritoController.getCarritoByUsuarioId);

// Agregar un producto al carrito
router.post('/api/carritos', CarritoController.addToCarrito);

// Actualizar la cantidad de un producto en el carrito
router.put('/api/carritos/:id_carrito', CarritoController.updateQuantityInCarrito);

// Eliminar un producto del carrito
router.delete('/api/carritos/:id_carrito', CarritoController.deleteFromCarrito);

// Vaciar el carrito de un usuario
router.delete('/api/carritos/usuario/:documento', CarritoController.emptyCarrito);

// Verificar la disponibilidad de un producto en el carrito
router.get('/api/carritos/disponibilidad/:id_producto', CarritoController.checkAvailabilityInCarrito);

export default router;
