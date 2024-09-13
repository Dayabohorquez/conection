import express from 'express';
import PedidoController from '../controllers/pedido.controller.js';

const router = express.Router();

router.get('/api/pedidos', PedidoController.obtenerPedidos);
router.get('/api/pedidos/:id_pedido', PedidoController.obtenerPedidoPorId);
router.post('/api/pedidos', PedidoController.crearPedido);
router.put('/api/pedidos/:id_pedido', PedidoController.actualizarPedido);
router.patch('/api/pedidos/:id_pedido/estado', PedidoController.cambiarEstadoPedido);
router.get('/api/usuarios/:documento/historial', PedidoController.obtenerHistorialComprasPorUsuarioId);

export default router;
