import { Router } from 'express';
import pedidoVentaController from '../controllers/pedido_venta.controller.js';

const router = Router();

router.get('/api/pedido_venta', pedidoVentaController.getPedidoVentas);
router.get('/api/pedido_venta/:id', pedidoVentaController.getPedidoVenta);
router.post('/api/pedido_venta', pedidoVentaController.postPedidoVenta);
router.put('/api/pedido_venta/:id', pedidoVentaController.putPedidoVenta);

export default router;
