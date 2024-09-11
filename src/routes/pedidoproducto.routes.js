import { Router } from 'express';
import PedidoProductoController from '../controllers/pedidoProducto.controller.js';

const router = Router();

// Eliminar un pedido y sus productos asociados
router.delete('/api/pedido/:pedidoId', PedidoProductoController.eliminarPedido);

// Actualizar un pedido
router.put('/api/pedido/:pedidoId', PedidoProductoController.actualizarPedido);

export default router;
