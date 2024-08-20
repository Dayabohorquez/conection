import { Router } from 'express';
import { getPedidoVentas, getPedidoVenta, postPedidoVenta, putPedidoVenta, deletePedidoVenta } from '../controllers/pedido_venta.controller.js';

const router = Router();

router.get('/pedido_venta', getPedidoVentas);
router.get('/pedido_venta/:id', getPedidoVenta);
router.post('/pedido_venta', postPedidoVenta);
router.put('/pedido_venta/:id', putPedidoVenta);
router.delete('/pedido_venta/:id', deletePedidoVenta)

export default router;
