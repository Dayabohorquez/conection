import { Router } from 'express';
import DetallePedidoController from '../controllers/detallepedido.controller.js'; 

const router = Router();

// Crear un nuevo detalle de pedido
router.post('/api/detalles-pedidos', DetallePedidoController.createDetallePedido);

// Obtener todos los detalles de pedidos
router.get('/api/detalles-pedidos', DetallePedidoController.getAllDetalles);

// Obtener un detalle de pedido por ID
router.get('/api/detalles-pedidos/:id', DetallePedidoController.getDetallePedidoById);

// Actualizar un detalle de pedido por ID
router.put('/api/detalles-pedidos/:id', DetallePedidoController.updateDetallePedido);

// Eliminar un detalle de pedido por ID
router.delete('/api/detalles-pedidos/:id', DetallePedidoController.deleteDetallePedido);

export default router;
