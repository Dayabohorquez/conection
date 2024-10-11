import { Router } from 'express';
import { body } from 'express-validator';
import CarritoController from '../controllers/carro.controller.js';

const router = Router();

// Obtener todos los carritos
router.get('/api/carritos', CarritoController.getAllCarritos);

// Obtener el carrito de un usuario específico por documento
router.get('/api/carritos/:documento', CarritoController.getCarritoByUsuarioId);

// Agregar un producto al carrito
router.post('/api/carritos',
    [
        body('documento').isNumeric().withMessage('El documento debe ser numérico'),
        body('id_producto').isNumeric().withMessage('El ID del producto debe ser numérico'),
        body('cantidad').isInt({ gt: 0 }).withMessage('La cantidad debe ser un número mayor que 0')
    ],
    CarritoController.addToCarrito
);

// Actualizar la cantidad de un producto en el carrito
router.put('/api/carritos/:id_carrito', CarritoController.updateQuantityInCarrito);

// Eliminar un producto del carrito
router.delete('/api/carritos/:id_carrito', CarritoController.deleteFromCarrito);

// Vaciar el carrito de un usuario
router.put('/api/carritos/vaciar/:documento', async (req, res) => {
    const { documento } = req.params;
    const { id_carrito } = req.body;
  
    try {
      // Llama al método para vaciar el carrito
      const result = await Carrito.vaciarCarrito(id_carrito);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      res.status(500).json({ message: 'Error al vaciar el carrito.' });
    }
  });
  
// Verificar la disponibilidad de un producto
router.get('/api/carritos/disponibilidad/:id_producto', CarritoController.checkAvailabilityInCarrito);

export default router;
