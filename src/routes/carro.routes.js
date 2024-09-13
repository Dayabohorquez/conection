import { Router } from 'express';
import { body } from 'express-validator';
import CarritoController from '../controllers/carro.controller.js';

const router = Router();

// Obtener todos los carritos
router.get('/api/carritos', CarritoController.getAllCarritos);

// Obtener el carrito de un usuario por su documento
router.get('/api/carritos/:documento', CarritoController.getCarritoByUsuarioId);

// Agregar un producto al carrito
router.post('/api/carritos',
    [
        body('documento').isNumeric().withMessage('El documento debe ser numérico'),
        body('id_producto').isNumeric().withMessage('El ID del producto debe ser numérico'),
        body('cantidad').isInt({ gt: 0 }).withMessage('La cantidad debe ser un número mayor que 0')
    ],
    CarritoController.addToCarrito);

// Actualizar la cantidad de un producto en el carrito
router.put('/api/carritos/:id_carrito', CarritoController.updateQuantityInCarrito);

// Eliminar un producto del carrito
router.delete('/api/carritos/:id_carrito', CarritoController.deleteFromCarrito);

// Vaciar el carrito de un usuario
router.delete('/api/carritos/usuario/:documento', CarritoController.emptyCarrito);

// Verificar la disponibilidad de un producto en el carrito
router.get('/api/carritos/disponibilidad/:id_producto', CarritoController.checkAvailabilityInCarrito);

export default router;