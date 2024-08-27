import { Router } from 'express';
import PedidoController from '../controllers/pedido.controller.js';

const router = Router();

router.get('/api/pedido', PedidoController.getPedidos);
router.get('/api/pedido/:id', PedidoController.getPedido);
router.post('/api/pedido', PedidoController.postPedido);
router.put('/api/pedido/:id', PedidoController.putPedido);

export default router;
