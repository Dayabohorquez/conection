import { Router } from 'express';
import CarritoController from '../controllers/carro.controller.js';

const router = Router();

// Obtener todos los carritos
router.get('/api/carritos', CarritoController.getAllCarritos);

// Obtener el carrito de un usuario específico por documento
router.get('/api/carritos/:documento', CarritoController.getCarritoByUsuarioId);

// Agregar un producto al carrito
router.post('/api/carritos', CarritoController.addToCarrito);

// Actualizar la cantidad de un producto en el carrito
router.put('/api/carritos/:id_carrito', CarritoController.updateQuantityInCarrito);

// Eliminar un producto del carrito
router.delete('/api/carritos/:id_carrito', CarritoController.deleteFromCarrito);

// Vaciar el carrito de un usuario
router.delete('/api/carritos/vaciar/:documento', CarritoController.vaciarCarrito);

// Verificar la disponibilidad de un producto
router.get('/api/carritos/disponibilidad/:id_producto', CarritoController.checkAvailabilityInCarrito);

export default router;
