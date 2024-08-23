import { Router } from 'express';
import pedidoVentaController from '../controllers/pedido_venta.controller.js';

const router = Router();

router.get('/pedido_venta', pedidoVentaController.getPedidoVentas);
router.get('/pedido_venta/:id', pedidoVentaController.getPedidoVenta);
router.post('/pedido_venta', pedidoVentaController.postPedidoVenta);
router.put('/pedido_venta/:id', pedidoVentaController.putPedidoVenta);
router.delete('/pedido_venta/:id', pedidoVentaController.deletePedidoVenta);

export default router;
