import { Router } from 'express';
import { getProductos, getProducto, postProducto, putProducto, patchProducto, } from '../controllers/producto.controller.js';

const router = Router();

router.get('/producto/', getProductos);
router.get('/producto/:id', getProducto);
router.post('/producto/', postProducto);
router.put('/producto/:id', putProducto);
router.patch('/producto/:id', patchProducto);

export default router;
