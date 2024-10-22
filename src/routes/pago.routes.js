import { Router } from 'express';
import PagoController from '../controllers/pago.controller.js';

const router = Router();

// Crear un nuevo pago
router.post('/api/pago', PagoController.crearPago);

// Obtener todos los pagos
router.get('/api/pagos', PagoController.obtenerPagos);

// Obtener un pago por ID
router.get('/api/pago/:id', PagoController.obtenerPagoPorId);

// Actualizar un pago existente
router.put('/api/pago/:id', PagoController.actualizarPago);

router.put('/api/pagos/:id/estado', PagoController.actualizarEstadoPago);

// Eliminar un pago
router.delete('/api/pago/:id', PagoController.eliminarPago);

export default router;
