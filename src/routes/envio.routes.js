import express from 'express';
import envioController from '../controllers/envio.controller.js';

const router = express.Router();

router.get('/api/envio', envioController.getEnvios);
router.get('/api/envio/:id', envioController.getEnvio);
router.post('/api/envio', envioController.postEnvio);
router.put('/api/envio/:id', envioController.putEnvio); 
router.delete('/api/envio/:id', envioController.deleteEnvio);

export default router;
