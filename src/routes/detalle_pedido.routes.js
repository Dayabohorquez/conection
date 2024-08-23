import express from 'express';
import detallePedidoController from '../controllers/detalle_pedido.controller.js';

const router = express.Router();

router.get('/detalle', detallePedidoController.getDetallesPedidos);
router.get('/detalle/:id', detallePedidoController.getDetallePedido);
router.post('/detalle', detallePedidoController.postDetallePedido);
router.put('/detalle/:id', detallePedidoController.putDetallePedido); 
router.delete('/detalle/:id', detallePedidoController.deleteDetallePedido);

export default router;
