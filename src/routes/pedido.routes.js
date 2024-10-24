import express from 'express';
import PedidoController from '../controllers/pedido.controller.js';

const router = express.Router();

// Obtener todos los pedidos
router.get('/api/pedidos', PedidoController.obtenerPedidos);

// Obtener un pedido por ID
router.get('/api/pedidos/:id_pedido', PedidoController.obtenerPedidoPorId);

// Crear un nuevo pedido
router.post('/api/pedidos', PedidoController.crearPedido);

// Actualizar un pedido existente
router.put('/api/pedidos/:id_pedido', PedidoController.actualizarPedido);

// Cambiar el estado de un pedido
router.patch('/api/pedidos/:id_pedido/estado', PedidoController.cambiarEstadoPedido);

// Crear un ítem de pedido
router.post('/api/pedidos/:id_pedido/items', PedidoController.crearPedidoItem);

router.post('/api/pago-y-pedido', PedidoController.realizarPedido);

router.get('/api/historial/:documento', PedidoController.obtenerHistorial);

// Obtener ítems de un pedido
router.get('/api/pedidos/:id_pedido/items', PedidoController.obtenerItemsPorPedido);

export default router;
