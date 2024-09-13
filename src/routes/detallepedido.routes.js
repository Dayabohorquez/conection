import { Router } from 'express';
import DetallePedidoController from '../controllers/detallepedido.controller.js'; // Asegúrate de que el nombre del archivo es correcto

const router = Router();

// Rutas para detalles de pedidos
router.post('/api/detalles-pedidos', DetallePedidoController.createDetallePedido);
router.get('/api/detalles-pedidos', DetallePedidoController.getAllDetalles);
router.get('/api/detalles-pedidos/:id', DetallePedidoController.getDetallePedidoById);
router.put('/api/detalles-pedidos/:id', DetallePedidoController.updateDetallePedido);
router.delete('/api/detalles-pedidos/:id', DetallePedidoController.deleteDetallePedido);

export default router;
