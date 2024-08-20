import express from 'express';
import { getDetallesPedidos, getDetallePedido, postDetallePedido, putDetallePedido, deleteDetallePedido } from '../controllers/detalle_pedido.controller.js';

const router = express.Router();

router.get('/detalle', getDetallesPedidos);
router.get('/detalle/:id', getDetallePedido);
router.post('/detalle', postDetallePedido);
router.put('/detalle/:id', putDetallePedido); 
router.delete('/detalle/:id', deleteDetallePedido);

export default router;
