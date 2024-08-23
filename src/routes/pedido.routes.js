import { Router } from 'express';
import PedidoController from '../controllers/pedido.controller.js';

const router = Router();

router.get('/pedido', PedidoController.getPedidos);
router.get('/pedido/:id', PedidoController.getPedido);
router.post('/pedido', PedidoController.postPedido);
router.put('/pedido/:id', PedidoController.putPedido);

export default router;
