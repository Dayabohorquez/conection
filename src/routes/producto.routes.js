import { Router } from 'express';
import ProductoController from '../controllers/producto.controller.js';

const router = Router();

router.get('/api/producto', ProductoController.getProductos);
router.get('/api/producto/:id', ProductoController.getProducto);
router.post('/api/producto', ProductoController.postProducto);
router.put('/api/producto/:id', ProductoController.putProducto);
router.patch('/api/producto/:id', ProductoController.patchProducto);

export default router;
