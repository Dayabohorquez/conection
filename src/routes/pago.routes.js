import express from 'express';
import pagoController from '../controllers/pago.controller.js';

const router = express.Router();

router.get('/pagos', pagoController.getPagos);
router.get('/pagos/:id', pagoController.getPago);
router.post('/pagos', pagoController.postPago);
router.put('/pagos/:id', pagoController.putPago); 
router.delete('/pagos/:id', pagoController.deletePago);

export default router;
