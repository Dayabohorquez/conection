import express from 'express';
import { getInformes, getInforme, postInforme, putInforme} from '../controllers/informe_pedido.controller.js';

const router = express.Router();

router.get('/informe', getInformes);
router.get('/informe/:id', getInforme);
router.post('/informe', postInforme);
router.put('/informe/:id', putInforme); 

export default router;
