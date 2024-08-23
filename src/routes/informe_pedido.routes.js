import express from 'express';
import informeController from '../controllers/informe_pedido.controller.js';

const router = express.Router();

router.get('/informe', informeController.getInformes);
router.get('/informe/:id', informeController.getInforme);
router.post('/informe', informeController.postInforme);
router.put('/informe/:id', informeController.putInforme); 

export default router;
