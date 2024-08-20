import express from 'express';
import { getPagos, getPago, postPago, putPago, deletePago } from '../controllers/pago.controller.js';

const router = express.Router();

router.get('/pagos', getPagos);
router.get('/pagos/:id', getPago);
router.post('/pagos', postPago);
router.put('/pagos/:id', putPago); 
router.delete('/pagos/:id', deletePago);

export default router;
