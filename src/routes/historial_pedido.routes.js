import express from 'express';
import historialController from '../controllers/historial_pedido.controller.js';

const router = express.Router();

router.get('/api/historial', historialController.getHistorials);
router.get('/api/historial/:id', historialController.getHistorial);
router.post('/api/historial', historialController.postHistorial);
router.put('/api/historial/:id', historialController.putHistorial); 
router.delete('/api/historial/:id', historialController.deleteHistorial); 

export default router;