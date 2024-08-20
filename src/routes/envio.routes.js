import express from 'express';
import { getEnvios, getEnvio, postEnvio, putEnvio, deleteEnvio} from '../controllers/envio.controller.js';

const router = express.Router();

router.get('/envio', getEnvios);
router.get('/envio/:id', getEnvio);
router.post('/envio', postEnvio);
router.put('/envio/:id', putEnvio); 
router.delete('/envio/:id', deleteEnvio);

export default router;
