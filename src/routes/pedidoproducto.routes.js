import { Router } from 'express';
import PedidoProductoController from '../controllers/pedidoproducto.controller.js';

const router = Router();

// Ruta para actualizar un pedido
router.put('/api/pedidos/:id_pedido', PedidoProductoController.actualizarPedido);

// Ruta para eliminar un pedido
router.delete('/api/pedidos/:pedidoId', PedidoProductoController.eliminarPedido);

export default router;
