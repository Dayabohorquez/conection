import express from 'express';
import detallePedidoController from '../controllers/detalle_pedido.controller.js';

const router = express.Router();

router.get('/api/detalle', detallePedidoController.getDetallesPedidos);
router.get('/api/detalle/:id', detallePedidoController.getDetallePedido);
router.post('/api/detalle', detallePedidoController.postDetallePedido);
router.put('/api/detalle/:id', detallePedidoController.putDetallePedido); 
router.delete('/api/detalle/:id', detallePedidoController.deleteDetallePedido);

export default router;
