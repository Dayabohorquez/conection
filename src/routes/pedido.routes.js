import { Router } from 'express';
import PedidoController from '../controllers/pedido.controller.js';

const router = Router();

// Obtener todos los pedidos
router.get('/api/pedidos', PedidoController.obtenerPedidos);

// Obtener un pedido por ID
router.get('/api/pedido/:id_pedido', PedidoController.obtenerPedidoPorId);

// Crear un nuevo pedido
router.post('/api/pedido', PedidoController.crearPedido);

// Actualizar un pedido existente
router.put('/api/pedido/:id_pedido', PedidoController.actualizarPedido);

// Eliminar un pedido
router.delete('/api/pedido/:id_pedido', PedidoController.eliminarPedido);

// Obtener historial de compras por ID de usuario
router.get('/api/historial-compras/:documento', PedidoController.obtenerHistorialComprasPorUsuarioId);

export default router;
