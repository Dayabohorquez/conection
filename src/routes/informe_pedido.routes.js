import express from 'express';
import informeController from '../controllers/informe_pedido.controller.js';

const router = express.Router();

router.get('/api/informe', informeController.getInformes);
router.get('/api/informe/:id', informeController.getInforme);
router.post('/api/informe', informeController.postInforme);
router.put('/api/informe/:id', informeController.putInforme); 

export default router;
