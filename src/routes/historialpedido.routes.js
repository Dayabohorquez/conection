import { Router } from 'express';
import HistorialPedidoController from '../controllers/historialpedido.controller.js';

const router = Router();

// Crear un nuevo historial de pedido
router.post('/api/historial', HistorialPedidoController.createHistorial);

// Obtener todos los registros del historial
router.get('/api/historial', HistorialPedidoController.getAllHistorial);

// Obtener historial por ID de pedido
router.get('/api/historial/:pedidoId', HistorialPedidoController.getHistorialByPedidoId);

router.get('/api/historial/documento/:documento', HistorialPedidoController.getHistorialByDocumento); // Nueva ruta


export default router;
