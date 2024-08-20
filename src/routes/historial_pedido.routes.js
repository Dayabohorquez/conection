import express from 'express';
import { getHistorials, getHistorial, postHistorial, putHistorial } from '../controllers/historial_pedido.controller.js';

const router = express.Router();

router.get('/historial', getHistorials);
router.get('/historial/:id', getHistorial);
router.post('/historial', postHistorial);
router.put('/historial/:id', putHistorial); 

export default router;