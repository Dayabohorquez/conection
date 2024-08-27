import express from 'express';
import pagoController from '../controllers/pago.controller.js';

const router = express.Router();

router.get('/api/pago', pagoController.getPagos);
router.get('/api/pago/:id', pagoController.getPago);
router.post('/api/pago', pagoController.postPago);
router.put('/api/pago/:id', pagoController.putPago); 
router.delete('/api/pago/:id', pagoController.deletePago);

export default router;
