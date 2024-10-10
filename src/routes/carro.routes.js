import { Router } from 'express';
import { body } from 'express-validator';
import CarritoController from '../controllers/carro.controller.js';

const router = Router();

router.get('/api/carritos', CarritoController.getAllCarritos);

router.get('/api/carritos/:documento', CarritoController.getCarritoByUsuarioId);

router.post('/api/carritos',
    [
        body('documento').isNumeric().withMessage('El documento debe ser numérico'),
        body('id_producto').isNumeric().withMessage('El ID del producto debe ser numérico'),
        body('cantidad').isInt({ gt: 0 }).withMessage('La cantidad debe ser un número mayor que 0')
    ],
    CarritoController.addToCarrito);

router.put('/api/carritos/:id_carrito', CarritoController.updateQuantityInCarrito);

router.delete('/api/carritos/:id_carrito', CarritoController.deleteFromCarrito);

router.delete('/api/carritos/usuario/:documento', CarritoController.emptyCarrito);

router.get('/api/carritos/disponibilidad/:id_producto', CarritoController.checkAvailabilityInCarrito);

export default router;