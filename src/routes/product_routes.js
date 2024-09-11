import express from 'express';
import ProductController from '../controllers/product_controller';

const router = express.Router();

// Obtener todos los productos
router.get('/api/producto', ProductController.getAllProducts);

// Crear un nuevo producto
router.post('/api/producto', ProductController.createProduct);

module.exports = router;
