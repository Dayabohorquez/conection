import express from 'express';
import envioController from '../controllers/envio.controller.js';

const router = express.Router();

router.get('/envio', envioController.getEnvios);
router.get('/envio/:id', envioController.getEnvio);
router.post('/envio', envioController.postEnvio);
router.put('/envio/:id', envioController.putEnvio); 
router.delete('/envio/:id', envioController.deleteEnvio);

export default router;
