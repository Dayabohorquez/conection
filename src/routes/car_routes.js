import express from 'express';

const router = express.Router();

// Ver el carrito
router.get('/api/cart', cartController.viewCart);

// Agregar producto al carrito
router.post('/api/cart/add', cartController.addToCart);

// Eliminar producto del carrito
router.delete('api/cart/remove/:productId', cartController.removeFromCart);

module.exports = router;
