import { Router } from 'express';
import PagoController from '../controllers/pago.controller.js';

const router = Router();

// Crear un nuevo pago
router.post('/api/pago', PagoController.createPago);

// Obtener todos los pagos
router.get('/api/pagos', PagoController.getPagos);

// Obtener un pago por ID
router.get('/api/pago/:id', PagoController.getPagoById);

// Actualizar un pago existente
router.put('/api/pago/:id', PagoController.updatePago);

router.put('/api/pagos/:id/estado', PagoController.actualizarEstadoPago);


// Eliminar un pago
router.delete('/api/pago/:id', PagoController.deletePago);

export default router;
