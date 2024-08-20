import { Router } from 'express';
import { getPedidos, getPedido, postPedido, putPedido } from '../controllers/pedido.controller.js';

const router = Router();

router.get('/pedido', getPedidos);
router.get('/pedido/:id', getPedido);
router.post('/pedido', postPedido);
router.put('/pedido/:id', putPedido);

export default router;
