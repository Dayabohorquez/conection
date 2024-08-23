import express from 'express';
import historialController from '../controllers/historial_pedido.controller.js';

const router = express.Router();

router.get('/historial', historialController.getHistorials);
router.get('/historial/:id', historialController.getHistorial);
router.post('/historial', historialController.postHistorial);
router.put('/historial/:id', historialController.putHistorial); 

export default router;