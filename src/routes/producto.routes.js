import { Router } from 'express';
import ProductoController from '../controllers/producto.controller.js';

const router = Router();

router.get('/producto', ProductoController.getProductos);
router.get('/producto/:id', ProductoController.getProducto);
router.post('/producto', ProductoController.postProducto);
router.put('/producto/:id', ProductoController.putProducto);
router.patch('/producto/:id', ProductoController.patchProducto);

export default router;
