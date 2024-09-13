// src/routes/pedido.routes.js
import express from 'express';
import PedidoController from '../controllers/pedido.controller.js';

const router = express.Router();

// Obtener todos los pedidos
router.get('/api/pedidos', PedidoController.obtenerPedidos);

// Obtener un pedido por ID
router.get('/api/pedidos/:id_pedido', PedidoController.obtenerPedidoPorId);

// Crear un nuevo pedido
router.post('/api/pedidos', PedidoController.crearPedido);

// Actualizar un pedido
router.put('/api/pedidos/:id_pedido', PedidoController.actualizarPedido);

router.patch('/api/pedidos/:id_pedido/', PedidoController.cambiarEstadoPedido);

router.get('/api/historial-compras/:documento', PedidoController.obtenerHistorialComprasPorUsuarioId);

export default router;
