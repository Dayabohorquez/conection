import express from 'express';
import PedidoItemController from '../controllers/PedidoItemController.js';

const router = express.Router();

// Crear un nuevo item de pedido
router.post('/pedido-item', PedidoItemController.crearPedidoItem);

// Obtener todos los items de un pedido
router.get('/pedido-item/:id_pedido', PedidoItemController.obtenerItemsPorPedido);

// Obtener un item de pedido por ID
router.get('/pedido-item/id/:id_pedido_item', PedidoItemController.obtenerPedidoItemPorId);

// Actualizar un item de pedido
router.put('/pedido-item/:id_pedido_item', PedidoItemController.actualizarPedidoItem);

// Eliminar un item de pedido
router.delete('/pedido-item/:id_pedido_item', PedidoItemController.eliminarPedidoItem);

export default router;
